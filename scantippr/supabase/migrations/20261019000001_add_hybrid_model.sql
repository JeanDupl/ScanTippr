-- ============================================================
-- Migration: Add Hybrid model type to companies
-- 2026-10-19
-- ============================================================

-- Add model_type column to companies table
-- 'company'     = existing: one company bank account, company pays employees
-- 'independent' = existing: individual guard with own bank account
-- 'hybrid'      = new: company registered, but payouts go to each employee's own bank
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS model_type TEXT NOT NULL DEFAULT 'company'
    CHECK (model_type IN ('company', 'hybrid'));

-- Add comment for clarity
COMMENT ON COLUMN companies.model_type IS
  'company = single company bank payout; hybrid = per-employee direct payout';

-- Update payout_periods to allow hybrid as a recipient_type label
-- (recipient_id still points to company.id for hybrid periods,
--  but we store the model at calculation time for auditability)
ALTER TABLE payout_periods
  ADD COLUMN IF NOT EXISTS company_model_type TEXT;

COMMENT ON COLUMN payout_periods.company_model_type IS
  'Snapshot of the company model_type at the time of payout (company or hybrid)';
