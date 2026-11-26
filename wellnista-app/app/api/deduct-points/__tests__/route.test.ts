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

/** Table-aware fake of the Supabase query builder covering the route's calls:
 *   point_deductions.insert({...})            → { error }           (idempotency claim)
 *   point_deductions.delete().eq(session)     → { error: null }     (claim release)
 *   users.select('coins').eq(id).single()     → { data, error }
 *   users.update({coins}).eq(id)              → { error }
 *  Records what happened so tests can assert claim/release/update behaviour. */
function fakeAdmin(opts: {
  coins?: number | null;
  claimError?: { code?: string } | null;
  updateError?: unknown;
} = {}) {
  const calls = {
    claimed: false,
    released: false,
    updatedTo: null as Record<string, unknown> | null,
    usersEq: [] as string[],
  };
  function builder(table: string) {
    let op: 'select' | 'insert' | 'update' | 'delete' = 'select';
    const b: Record<string, unknown> = {
      insert: () => {
        op = 'insert';
        if (table === 'point_deductions') calls.claimed = true;
        return b;
      },
      update: (vals: Record<string, unknown>) => {
        op = 'update';
        calls.updatedTo = vals;
        return b;
      },
      delete: () => {
        op = 'delete';
        if (table === 'point_deductions') calls.released = true;
        return b;
      },
      select: () => { op = 'select'; return b; },
      eq: (_col: string, val: string) => {
        if (table === 'users') calls.usersEq.push(val);
        return b;
      },
      single: async () => ({
        data: opts.coins === undefined ? null : { coins: opts.coins },
        error: opts.coins === undefined ? { message: 'not found' } : null,
      }),
      // insert / update / delete chains are awaited directly and resolve to { error }
      then: (resolve: (v: { error: unknown }) => void) => {
        if (op === 'insert') return resolve({ error: opts.claimError ?? null });
        if (op === 'update') return resolve({ error: opts.updateError ?? null });
        return resolve({ error: null }); // delete (release)
      },
    };
    return b;
  }
  return { client: { from: (t: string) => builder(t) }, calls };
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

    const res = await POST(req({ sessionId: 's1', userId: 'buyer-from-stripe' }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toMatchObject({ success: true, pointsDeducted: 100, newBalance: 400 });
    expect(admin.calls.claimed).toBe(true);
    expect(admin.calls.released).toBe(false); // success → claim kept
    expect(admin.calls.usersEq.every((id) => id === 'buyer-from-stripe')).toBe(true);
  });

  it('rejects when the body userId does not match the paid session (403), no DB touch', async () => {
    retrieve.mockResolvedValue(paidWithPoints('real-buyer'));
    const admin = fakeAdmin({ coins: 500 });
    getSupabaseAdmin.mockReturnValue(admin.client);

    const res = await POST(req({ sessionId: 's1', userId: 'someone-else' }));
    expect(res.status).toBe(403);
    expect(admin.calls.claimed).toBe(false);
    expect(admin.calls.usersEq).toHaveLength(0);
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
});

describe('POST /api/deduct-points — idempotency (replay guard)', () => {
  it('is a no-op on replay: duplicate session (unique_violation) does not deduct again', async () => {
    retrieve.mockResolvedValue(paidWithPoints('buyer'));
    const admin = fakeAdmin({ coins: 500, claimError: { code: '23505' } });
    getSupabaseAdmin.mockReturnValue(admin.client);

    const res = await POST(req({ sessionId: 's1', userId: 'buyer' }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toMatchObject({ success: true, pointsDeducted: 0, alreadyProcessed: true });
    expect(admin.calls.updatedTo).toBeNull(); // never touched the balance
  });

  it('surfaces a non-unique claim error as 500 without deducting', async () => {
    retrieve.mockResolvedValue(paidWithPoints('buyer'));
    const admin = fakeAdmin({ coins: 500, claimError: { code: '08006' } });
    getSupabaseAdmin.mockReturnValue(admin.client);

    const res = await POST(req({ sessionId: 's1', userId: 'buyer' }));
    expect(res.status).toBe(500);
    expect(admin.calls.updatedTo).toBeNull();
  });

  it('releases the claim when the user has too few points (400), so a retry can proceed', async () => {
    retrieve.mockResolvedValue(paidWithPoints('poor-buyer'));
    const admin = fakeAdmin({ coins: 50 });
    getSupabaseAdmin.mockReturnValue(admin.client);

    const res = await POST(req({ sessionId: 's1', userId: 'poor-buyer' }));
    expect(res.status).toBe(400);
    expect(admin.calls.claimed).toBe(true);
    expect(admin.calls.released).toBe(true); // compensated
    expect(admin.calls.updatedTo).toBeNull();
  });

  it('releases the claim when the user row is missing (404)', async () => {
    retrieve.mockResolvedValue(paidWithPoints('ghost'));
    const admin = fakeAdmin({ coins: undefined }); // single() → not found
    getSupabaseAdmin.mockReturnValue(admin.client);

    const res = await POST(req({ sessionId: 's1', userId: 'ghost' }));
    expect(res.status).toBe(404);
    expect(admin.calls.released).toBe(true);
  });
});
