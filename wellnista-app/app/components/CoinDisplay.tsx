"use client";

import { useCoins } from '../lib/context/CoinContext';
import { Coins } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CoinDisplayProps {
  className?: string;
  showLabel?: boolean;
}

export default function CoinDisplay({ className = '', showLabel = false }: CoinDisplayProps) {
  const { coins, loading } = useCoins();
  const router = useRouter();

  const handleClick = () => {
    router.push('/coins');
  };

  if (loading) {
    return (
      <div 
        onClick={handleClick}
        className={`flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      >
        <Coins size={20} className="text-amber-400" />
        <span className="text-sm font-semibold">-</span>
      </div>
    );
  }

  return (
    <div 
      onClick={handleClick}
      className={`flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
    >
      <Coins size={20} className="text-amber-400" />
      <span className="text-sm font-semibold text-amber-400">
        {coins.toLocaleString()}
        {showLabel && ' coins'}
      </span>
    </div>
  );
} 