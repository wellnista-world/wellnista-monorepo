import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../lib/api/supabaseAdmin';
import Stripe from 'stripe';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

export async function POST(request: NextRequest) {
  try {
    // `userId` from the body is advisory only — it is cross-checked against the session metadata
    // below and NEVER used on its own to decide whose points to deduct.
    const { sessionId, userId }: { sessionId?: string; userId?: string } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe (authoritative, server-to-server).
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Nothing to deduct unless this paid order actually used the point discount.
    const usedPoints = session.metadata?.usePointDiscount === 'true';
    if (!usedPoints) {
      return NextResponse.json({ success: true, pointsDeducted: 0 });
    }

    // SOURCE OF TRUTH for whose points get deducted: the user id stamped into the Stripe session
    // metadata when the session was created from a VERIFIED Supabase JWT (see create-checkout-session).
    // Stripe metadata can't be altered after the session exists, so this can't be aimed at another
    // user from the client. We never trust the request body's userId for this decision.
    const buyerId = session.metadata?.userId;
    if (!buyerId) {
      return NextResponse.json(
        { error: 'No user is associated with this payment' },
        { status: 400 },
      );
    }
    if (userId && userId !== buyerId) {
      return NextResponse.json({ error: 'User does not match this payment' }, { status: 403 });
    }

    // Service-role client: RLS now blocks the anon role from users (C4 fix). This privileged write
    // is safe only because buyerId came from the verified session metadata above.
    const supabaseAdmin = getSupabaseAdmin();
    const pointsToDeduct = 100;

    const { data: userData, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('coins')
      .eq('user_id', buyerId)
      .single();

    if (fetchError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentCoins = userData.coins || 0;
    if (currentCoins < pointsToDeduct) {
      return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
    }

    const newBalance = currentCoins - pointsToDeduct;

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ coins: newBalance })
      .eq('user_id', buyerId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to deduct points' }, { status: 500 });
    }

    return NextResponse.json({ success: true, pointsDeducted: pointsToDeduct, newBalance });
  } catch (error) {
    console.error('Error deducting points:', error);
    return NextResponse.json({ error: 'Failed to process point deduction' }, { status: 500 });
  }
}
