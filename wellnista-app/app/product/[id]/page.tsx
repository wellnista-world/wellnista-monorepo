"use client"
import { getProductForLocale, products, Product } from '../../../config/products';
import { useI18n } from '../../../i18n';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart, CartItem } from '../../lib/context/CartContext';
import { BuySheet } from '../../components/BuySheet';

const ProductView = ({ product, locale, onBuyClick }: { product: Product, locale: string, onBuyClick: () => void }) => {
  const localized = getProductForLocale(product, locale);
  const { cart } = useCart();
  const cartItemCount = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

  return (
    <div className="relative w-screen h-screen">
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
              <Link href={`/product/${product.id}/detail`}>
                <div>
                    <Typography component="h1" className="text-base font-bold text-primary line-clamp-2">{localized.name}</Typography>
                    <Typography component="p" className="text-xs text-neutral/80 mt-1 line-clamp-2">{localized.description}</Typography>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="text-3xl text-primary">{localized.currency}{localized.price}</div>
            <button onClick={onBuyClick} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-accent transition text-sm">
              Buy Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const { locale } = useI18n();
  const viewRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setSheetOpen(true);
  };

  const handleSheetClose = () => {
    setSheetOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    const initialProductIndex = products.findIndex((p: Product) => p.id === Number(params.id));
    if (initialProductIndex !== -1 && viewRefs.current[initialProductIndex]) {
      setTimeout(() => {
        viewRefs.current[initialProductIndex]?.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 100);
    }
  }, [params.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const newProductId = entry.target.getAttribute('data-product-id');
            const currentUrlId = window.location.pathname.split('/').pop();
            if (newProductId && newProductId !== currentUrlId) {
              window.history.replaceState(null, '', `/product/${newProductId}`);
            }
          }
        }
      },
      { threshold: 0.7 }
    );

    const refs = viewRefs.current;
    refs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      refs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <>
      <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory">
        {products.map((product: Product, index: number) => (
          <div
            key={product.id}
            ref={el => { viewRefs.current[index] = el; }}
            data-product-id={product.id}
            className="h-screen w-screen snap-start"
          >
            <ProductView product={product} locale={locale} onBuyClick={() => handleBuyClick(product)} />
          </div>
        ))}
      </div>
      <BuySheet product={selectedProduct} open={isSheetOpen} onClose={handleSheetClose} />
    </>
  );
}