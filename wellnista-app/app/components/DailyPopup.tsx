'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  Button,
} from '@mui/material';
import { useI18n } from '../../i18n';
import { X } from 'lucide-react';
import Image from 'next/image';

interface DailyPopupProps {
  open: boolean;
  onClose: () => void;
  imageUrl?: string;
  title?: string;
  message?: string;
}

export default function DailyPopup({ 
  open, 
  onClose, 
  imageUrl = '/promote.webp', // Default image
}: DailyPopupProps) {
  const { t } = useI18n();

  const handleClose = () => {
    // Store the current date in localStorage to remember that popup was shown today
    const today = new Date().toDateString();
    localStorage.setItem('lastPopupDate', today);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '20px',
          backgroundColor: 'white',
          overflow: 'hidden',
        }
      }}
    >
      <DialogContent className="p-0">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-all"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Image */}
        <div className="relative w-full h-64">
          <Image
            src={imageUrl}
            alt="Daily reminder"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* <Typography variant="h5" className="font-bold text-primary mb-3 text-center">
            {title || t('dailyPopup.title')}
          </Typography>
          
          <Typography variant="body1" className="text-neutral/70 mb-6 text-center">
            {message || t('dailyPopup.message')}
          </Typography> */}

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outlined"
              fullWidth
              onClick={handleClose}
              className="!border-primary !text-primary hover:!bg-primary/10"
            >
              {t('dailyPopup.later')}
            </Button>
            
            <Button
              variant="contained"
              fullWidth
              onClick={handleClose}
              className="!bg-primary hover:!bg-accent !text-white"
            >
              {t('dailyPopup.gotIt')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
