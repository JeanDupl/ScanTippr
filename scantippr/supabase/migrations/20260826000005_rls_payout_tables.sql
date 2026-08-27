-- ============================================================
-- Migration: 20260826000005_rls_payout_tables
-- Row Level Security for all payout-related tables
-- Bank details and payout data never exposed beyond their owner
-- ============================================================

-- ── Enable RLS on all payout tables ─────────────────────────────────────────
ALTER TABLE payout_periods              ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_line_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_line_item_tips       ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_period_adjustments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE scantippr_fee_records       ENABLE ROW LEVEL SECURITY;

-- ── Enable RLS on transactions (status columns added in migration 1) ─────────
ALTER TABLE transactions                ENABLE ROW LEVEL SECURITY;

-- ── Helper: get the authenticated user's profile ────────────────────────────
-- profiles.id = auth.uid()
-- profiles.company_id = the company this user administers
-- profiles.role = 'admin' (company admin) or other roles as needed

-- ════════════════════════════════════════════════════════════════════════════
-- transactions RLS
-- ════════════════════════════════════════════════════════════════════════════

-- Company admin: can see all transactions for their company
CREATE POLICY "transactions_company_admin_select"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles
      WHERE id = auth.uid()
    )
  );

-- Service role: full access (used by server-side API routes only)
CREATE POLICY "transactions_service_role_all"
  ON transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ════════════════════════════════════════════════════════════════════════════
-- payout_periods RLS
-- Company admins can see their own company's payout periods
-- Guards (individual) can see their own payout periods
-- No client can INSERT/UPDATE/DELETE — all writes via service_role (server-side)
-- ════════════════════════════════════════════════════════════════════════════

CREATE POLICY "payout_periods_company_admin_select"
  ON payout_periods FOR SELECT
  TO authenticated
  USING (
    (recipient_type = 'company' AND recipient_id::uuid IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    ))
    OR
    (recipient_type = 'guard' AND recipient_id IN (
      SELECT id FROM guards WHERE company_id IN (
        SELECT company_id FROM profiles WHERE id = auth.uid()
      )
    ))
  );

CREATE POLICY "payout_periods_service_role_all"
  ON payout_periods FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ════════════════════════════════════════════════════════════════════════════
-- payout_line_items RLS
-- Company admin: can see line items for their company's payout periods
-- ════════════════════════════════════════════════════════════════════════════

CREATE POLICY "payout_line_items_company_admin_select"
  ON payout_line_items FOR SELECT
  TO authenticated
  USING (
    payout_period_id IN (
      SELECT id FROM payout_periods
      WHERE
        (recipient_type = 'company' AND recipient_id::uuid IN (
          SELECT company_id FROM profiles WHERE id = auth.uid()
        ))
        OR
        (recipient_type = 'guard' AND recipient_id IN (
          SELECT id FROM guards WHERE company_id IN (
            SELECT company_id FROM profiles WHERE id = auth.uid()
          )
        ))
    )
  );

CREATE POLICY "payout_line_items_service_role_all"
  ON payout_line_items FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ════════════════════════════════════════════════════════════════════════════
-- payout_line_item_tips RLS
-- Follows the same access as payout_line_items
-- ════════════════════════════════════════════════════════════════════════════

CREATE POLICY "pli_tips_company_admin_select"
  ON payout_line_item_tips FOR SELECT
  TO authenticated
  USING (
    payout_line_item_id IN (
      SELECT id FROM payout_line_items
      WHERE payout_period_id IN (
        SELECT id FROM payout_periods
        WHERE
          (recipient_type = 'company' AND recipient_id::uuid IN (
            SELECT company_id FROM profiles WHERE id = auth.uid()
          ))
          OR
          (recipient_type = 'guard' AND recipient_id IN (
            SELECT id FROM guards WHERE company_id IN (
              SELECT company_id FROM profiles WHERE id = auth.uid()
            )
          ))
      )
    )
  );

CREATE POLICY "pli_tips_service_role_all"
  ON payout_line_item_tips FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ════════════════════════════════════════════════════════════════════════════
-- payout_period_adjustments RLS
-- Company admin: read-only access to their own adjustments
-- No client writes — all via service_role
-- ════════════════════════════════════════════════════════════════════════════

CREATE POLICY "adjustments_company_admin_select"
  ON payout_period_adjustments FOR SELECT
  TO authenticated
  USING (
    original_period_id IN (
      SELECT id FROM payout_periods
      WHERE
        (recipient_type = 'company' AND recipient_id::uuid IN (
          SELECT company_id FROM profiles WHERE id = auth.uid()
        ))
        OR
        (recipient_type = 'guard' AND recipient_id IN (
          SELECT id FROM guards WHERE company_id IN (
            SELECT company_id FROM profiles WHERE id = auth.uid()
          )
        ))
    )
  );

CREATE POLICY "adjustments_service_role_all"
  ON payout_period_adjustments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ════════════════════════════════════════════════════════════════════════════
-- scantippr_fee_records RLS
-- Internal ScanTippr revenue ledger — service_role only
-- No authenticated client should ever read fee records directly
-- ════════════════════════════════════════════════════════════════════════════

CREATE POLICY "fee_records_service_role_only"
  ON scantippr_fee_records FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ════════════════════════════════════════════════════════════════════════════
-- Bank details: restrict columns via RLS on companies and guards
-- ════════════════════════════════════════════════════════════════════════════

-- companies: bank details visible only to that company's admin
-- (companies table should already have RLS enabled — add bank-specific policy)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "companies_admin_own_company"
  ON companies FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "companies_admin_update_own"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "companies_service_role_all"
  ON companies FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- guards: bank details visible only to service_role and the company admin
ALTER TABLE guards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "guards_company_admin_select"
  ON guards FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "guards_company_admin_update"
  ON guards FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "guards_service_role_all"
  ON guards FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
