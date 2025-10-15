"use client";

import { useParams } from 'next/navigation';
import { getProductById, getProductForLocale } from '../../../../config/products';
import { useI18n } from '../../../../i18n';
import Image from 'next/image';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { BuySheet } from '../../../components/BuySheet';
import { useCart, CartItem } from '../../../lib/context/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const { locale, t } = useI18n();
  const productId = Number(params.id);
  const product = getProductById(productId);
  const [buySheetOpen, setBuySheetOpen] = useState(false);
  const { cart } = useCart();
  const cartItemCount = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-xl">404 | Product Not Found</div>;
  }

  const localized = getProductForLocale(product, locale);

  const handleBuyNow = () => {
    setBuySheetOpen(true);
  };

  const handleCloseBuySheet = () => {
    setBuySheetOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="absolute top-4 left-4 z-10">
        <Link href={`/product/${productId}`}>
          <div className="text-white bg-black bg-opacity-30 rounded-full p-2 inline-block cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </Link>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <Link href="/cart">
          <div className="relative cursor-pointer">
            <div className="text-white bg-black bg-opacity-30 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
        </Link>
      </div>

      <div className="relative w-full h-96">
        <Image src={localized.image} alt={localized.name} layout="fill" objectFit="cover" />
      </div>

      <div className="p-4 bg-white">
        <div className="flex items-center">
          <span className="text-primary text-2xl font-bold">{localized.currency}{localized.price}</span>
        </div>

        <Typography component="h1" className="text-lg font-medium mt-2">
          {localized.name}
        </Typography>
        <Typography component="p" className="text-sm text-gray-600 mt-1">
          {localized.description}
        </Typography>
      </div>
      
      <div className="pb-20"></div>

      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex">
        <div className="flex-1 flex items-center justify-center border-r">
          <div className="text-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="text-xs">{t('common.addToCart')}</span>
          </div>
        </div>
        <button 
          onClick={handleBuyNow}
          className="flex-grow-[2] bg-primary text-white flex items-center justify-center font-semibold"
        >
          {t('common.buyNow')}
        </button>
      </div>

      <BuySheet 
        product={localized}
        open={buySheetOpen}
        onClose={handleCloseBuySheet}
      />
    </div>
  );
} 