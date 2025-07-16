import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '../../lib/context/CartContext';
import { promotions } from '../../../config/promotion';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

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
        items: JSON.stringify(items.map((item: CartItem) => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        }))),
        usePointDiscount: usePointDiscount?.toString() || 'false',
        promotionCode: promotionCode || '',
      },
    };

    // Add promotion code if using point discount
    if (usePointDiscount && promotion?.stripeId) {
      sessionConfig.discounts = [{
        promotion_code: promotion.stripeId,
      }];
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 