"use client";

import { useState } from 'react';
import { useCart } from '../lib/context/CartContext';
import { useCoins } from '../lib/context/CoinContext';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { Button, Paper, Divider, Checkbox, FormControlLabel } from '@mui/material';
import { useI18n } from '../../i18n';
import { Coins } from 'lucide-react';
import { promotions } from '../../config/promotion';

const stripePromise = (() => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    console.error('Stripe publishable key is not set. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local file');
    return null;
  }
  return loadStripe(publishableKey);
})();

export default function CheckoutPage() {
  const { cart } = useCart();
  const { coins } = useCoins();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [usePointDiscount, setUsePointDiscount] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Point discount configuration
  const pointsRequired = 5000; // Points needed for discount
  const pointPromotion = promotions.find(p => p.code === 'POINT10');
  const canUsePoints = coins >= pointsRequired && pointPromotion;
  
  // Calculate discount amount based on discount type
  const discountAmount = usePointDiscount && canUsePoints ? 
    (pointPromotion.discountType === 'fixed' ? 
      pointPromotion.discount : 
      (subtotal * pointPromotion.discount / 100)
    ) : 0;
  const total = Math.max(0, subtotal - discountAmount); // Ensure total doesn't go below 0

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert(t('common.yourCartIsEmpty'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          usePointDiscount,
          promotionCode: usePointDiscount && canUsePoints ? pointPromotion.code : null,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (!stripePromise) {
        throw new Error(t('common.stripeNotConfigured'));
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error(t('common.stripeFailedToLoad'));
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(t('common.failedToCheckout'));
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/cart">
            <div className="text-primary cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </Link>
          <Typography variant="h5" component="h1" className="font-bold text-primary">{t('common.checkout')}</Typography>
          <div className="w-6"></div>
        </div>
        <div className="text-center text-gray-500 mt-20">
          <Typography variant="h6">{t('common.cartEmpty')}</Typography>
          <Link href="/product" className="text-primary underline mt-4 inline-block">{t('common.continueShopping')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <Link href="/cart">
          <div className="text-primary cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </Link>
        <Typography variant="h5" component="h1" className="font-bold text-primary">{t('common.checkout')}</Typography>
        <div className="w-6"></div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Order Summary */}
        <Paper className="p-6">
          <Typography variant="h6" className="font-bold mb-4">{t('common.orderSummary')}</Typography>
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-center">
                <div>
                  <Typography className="font-medium">{item.product.name}</Typography>
                  <Typography className="text-sm text-gray-600">{t('common.qty')}: {item.quantity}</Typography>
                </div>
                <Typography className="font-medium">
                  {item.product.currency}{(item.product.price * item.quantity).toFixed(2)}
                </Typography>
              </div>
            ))}
          </div>
          <Divider className="my-4" />
          <div className="flex justify-between items-center">
            <Typography className="font-medium">{t('common.total')}</Typography>
            <Typography className="font-medium">
              {cart[0]?.product.currency || ''}{subtotal.toFixed(2)}
            </Typography>
          </div>
          {usePointDiscount && discountAmount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <Typography className="font-medium">
                Point Discount {pointPromotion?.discountType === 'fixed' ? 
                  `(${cart[0]?.product.currency || ''}${pointPromotion.discount})` : 
                  `(${pointPromotion?.discount}%)`
                }
              </Typography>
              <Typography className="font-medium">
                -{cart[0]?.product.currency || ''}{discountAmount.toFixed(2)}
              </Typography>
            </div>
          )}
          <Divider className="my-2" />
          <div className="flex justify-between items-center">
            <Typography variant="h6" className="font-bold">{t('common.total')}</Typography>
            <Typography variant="h6" className="font-bold text-primary">
              {cart[0]?.product.currency || ''}{total.toFixed(2)}
            </Typography>
          </div>
        </Paper>

        {/* Point Discount Section */}
        {canUsePoints && (
          <Paper className="p-6">
            <Typography variant="h6" className="font-bold mb-4">{t('coins.discount')}</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={usePointDiscount}
                  onChange={(e) => setUsePointDiscount(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <div className="flex items-center gap-2">
                  <Coins size={20} className="text-amber-400" />
                  <div>
                    <Typography className="font-medium">
                      Use {pointsRequired.toLocaleString()} points for {pointPromotion?.discountType === 'fixed' ? 
                        `${cart[0]?.product.currency || ''}${pointPromotion.discount}` : 
                        `${pointPromotion?.discount}%`
                      } discount
                    </Typography>
                    <Typography className="text-sm text-gray-600">
                      You have {coins.toLocaleString()} points available
                    </Typography>
                  </div>
                </div>
              }
            />
          </Paper>
        )}
        
        {!canUsePoints && (
          <Paper className="p-6 bg-gray-50">
            <Typography variant="h6" className="font-bold mb-2">{t('coins.discount')}</Typography>
            <div className="flex items-center gap-2 text-gray-500">
              <Coins size={20} className="text-gray-400" />
              <div>
                <Typography className="font-medium">
                  Need {pointsRequired} points for {pointPromotion?.discountType === 'fixed' ? 
                    `${cart[0]?.product.currency || ''}${pointPromotion?.discount || 0}` : 
                    `${pointPromotion?.discount || 0}%`
                  } discount
                </Typography>
                <Typography className="text-sm">
                  You have {coins.toLocaleString()} points ({t('coins.needMore')}: {pointsRequired - (coins || 0)})
                </Typography>
              </div>
            </div>
          </Paper>
        )}

        {/* Payment Method Info */}
        <Paper className="p-6">
          <Typography variant="h6" className="font-bold mb-4">{t('common.paymentMethod')}</Typography>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <Typography className="font-medium">{t('common.promptpay')}</Typography>
              <Typography className="text-sm text-gray-600">{t('common.securePaymentViaPromptPay')}</Typography>
            </div>
          </div>
        </Paper>

        {/* Checkout Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCheckout}
          disabled={isLoading}
          className="mt-6"
        >
          {isLoading ? t('common.processingYourOrder') : t('common.promptpay')}
        </Button>
      </div>
    </div>
  );
} 