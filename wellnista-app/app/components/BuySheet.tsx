"use client";

import { useState, useEffect, useMemo } from 'react';
import { Drawer, Box, Typography, Button, IconButton } from '@mui/material';
import Image from 'next/image';
import { Product, getProductForLocale } from '../../config/products';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../lib/context/CartContext';
import { useI18n } from '../../i18n';

interface BuySheetProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export const BuySheet = ({ product, open, onClose }: BuySheetProps) => {
  const { addToCart } = useCart();
  const { t, locale } = useI18n();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setQuantity(1);
    }
  }, [product]);

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

  const handleAddToCart = () => {
    const productToAdd = {
        ...displayProduct,
        id: product.id,
    };
    for (let i = 0; i < quantity; i++) {
        addToCart(productToAdd as Product);
    }
    onClose();
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, borderTop: '1px solid #eee', pt: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">{t('common.quantity')}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <Button onClick={() => setQuantity(q => Math.max(1, q - 1))} sx={{minWidth: '30px'}} size="small">-</Button>
            <Typography sx={{minWidth: '20px', textAlign: 'center'}}>{quantity}</Typography>
            <Button onClick={() => setQuantity(q => q + 1)} sx={{minWidth: '30px'}} size="small">+</Button>
          </Box>
        </Box>
      </Box>
      <Button variant="contained" fullWidth sx={{ borderRadius: 0, height: '56px', fontSize: '1rem' }} onClick={handleAddToCart}>
        {t('common.addToCart')}
      </Button>
    </Drawer>
  );
}; 