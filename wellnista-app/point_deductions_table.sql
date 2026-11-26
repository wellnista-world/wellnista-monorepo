-- Point Deductions (idempotency ledger)
-- One row per Stripe Checkout Session whose point discount has already been applied, so the
-- /api/deduct-points endpoint deducts at most once per session even if it is called again
-- (e.g. the success page re-mounting on refresh). The UNIQUE stripe_session_id is the
-- idempotency key: the server inserts the claim BEFORE deducting; a duplicate insert fails
-- with unique_violation (23505) and the deduction is skipped.
--
-- SERVER-ONLY: written exclusively by the service-role client in the API route. RLS is enabled
-- and anon/authenticated are revoked; the service_role bypasses RLS, so no client policy exists.

CREATE TABLE IF NOT EXISTS point_deductions (
  stripe_session_id TEXT PRIMARY KEY,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points            INTEGER NOT NULL,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_point_deductions_user_id ON point_deductions(user_id);

-- Lock the table down to server-side (service-role) access only.
ALTER TABLE point_deductions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON point_deductions FROM anon, authenticated;
-- (no policies: service_role bypasses RLS; the anon/authenticated roles get no access at all)

COMMENT ON TABLE point_deductions IS 'Idempotency ledger: one row per Stripe session whose point discount was applied; prevents double deduction on replay. Server-only (service-role).';
COMMENT ON COLUMN point_deductions.stripe_session_id IS 'Stripe Checkout Session id — the idempotency key (unique).';
COMMENT ON COLUMN point_deductions.points IS 'Points deducted for this session (currently 100).';
