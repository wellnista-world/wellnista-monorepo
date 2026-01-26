import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/api/supabaseClient';
import Stripe from 'stripe';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  });
};

export async function POST(request: NextRequest) {
  try {
    const { sessionId, userId }: { sessionId: string, userId: string } = await request.json();

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: 'Session ID and User ID are required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Check if points were used
    const usedPoints = session.metadata?.usePointDiscount === 'true';
    
    if (!usedPoints) {
      return NextResponse.json({ success: true, pointsDeducted: 0 });
    }

    // Deduct points (100 points for the discount)
    const pointsToDeduct = 100;
    
    // Get current user coins
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('coins')
      .eq('user_id', userId)
      .single();

    if (fetchError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentCoins = userData.coins || 0;
    
    if (currentCoins < pointsToDeduct) {
      return NextResponse.json(
        { error: 'Insufficient points' },
        { status: 400 }
      );
    }

    // Deduct points
    const newBalance = currentCoins - pointsToDeduct;
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ coins: newBalance })
      .eq('user_id', userId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to deduct points' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      pointsDeducted: pointsToDeduct,
      newBalance 
    });

  } catch (error) {
    console.error('Error deducting points:', error);
    return NextResponse.json(
      { error: 'Failed to process point deduction' },
      { status: 500 }
    );
  }
} 