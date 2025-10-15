"use client";

import { useCoins } from '../lib/context/CoinContext';
import { useI18n } from '../../i18n';
import { useAuth } from '../lib/context/AuthContext';
import Typography from '@mui/material/Typography';
import { Coins, Camera, Barcode, Gift, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CoinsPage() {
  const { coins, loading } = useCoins();
  const { t } = useI18n();
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const earnMethods = [
    {
      icon: <Camera size={24} />,
      title: t('scan.takePhoto'),
      description: 'Scan food with camera',
      coins: 10,
      action: () => router.push('/scan/scan-image')
    },
    {
      icon: <Barcode size={24} />,
      title: t('scan.scanBarcode'),
      description: 'Scan product barcode',
      coins: 10,
      action: () => router.push('/scan')
    },
    {
      icon: <Star size={24} />,
      title: 'Daily Login',
      description: 'Login every day',
      coins: 5,
      action: () => {}
    },
    {
      icon: <Gift size={24} />,
      title: 'Complete Profile',
      description: 'Fill out your health profile',
      coins: 50,
      action: () => router.push('/register')
    }
  ];

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <Typography className="text-2xl font-bold text-primary mb-2">
          {t('coins.balance')}
        </Typography>
        <div className="flex items-center justify-center gap-3 bg-white rounded-2xl p-6 shadow-lg">
          <Coins size={48} className="text-yellow-500" />
          <Typography className="text-4xl font-bold text-primary">
            {loading ? '...' : coins.toLocaleString()}
          </Typography>
        </div>
      </div>

      {/* How to Earn Coins */}
      <div className="mb-8">
        <Typography className="text-xl font-bold text-primary mb-4">
          {t('coins.earn')}
        </Typography>
        <div className="space-y-4">
          {earnMethods.map((method, index) => (
            <div
              key={index}
              onClick={method.action}
              className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:bg-primary/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  {method.icon}
                </div>
                <div>
                  <Typography className="font-semibold text-primary">
                    {method.title}
                  </Typography>
                  <Typography className="text-sm text-neutral/70">
                    {method.description}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Coins size={20} className="text-yellow-500" />
                <Typography className="font-bold text-primary">
                  +{method.coins}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <Typography className="font-bold text-primary mb-3">
          About Coins
        </Typography>
        <div className="space-y-2 text-sm text-neutral/70">
          <p>• Earn coins by scanning food and tracking your nutrition</p>
          <p>• Use coins for special features and rewards</p>
          <p>• Complete your profile to get bonus coins</p>
          <p>• Check back daily for login bonuses</p>
        </div>
      </div>
    </div>
  );
} 