"use client"
import { getProductById, getProductForLocale } from '../../../config/products';
import { useI18n } from '../../../i18n';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { t, locale } = useI18n();
  const product = getProductById(Number(params.id));
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-xl">404 | Product Not Found</div>;
  }
  const localized = getProductForLocale(product, locale);
  return (
    <div className="min-h-screen bg-secondary px-4 py-8 flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md flex flex-col items-center">
        <img src={localized.image} alt={localized.name} className="w-48 h-48 object-cover rounded-xl mb-4" />
        <Typography className="text-2xl font-bold text-primary mb-2 text-center">{localized.name}</Typography>
        <Typography className="text-base text-neutral/70 mb-4 text-center">{localized.description}</Typography>
        <Typography className="text-2xl font-bold text-primary mb-6">{localized.currency}{localized.price}</Typography>
        <a href={localized.link} target="_blank" rel="noopener noreferrer" className="w-full">
          <button className="w-full bg-primary text-white py-3 rounded-full font-semibold text-lg hover:bg-accent transition">
            {t('home.viewProduct')}
          </button>
        </a>
        <Link href="/product" className="block w-full mt-4 text-center text-primary underline text-sm">{t('common.back')}</Link>
      </div>
    </div>
  );
} 