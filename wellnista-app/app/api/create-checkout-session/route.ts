import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '../../lib/context/CartContext';
import { promotions } from '../../../config/promotion';
import { getSupabaseAdmin } from '../../lib/api/supabaseAdmin';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

export async function POST(request: NextRequest) {
  try {
    const { items, usePointDiscount, promotionCode }: { 
      items: CartItem[], 
      usePointDiscount?: boolean,
      promotionCode?: string 
    } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // When the order uses the point discount, bind it to the AUTHENTICATED buyer: verify the
    // caller's Supabase JWT server-side and stamp the resolved user id into the session metadata.
    // The later /api/deduct-points reads that id back from Stripe (tamper-proof) and deducts ONLY
    // from that user — so the deduction can never be aimed at someone else. Plain (non-point)
    // checkouts need no auth and carry no user id.
    let metadataUserId = '';
    if (usePointDiscount) {
      const authHeader = request.headers.get('authorization') ?? '';
      const token = authHeader.toLowerCase().startsWith('bearer ')
        ? authHeader.slice(7).trim()
        : '';
      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required to use points' },
          { status: 401 }
        );
      }
      const { data: authData, error: authError } = await getSupabaseAdmin().auth.getUser(token);
      if (authError || !authData.user) {
        return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
      }
      metadataUserId = authData.user.id;
    }

    // Create line items for Stripe
    const lineItems = items.map((item: CartItem) => ({
      price: item.product.priceId,
      quantity: item.quantity,
    }));

    // Find promotion details if using point discount
    const promotion = usePointDiscount && promotionCode ? 
      promotions.find(p => p.code === promotionCode) : null;

    // Prepare session configuration
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['promptpay'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['TH'], // Thailand only
      },
      customer_creation: 'always',
      metadata: {
        usePointDiscount: usePointDiscount?.toString() || 'false',
        promotionCode: promotionCode || '',
        userId: metadataUserId,
      },
    };

    // Add promotion code if using point discount
    if (usePointDiscount && promotion?.stripeId) {
      sessionConfig.discounts = [{
        promotion_code: promotion.stripeId,
      }];
    }

    // Create checkout session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session:' + error },
      { status: 500 }
    );
  }
} 