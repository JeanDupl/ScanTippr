-- ============================================================
-- Migration: 20260826000003_create_payout_line_items
-- Per-employee audit trail + relational tip↔line_item join
-- ============================================================

-- ── payout_line_items ────────────────────────────────────────────────────────
-- One row per employee per payout period.
-- gross/fee/net stored immutably at calculation time — never recalculated.
-- guard_name snapshotted so historical reports are stable even if name changes.

CREATE TABLE IF NOT EXISTS payout_line_items (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  payout_period_id    uuid NOT NULL
    REFERENCES payout_periods(id) ON DELETE CASCADE,

  -- Guard reference — text to match guards.id (character varying)
  guard_id            text NOT NULL,
  guard_name          text NOT NULL,  -- snapshot at calculation time

  -- Period (denormalised for reporting queries without joining payout_periods)
  period_month        int  NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  period_year         int  NOT NULL CHECK (period_year >= 2024),

  -- Calculated amounts (rands) — immutable once written
  gross_amount        numeric(10,2) NOT NULL CHECK (gross_amount >= 0),
  fee_amount          numeric(10,2) NOT NULL CHECK (fee_amount >= 0),
  net_amount          numeric(10,2) NOT NULL CHECK (net_amount >= 0),
  -- fee_amount = MIN(150, gross_amount) — enforced in application layer
  -- net_amount = gross_amount - fee_amount

  tip_count           int NOT NULL DEFAULT 0 CHECK (tip_count >= 0),

  created_at          timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payout_line_items_period
  ON payout_line_items (payout_period_id);

CREATE INDEX IF NOT EXISTS idx_payout_line_items_guard
  ON payout_line_items (guard_id);

CREATE INDEX IF NOT EXISTS idx_payout_line_items_period_year_month
  ON payout_line_items (period_year, period_month);

COMMENT ON TABLE payout_line_items IS
  'Per-employee audit trail for each payout period. '
  'gross/fee/net are immutable once written — stored at calculation time, never recalculated. '
  'Use payout_period_adjustments for corrections.';
COMMENT ON COLUMN payout_line_items.guard_name IS
  'Snapshotted at calculation time. Stable for historical reports even if guard name changes.';
COMMENT ON COLUMN payout_line_items.fee_amount IS
  'MIN(150, gross_amount) — calculated and stored immutably. '
  'Preserves audit trail even if fee structure changes in future.';


-- ── payout_line_item_tips ────────────────────────────────────────────────────
-- Relational join: transaction ↔ payout_line_item
-- This is the single source of truth for which transactions are in which period.
-- Replaces tip_ids uuid[] array approach — enables clean reconciliation queries.

CREATE TABLE IF NOT EXISTS payout_line_item_tips (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  payout_line_item_id   uuid NOT NULL
    REFERENCES payout_line_items(id) ON DELETE CASCADE,

  transaction_id        uuid NOT NULL
    REFERENCES transactions(id) ON DELETE RESTRICT,
  -- RESTRICT: cannot delete a transaction that has been included in a payout

  created_at            timestamptz NOT NULL DEFAULT now(),

  -- Each transaction can only appear in one line item
  UNIQUE (payout_line_item_id, transaction_id),
  UNIQUE (transaction_id)  -- global: one transaction in at most one payout period
);

CREATE INDEX IF NOT EXISTS idx_pli_tips_line_item
  ON payout_line_item_tips (payout_line_item_id);

CREATE INDEX IF NOT EXISTS idx_pli_tips_transaction
  ON payout_line_item_tips (transaction_id);

COMMENT ON TABLE payout_line_item_tips IS
  'Relational join between transactions and payout_line_items. '
  'Source of truth for transaction↔period association. '
  'A transaction can appear in at most one payout line item (enforced by UNIQUE constraint).';
