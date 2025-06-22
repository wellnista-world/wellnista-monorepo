"use client"
import { products, getProductForLocale } from '../../config/products';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '../../i18n';
import Typography from '@mui/material/Typography';

export default function ProductListPage() {
  const { t, locale } = useI18n();
  const localizedProducts = products.map(p => getProductForLocale(p, locale));

  return (
    <div className="min-h-screen bg-secondary px-4 py-6">
      <Typography className="text-2xl font-bold text-primary mb-6">
        {t('home.wellnistaMarket')}
      </Typography>
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