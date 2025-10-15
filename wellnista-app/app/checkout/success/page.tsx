"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { Paper, Button } from '@mui/material';
import { useCart } from '../../lib/context/CartContext';
import { useCoins } from '../../lib/context/CoinContext';
import { useAuth } from '../../lib/context/AuthContext';
import { useI18n } from '../../../i18n';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const { refreshCoins } = useCoins();
  const { user } = useAuth();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [pointsDeducted, setPointsDeducted] = useState(0);

  useEffect(() => {
    const handleSuccessfulPayment = async () => {
      if (sessionId && user?.id) {
        try {
          // Call the point deduction API
          const response = await fetch('/api/deduct-points', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId,
              userId: user.id,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.pointsDeducted > 0) {
              setPointsDeducted(result.pointsDeducted);
              // Refresh coin balance
              await refreshCoins();
            }
          }
        } catch (error) {
          console.error('Error processing point deduction:', error);
        }
        
        // Clear the cart after successful payment
        clearCart();
        setIsLoading(false);
      }
    };

    handleSuccessfulPayment();
  }, [sessionId, user?.id, clearCart, refreshCoins]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <Typography className="mt-4">{t('common.processing')}</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto mt-20">
        <Paper className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <Typography variant="h4" className="font-bold text-green-600 mb-2">
            {t('common.paymentSuccessful')}
          </Typography>
          
          <Typography className="text-gray-600 mb-6">
            {t('common.thankYouForOrder')}
          </Typography>

          {pointsDeducted > 0 && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 text-green-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <Typography className="font-medium">
                  {pointsDeducted} points used for discount!
                </Typography>
              </div>
            </div>
          )}

          {sessionId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <Typography className="text-sm text-gray-600 mb-1">{t('common.orderReference')}:</Typography>
              <Typography className="font-mono text-sm">{sessionId}</Typography>
            </div>
          )}

          <Typography className="text-gray-600 mb-6">
            {t('common.emailConfirmation')}
          </Typography>

          <div className="space-y-3">
            <Link href="/product" className="block">
              <Button
                variant="contained"
                fullWidth
                className="bg-primary hover:bg-accent"
              >
                {t('common.continueShopping')}
              </Button>
            </Link>
            
            <Link href="/" className="block">
              <Button
                variant="outlined"
                fullWidth
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                {t('common.backToHome')}
              </Button>
            </Link>
          </div>
        </Paper>
      </div>
    </div>
  );
} 