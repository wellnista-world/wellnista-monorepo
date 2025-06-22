"use client"
import { getProductForLocale, products } from '../../../config/products';
import { useI18n } from '../../../i18n';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../../../config/products';

const ProductView = ({ product, locale, t }: { product: Product, locale: string, t: (key: string) => string }) => {
  const localized = getProductForLocale(product, locale);
  return (
    <div className="relative w-screen h-[80vh]  snap-start">
      <Image
        src={localized.image}
        alt={localized.name}
        layout="fill"
        objectFit="cover"
        className="absolute inset-0"
      />
      <div className="absolute top-4 left-4 z-10">
        <Link href="/product">
          <div className="text-white bg-black bg-opacity-30 rounded-full p-2 inline-block cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </Link>
      </div>
      <div className="absolute bottom-[6%] left-4 right-4 sm:right-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 w-full sm:max-w-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Image 
                src={localized.image}
                alt={localized.name}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Typography component="h1" className="text-base font-bold text-primary line-clamp-2">{localized.name}</Typography>
              <Typography component="p" className="text-xs text-neutral/80 mt-1 line-clamp-2">{localized.description}</Typography>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="text-3xl text-primary">{localized.currency}{localized.price}</div>
            <a href={localized.link} target="_blank" rel="noopener noreferrer">
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent transition text-sm">
                {t('home.viewProduct')}
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { t, locale } = useI18n();
  const productId = Number(params.id);
  const currentProductIndex = products.findIndex(p => p.id === productId);

  if (currentProductIndex === -1) {
    return <div className="min-h-screen flex items-center justify-center text-xl">404 | Product Not Found</div>;
  }

  const currentProduct = products[currentProductIndex];
  const nextProductIndex = (currentProductIndex + 1) % products.length;
  const nextProduct = products[nextProductIndex];

  return (
    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory">
      <ProductView product={currentProduct} locale={locale} t={t} />
      <Link href={`/product/${nextProduct.id}`} scroll={false}>
        <div>
            <ProductView product={nextProduct} locale={locale} t={t} />
        </div>
      </Link>
    </div>
  );
} 