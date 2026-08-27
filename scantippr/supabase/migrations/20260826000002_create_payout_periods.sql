-- ============================================================
-- Migration: 20260826000002_create_payout_periods
-- One record per recipient per billing period
-- Immutable once both status tracks reach terminal values
-- ============================================================

CREATE TABLE IF NOT EXISTS payout_periods (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Period
  period_month          int  NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  period_year           int  NOT NULL CHECK (period_year >= 2024),

  -- Recipient
  recipient_type        text NOT NULL CHECK (recipient_type IN ('company', 'guard')),
  recipient_id          text NOT NULL,
  -- NOTE: text to accommodate both companies.id (uuid stored as text)
  --       and guards.id (character varying). Cast in application layer as needed.

  -- Calculated amounts (rands) — immutable after creation
  gross_amount          numeric(10,2) NOT NULL CHECK (gross_amount >= 0),
  fee_amount            numeric(10,2) NOT NULL CHECK (fee_amount >= 0),
  net_amount            numeric(10,2) NOT NULL CHECK (net_amount >= 0),
  -- Invariant: fee_amount = MIN(150 * employee_count_with_donations, gross_amount)
  -- Invariant: net_amount = gross_amount - fee_amount

  -- Bank details snapshot (recipient's bank at time of payout — never changes)
  bank_account_number   text NOT NULL,
  bank_name             text NOT NULL,
  bank_account_holder   text NOT NULL,
  bank_account_type     text NOT NULL,

  -- Fee disposal: how ScanTippr's fee portion is handled
  fee_disposal_mode     text NOT NULL DEFAULT 'pending_decision'
    CHECK (fee_disposal_mode IN (
      'payout_to_scantippr',  -- instruct Ozow to pay fee to ScanTippr account
      'remain_in_float',      -- leave in Ozow float, record internally only
      'pending_decision'      -- not yet decided
    )),

  -- ScanTippr fee payout status (instruction #1)
  fee_payout_status     text NOT NULL DEFAULT 'pending'
    CHECK (fee_payout_status IN (
      'pending',         -- calculated, not yet actioned
      'submitted',       -- instruction sent to Ozow
      'collected',       -- confirmed paid to ScanTippr
      'in_float',        -- deliberately left in Ozow float
      'not_applicable',  -- total fee for period is R0
      'failed'           -- instruction failed
    )),
  fee_ozow_payout_id    text,           -- returned by Ozow, only if payout_to_scantippr
  fee_submitted_at      timestamptz,
  fee_collected_at      timestamptz,

  -- Client net payout status (instruction #2)
  net_payout_status     text NOT NULL DEFAULT 'pending'
    CHECK (net_payout_status IN (
      'pending',    -- calculated, not yet sent
      'submitted',  -- instruction sent to Ozow
      'paid',       -- confirmed paid to recipient
      'not_due',    -- net amount is R0, nothing to pay
      'failed'      -- instruction failed
    )),
  net_ozow_payout_id    text,           -- returned by Ozow
  net_submitted_at      timestamptz,
  net_paid_at           timestamptz,

  -- Metadata
  created_at            timestamptz NOT NULL DEFAULT now(),

  -- One record per recipient per month — no duplicates
  UNIQUE (period_month, period_year, recipient_type, recipient_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payout_periods_recipient
  ON payout_periods (recipient_type, recipient_id);

CREATE INDEX IF NOT EXISTS idx_payout_periods_period
  ON payout_periods (period_year, period_month);

CREATE INDEX IF NOT EXISTS idx_payout_periods_net_status
  ON payout_periods (net_payout_status);

-- ── Immutability trigger ─────────────────────────────────────────────────────
-- Terminal states per track:
--   fee_payout_status: collected | in_float | not_applicable | failed
--   net_payout_status: paid | not_due | failed
-- Once BOTH tracks are terminal, the period is closed and cannot be modified.
-- Corrections must go through payout_period_adjustments.

CREATE OR REPLACE FUNCTION lock_closed_payout_period()
RETURNS TRIGGER AS $$
DECLARE
  fee_terminal boolean;
  net_terminal boolean;
BEGIN
  fee_terminal := OLD.fee_payout_status IN ('collected', 'in_float', 'not_applicable', 'failed');
  net_terminal := OLD.net_payout_status IN ('paid', 'not_due', 'failed');

  IF fee_terminal AND net_terminal THEN
    RAISE EXCEPTION
      'Payout period % is closed (fee_status=%, net_status=%) and cannot be modified. '
      'Create a record in payout_period_adjustments instead.',
      OLD.id, OLD.fee_payout_status, OLD.net_payout_status;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_payout_period_immutability
  BEFORE UPDATE ON payout_periods
  FOR EACH ROW
  EXECUTE FUNCTION lock_closed_payout_period();

-- Comments
COMMENT ON TABLE payout_periods IS
  'One record per recipient per billing period. Immutable once both status tracks are terminal. '
  'Corrections via payout_period_adjustments only.';
COMMENT ON COLUMN payout_periods.gross_amount IS
  'Sum of all employee gross donations for the period. Stored in rands. Immutable after creation.';
COMMENT ON COLUMN payout_periods.fee_amount IS
  'Sum of all employee ScanTippr fees (MIN(150, gross) per employee). Immutable after creation.';
COMMENT ON COLUMN payout_periods.net_amount IS
  'gross_amount - fee_amount. This is the amount instructed to Ozow for payout. Immutable after creation.';
COMMENT ON COLUMN payout_periods.bank_account_number IS
  'Snapshotted at payout time. Historical record of where money was sent.';
