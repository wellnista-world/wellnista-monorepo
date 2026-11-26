-- =====================================================================
-- C4: coins may only be changed server-side (2026-11-26)
--
-- CoinContext updated users.coins directly from the client, so any signed-in
-- user could set their own balance to anything. Remove the UPDATE privilege on
-- the coins column for authenticated; coins can then only be written by server
-- routes using the service role (which bypasses grants/RLS), e.g.
-- /api/deduct-points. Users keep updating their OTHER own-row columns (profile).
--
-- NOTE on "column-level revoke": a bare `REVOKE UPDATE (coins)` does NOT take
-- effect while a TABLE-wide UPDATE grant exists (Postgres: a column revoke does
-- not override a table-level privilege). So we drop the table-wide UPDATE and
-- re-grant UPDATE on every column EXCEPT coins. Done dynamically so it tracks
-- the current column set.
--
-- The SECURITY DEFINER trigger on users (update_cleaned_users) is unaffected: it
-- runs with definer rights regardless of the invoker's column privileges.
-- Idempotent. Run in the Supabase SQL editor at api.wellnista.world as owner.
-- =====================================================================

DO $$
DECLARE
  cols text;
BEGIN
  SELECT string_agg(quote_ident(column_name), ', ')
    INTO cols
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name <> 'coins';

  -- Replace the table-wide UPDATE grant with an all-columns-except-coins grant.
  EXECUTE 'REVOKE UPDATE ON public.users FROM authenticated';
  EXECUTE 'GRANT UPDATE (' || cols || ') ON public.users TO authenticated';
END $$;

-- anon has no access to users post phase-1; make the coins restriction explicit too.
REVOKE UPDATE (coins) ON public.users FROM anon;

NOTIFY pgrst, 'reload schema';
