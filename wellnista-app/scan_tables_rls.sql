-- =====================================================================
-- C4: RLS for food_scan_history, dtx_records, nutrition_data (2026-11-26)
--
-- food_scan_history / dtx_records hold per-user health data (scans, blood
-- sugar) → owner-only. nutrition_data is a SHARED barcode→nutrition
-- reference every user reads, and the scan flow appends new products to it,
-- so authenticated may SELECT + INSERT but not UPDATE/DELETE (existing rows
-- that everyone relies on stay immutable to ordinary users; the service role
-- bypasses RLS for admin fixes).
--
-- No app code changes: scan pages already insert with user_id = self and read
-- their own rows; they also already SELECT and INSERT nutrition_data.
-- Idempotent. Run in the Supabase SQL editor at api.wellnista.world as owner.
-- =====================================================================

-- ---------------------------------------------------------------------
-- food_scan_history — per-user, owner-only
-- ---------------------------------------------------------------------
ALTER TABLE public.food_scan_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.food_scan_history FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.food_scan_history TO authenticated;

DROP POLICY IF EXISTS fsh_select_own ON public.food_scan_history;
CREATE POLICY fsh_select_own ON public.food_scan_history
  FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS fsh_insert_own ON public.food_scan_history;
CREATE POLICY fsh_insert_own ON public.food_scan_history
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS fsh_update_own ON public.food_scan_history;
CREATE POLICY fsh_update_own ON public.food_scan_history
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS fsh_delete_own ON public.food_scan_history;
CREATE POLICY fsh_delete_own ON public.food_scan_history
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- dtx_records — per-user, owner-only
-- ---------------------------------------------------------------------
ALTER TABLE public.dtx_records ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.dtx_records FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dtx_records TO authenticated;

DROP POLICY IF EXISTS dtx_select_own ON public.dtx_records;
CREATE POLICY dtx_select_own ON public.dtx_records
  FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS dtx_insert_own ON public.dtx_records;
CREATE POLICY dtx_insert_own ON public.dtx_records
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS dtx_update_own ON public.dtx_records;
CREATE POLICY dtx_update_own ON public.dtx_records
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS dtx_delete_own ON public.dtx_records;
CREATE POLICY dtx_delete_own ON public.dtx_records
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- nutrition_data — shared reference: authenticated SELECT + INSERT only
--   (no UPDATE/DELETE → existing rows are immutable to ordinary users;
--    anon has no access; the service role bypasses RLS for admin edits)
-- ---------------------------------------------------------------------
ALTER TABLE public.nutrition_data ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nutrition_data FROM anon;
REVOKE UPDATE, DELETE ON public.nutrition_data FROM authenticated;
GRANT SELECT, INSERT ON public.nutrition_data TO authenticated;

DROP POLICY IF EXISTS nutrition_select_all ON public.nutrition_data;
CREATE POLICY nutrition_select_all ON public.nutrition_data
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS nutrition_insert_auth ON public.nutrition_data;
CREATE POLICY nutrition_insert_auth ON public.nutrition_data
  FOR INSERT TO authenticated WITH CHECK (true);
-- No UPDATE/DELETE policies: those are blocked for authenticated by both the
-- revoked privilege and the absence of a policy.

NOTIFY pgrst, 'reload schema';
