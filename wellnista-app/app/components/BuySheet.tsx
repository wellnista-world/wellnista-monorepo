"use client";

import { useRouter } from 'next/navigation';
import { Drawer, Box, Typography, Button, IconButton } from '@mui/material';
import Image from 'next/image';
import { Product, getProductForLocale } from '../../config/products';
import CloseIcon from '@mui/icons-material/Close';
import { useI18n } from '../../i18n';
import { useMemo } from 'react';

interface BuySheetProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export const BuySheet = ({ product, open, onClose }: BuySheetProps) => {
  const router = useRouter();
  const { t, locale } = useI18n();

  const displayProduct = useMemo(() => {
    if (!product) return null;

    // Get localized product data
    const localizedProduct = getProductForLocale(product, locale);

    return {
      ...localizedProduct,
      name: localizedProduct.name,
      price: localizedProduct.price,
      image: localizedProduct.image
    };
  }, [product, locale]);

  if (!displayProduct || !product) return null;

  const handleGoHome = () => {
    onClose();
    router.push('/home');
  };

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose} PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}>
      <Box sx={{ padding: '16px', maxWidth: '600px', margin: 'auto', width: '100%' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1300 }}>
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: 'flex', gap: 2, pb: 2 }}>
          <Image src={displayProduct.image} alt={displayProduct.name} width={100} height={100} style={{ objectFit: 'cover', borderRadius: '8px' }}/>
          <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Typography sx={{ color: 'error.main', fontWeight: 'bold', fontSize: '1.2rem' }}>{product.currency}{displayProduct.price}</Typography>
            <Typography variant="body2" color="text.secondary">{t('common.stock')}: {t('common.available')}</Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2, pb: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            {displayProduct.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {displayProduct.description}
          </Typography>
        </Box>
      </Box>
      <Button variant="contained" fullWidth sx={{ borderRadius: 0, height: '56px', fontSize: '1rem' }} onClick={handleGoHome}>
        {t('navigation.home') || 'Go to Home'}
      </Button>
    </Drawer>
  );
}; 