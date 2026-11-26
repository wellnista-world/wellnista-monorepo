import { describe, it, expect, vi, beforeEach } from 'vitest';

// Hoisted so the vi.mock factories (also hoisted) can reference these without a TDZ error.
const { retrieve, getSupabaseAdmin } = vi.hoisted(() => ({
  retrieve: vi.fn(),
  getSupabaseAdmin: vi.fn(),
}));

// --- mock Stripe: the route does `new Stripe(key).checkout.sessions.retrieve(id)` ---
vi.mock('stripe', () => ({
  default: class {
    checkout = { sessions: { retrieve } };
  },
}));

// --- mock the server-only service-role client ---
vi.mock('../../../lib/api/supabaseAdmin', () => ({ getSupabaseAdmin }));

import { POST } from '../route';

/** A tiny fake of the Supabase query builder for the two calls the route makes:
 *  from('users').select('coins').eq('user_id', id).single()  → { data, error }
 *  from('users').update({coins}).eq('user_id', id)           → { error }
 *  Records every eq('user_id', …) so a test can assert WHICH user was touched. */
function fakeAdmin(opts: { coins?: number | null; updateError?: unknown } = {}) {
  const eqUserIds: string[] = [];
  let updatedTo: Record<string, unknown> | null = null;
  const builder: Record<string, unknown> = {
    select: () => builder,
    update: (vals: Record<string, unknown>) => {
      updatedTo = vals;
      return builder;
    },
    eq: (_col: string, val: string) => {
      eqUserIds.push(val);
      return builder;
    },
    single: async () => ({
      data: opts.coins === undefined ? null : { coins: opts.coins },
      error: opts.coins === undefined ? { message: 'not found' } : null,
    }),
    // the update path awaits the builder itself (from().update().eq())
    then: (resolve: (v: { error: unknown }) => void) => resolve({ error: opts.updateError ?? null }),
  };
  return { client: { from: () => builder }, eqUserIds, get updatedTo() { return updatedTo; } };
}

function req(body: unknown) {
  return new Request('http://localhost/api/deduct-points', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as Parameters<typeof POST>[0];
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.STRIPE_SECRET_KEY = 'sk_test_x';
});

const paidWithPoints = (userId: string | undefined) => ({
  payment_status: 'paid',
  metadata: { usePointDiscount: 'true', ...(userId !== undefined ? { userId } : {}) },
});

describe('POST /api/deduct-points — authorization', () => {
  it('deducts from the session-metadata user, NOT the request-body userId', async () => {
    retrieve.mockResolvedValue(paidWithPoints('buyer-from-stripe'));
    const admin = fakeAdmin({ coins: 500 });
    getSupabaseAdmin.mockReturnValue(admin.client);

    // Attacker sends a victim's id in the body; it must be ignored (matches metadata here).
    const res = await POST(req({ sessionId: 's1', userId: 'buyer-from-stripe' }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toMatchObject({ success: true, pointsDeducted: 100, newBalance: 400 });
    // every users query targeted the metadata user, never a body-supplied one
    expect(admin.eqUserIds.every((id) => id === 'buyer-from-stripe')).toBe(true);
  });

  it('rejects when the body userId does not match the paid session (403)', async () => {
    retrieve.mockResolvedValue(paidWithPoints('real-buyer'));
    const admin = fakeAdmin({ coins: 500 });
    getSupabaseAdmin.mockReturnValue(admin.client);

    const res = await POST(req({ sessionId: 's1', userId: 'someone-else' }));
    expect(res.status).toBe(403);
    expect(admin.eqUserIds).toHaveLength(0); // never touched the DB
  });

  it('rejects a paid points order with no user stamped in metadata (400)', async () => {
    retrieve.mockResolvedValue(paidWithPoints(undefined));
    getSupabaseAdmin.mockReturnValue(fakeAdmin({ coins: 500 }).client);

    const res = await POST(req({ sessionId: 's1', userId: 'anyone' }));
    expect(res.status).toBe(400);
  });

  it('does nothing (no DB access) when the order did not use points', async () => {
    retrieve.mockResolvedValue({ payment_status: 'paid', metadata: { usePointDiscount: 'false' } });

    const res = await POST(req({ sessionId: 's1', userId: 'x' }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toMatchObject({ pointsDeducted: 0 });
    expect(getSupabaseAdmin).not.toHaveBeenCalled();
  });

  it('rejects an unpaid session (400)', async () => {
    retrieve.mockResolvedValue({ payment_status: 'unpaid', metadata: { usePointDiscount: 'true', userId: 'b' } });

    const res = await POST(req({ sessionId: 's1', userId: 'b' }));
    expect(res.status).toBe(400);
    expect(getSupabaseAdmin).not.toHaveBeenCalled();
  });

  it('requires a sessionId (400)', async () => {
    const res = await POST(req({ userId: 'b' }));
    expect(res.status).toBe(400);
    expect(retrieve).not.toHaveBeenCalled();
  });

  it('refuses when the metadata user lacks enough points (400), no deduction', async () => {
    retrieve.mockResolvedValue(paidWithPoints('poor-buyer'));
    const admin = fakeAdmin({ coins: 50 });
    getSupabaseAdmin.mockReturnValue(admin.client);

    const res = await POST(req({ sessionId: 's1', userId: 'poor-buyer' }));
    expect(res.status).toBe(400);
    expect(admin.updatedTo).toBeNull(); // never updated
  });
});
