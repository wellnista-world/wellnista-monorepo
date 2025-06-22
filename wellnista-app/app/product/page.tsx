"use client"
import { products, getProductForLocale } from '../../config/products';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '../../i18n';
import Typography from '@mui/material/Typography';
import { useCart } from '../lib/context/CartContext';

export default function ProductListPage() {
  const { t, locale } = useI18n();
  const { cart } = useCart();
  const localizedProducts = products.map(p => getProductForLocale(p, locale));
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-secondary px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <Typography className="text-2xl font-bold text-primary">
          {t('home.wellnistaMarket')}
        </Typography>
        <Link href="/cart">
          <div className="relative cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {localizedProducts.map(product => (
          <Link key={product.id} href={`/product/${product.id}`} className="block">
            <div className="bg-white shadow-lg p-2 flex flex-col hover:shadow-xl transition">
              <Image 
                src={product.image} 
                alt={product.name} 
                width={128}
                height={128}
                className="w-full h-32 object-cover mb-2" 
              />
              <Typography className="text-sm font-semibold text-primary text-left line-clamp-2 mb-1">
                {product.name}
              </Typography>
              <Typography className="text-xs text-neutral/60 text-left line-clamp-2 mb-3">
                {product.description}
              </Typography>
              <div className="text-2xl text-primary text-left leading-none mt-2">
                {product.currency}{product.price}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 