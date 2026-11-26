import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// SERVER-ONLY service-role Supabase client. It bypasses Row Level Security, so it MUST NEVER be
// imported from a Client Component or anything shipped to the browser. It reads a NON-public env var
// (no NEXT_PUBLIC_ prefix), so it is absent from the client bundle by construction. Created lazily
// and cached; throws loudly if the key is missing rather than silently returning a broken client.
//
// Use it only in server route handlers for privileged writes that RLS intentionally blocks for the
// anon/authenticated roles (e.g. deducting a user's points after a verified Stripe payment). Always
// derive the target user from a trusted source (verified Stripe session metadata, a verified JWT) —
// never from an unauthenticated request body — because this client has no RLS backstop.
let admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (admin) return admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      'Supabase service-role client is not configured (needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)',
    );
  }
  admin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}
