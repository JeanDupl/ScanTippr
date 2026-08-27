-- ============================================================
-- Migration: 20260826000004_create_adjustments_and_fee_records
-- Corrections/reversals for closed periods + ScanTippr revenue ledger
-- ============================================================

-- ── payout_period_adjustments ────────────────────────────────────────────────
-- Append-only. Never edit closed payout_periods — create an adjustment instead.
-- Adjustment records themselves are also immutable once created.

CREATE TABLE IF NOT EXISTS payout_period_adjustments (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  original_period_id    uuid NOT NULL
    REFERENCES payout_periods(id) ON DELETE RESTRICT,
  -- RESTRICT: keep history — cannot delete a period that has adjustments

  adjustment_type       text NOT NULL
    CHECK (adjustment_type IN (
      'reversal',    -- full reversal of the original period
      'correction',  -- partial correction to fee or net amount
      'write_off'    -- irrecoverable amount, written off
    )),

  reason                text NOT NULL,  -- human-readable explanation, required

  -- Signed adjustment amounts (rands) — positive = increase, negative = decrease
  fee_adjustment        numeric(10,2) NOT NULL DEFAULT 0,
  net_adjustment        numeric(10,2) NOT NULL DEFAULT 0,

  -- Who authorised this adjustment (FK to auth.users via profiles)
  created_by            uuid,

  notes                 text,
  created_at            timestamptz NOT NULL DEFAULT now()

  -- No UPDATE or DELETE trigger needed — RLS will enforce append-only at DB level
);

CREATE INDEX IF NOT EXISTS idx_adjustments_period
  ON payout_period_adjustments (original_period_id);

CREATE INDEX IF NOT EXISTS idx_adjustments_created_at
  ON payout_period_adjustments (created_at);

COMMENT ON TABLE payout_period_adjustments IS
  'Corrections and reversals for closed payout periods. Append-only — never edit. '
  'Reconciliation = original payout_period amounts + SUM of all adjustments for that period.';
COMMENT ON COLUMN payout_period_adjustments.fee_adjustment IS
  'Signed amount in rands. Positive = additional fee charged. Negative = fee reduction.';
COMMENT ON COLUMN payout_period_adjustments.net_adjustment IS
  'Signed amount in rands. Positive = additional payout. Negative = clawback.';


-- ── scantippr_fee_records ────────────────────────────────────────────────────
-- ScanTippr's own revenue ledger.
-- Completely separate from recipient payout records.
-- Answers: "How much did ScanTippr earn in August 2026?"
--          "Which fees are still sitting in the Ozow float?"
--          "Which fees have been paid to our bank account?"

CREATE TABLE IF NOT EXISTS scantippr_fee_records (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  period_month          int  NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  period_year           int  NOT NULL CHECK (period_year >= 2024),

  -- Link to the payout period that generated this fee
  payout_period_id      uuid NOT NULL
    REFERENCES payout_periods(id) ON DELETE RESTRICT,

  -- Who generated this fee
  recipient_type        text NOT NULL CHECK (recipient_type IN ('company', 'guard')),
  recipient_id          text NOT NULL,

  -- ScanTippr's revenue for this client/period (rands)
  fee_amount            numeric(10,2) NOT NULL CHECK (fee_amount >= 0),

  -- How the fee was/will be collected
  disposal_mode         text NOT NULL DEFAULT 'pending_decision'
    CHECK (disposal_mode IN (
      'payout_to_scantippr',  -- Ozow payout instruction to ScanTippr account
      'remain_in_float',      -- left in Ozow float
      'pending_decision'      -- not yet decided
    )),

  status                text NOT NULL DEFAULT 'pending'
    CHECK (status IN (
      'pending',    -- calculated, not yet actioned
      'submitted',  -- payout instruction sent to Ozow
      'collected',  -- confirmed received by ScanTippr
      'in_float',   -- remaining in Ozow float
      'failed'      -- instruction failed
    )),

  ozow_payout_id        text,       -- only set if disposal_mode = payout_to_scantippr
  submitted_at          timestamptz,
  settled_at            timestamptz,
  notes                 text,
  created_at            timestamptz NOT NULL DEFAULT now(),

  -- One fee record per payout period — no duplicates
  UNIQUE (payout_period_id)
);

CREATE INDEX IF NOT EXISTS idx_fee_records_period
  ON scantippr_fee_records (period_year, period_month);

CREATE INDEX IF NOT EXISTS idx_fee_records_status
  ON scantippr_fee_records (status);

CREATE INDEX IF NOT EXISTS idx_fee_records_recipient
  ON scantippr_fee_records (recipient_type, recipient_id);

COMMENT ON TABLE scantippr_fee_records IS
  'ScanTippr revenue ledger. Independent from recipient payout records. '
  'One record per payout period. Reconcile ScanTippr revenue independently from client payouts.';
COMMENT ON COLUMN scantippr_fee_records.fee_amount IS
  'ScanTippr fee for this period in rands. = SUM(payout_line_items.fee_amount) for this period.';
