-- ============================================================
-- Migration: 20260826000001_transactions_status_columns
-- Adds payment_status, fee_status, payout_status to transactions
-- 
-- NOTE: transactions.amount is stored in rands (not cents)
--       fee = MIN(150, gross) — no conversion needed
-- ============================================================

-- payment_status: tracks whether Ozow collected the donation
-- Independent of payout — a completed payment is NOT automatically paid out
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS payment_status text
    NOT NULL
    DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'completed', 'failed'));

-- fee_status: tracks whether this transaction was included in a ScanTippr fee calculation
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS fee_status text
    NOT NULL
    DEFAULT 'unpaid'
    CHECK (fee_status IN (
      'unpaid',          -- not yet in any fee calculation
      'included',        -- in a period calculation, not yet settled
      'collected',       -- fee paid to ScanTippr via Ozow
      'in_float',        -- fee remains in Ozow float (valid settled state)
      'not_applicable',  -- employee gross was R0, no fee arises
      'failed'           -- fee payout instruction failed
    ));

-- payout_status: tracks whether the client net amount from this transaction was paid out
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS payout_status text
    NOT NULL
    DEFAULT 'unpaid'
    CHECK (payout_status IN (
      'unpaid',    -- not yet in any payout period
      'included',  -- in a period, payout not yet sent
      'paid',      -- net amount paid to recipient via Ozow
      'not_due',   -- net = R0 (fee consumed full gross), nothing to pay
      'failed'     -- payout instruction failed
    ));

-- Backfill existing transactions:
-- existing records with status='success' → payment_status='completed'
-- existing records with status='failed'  → payment_status='failed'
-- anything else stays 'pending'
UPDATE transactions
  SET payment_status = 'completed'
  WHERE status = 'success';

UPDATE transactions
  SET payment_status = 'failed'
  WHERE status = 'failed';

-- Index for common query: "find all unpaid completed transactions"
CREATE INDEX IF NOT EXISTS idx_transactions_payment_payout_status
  ON transactions (payment_status, payout_status);

CREATE INDEX IF NOT EXISTS idx_transactions_fee_status
  ON transactions (fee_status);

CREATE INDEX IF NOT EXISTS idx_transactions_guard_id_created
  ON transactions (guard_id, created_at);

COMMENT ON COLUMN transactions.payment_status IS
  'Ozow payin status. Set by webhook only. Independent of payout_status.';
COMMENT ON COLUMN transactions.fee_status IS
  'ScanTippr fee allocation status. Set by fee calculation engine only.';
COMMENT ON COLUMN transactions.payout_status IS
  'Client net payout status. Set by payout engine only.';
