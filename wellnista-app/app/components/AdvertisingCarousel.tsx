'use client';

import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { carouselConfig } from '../../config/advertising';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  description: string;
  link?: string;
}

interface AdvertisingCarouselProps {
  items: CarouselItem[];
  autoSlideInterval?: number; // in milliseconds
  showNavigation?: boolean;
  showDots?: boolean;
  showProgressBar?: boolean;
  showClickIndicator?: boolean;
  height?: string;
}

export default function AdvertisingCarousel({ 
  items, 
  autoSlideInterval = carouselConfig.autoSlideInterval,
  showNavigation = carouselConfig.showNavigation,
  showDots = carouselConfig.showDots,
  showProgressBar = carouselConfig.showProgressBar,
  showClickIndicator = carouselConfig.showClickIndicator,
  height = carouselConfig.height
}: AdvertisingCarouselProps) {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [items.length, autoSlideInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handleSlideClick = (item: CarouselItem) => {
    if (item.link) {
      if (item.link.startsWith('http')) {
        window.open(item.link, '_blank');
      } else {
        window.location.href = item.link;
      }
    }
  };

  if (!items.length) return null;

  return (
    <Box className={`relative bg-white rounded-2xl overflow-hidden shadow-lg mb-6`}>
      {/* Carousel Container */}
      <Box className={`relative ${height} overflow-hidden`}>
        {items.map((item, index) => (
          <Box
            key={item.id}
            className={`absolute inset-0 transition-transform duration-${carouselConfig.transitionDuration} ease-in-out cursor-pointer ${
              index === currentIndex ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`,
            }}
            onClick={() => handleSlideClick(item)}
          >
            {/* Image Background */}
            <Box
              className="w-full h-full bg-cover bg-center relative"
              style={{
                backgroundImage: `url(${item.image})`,
              }}
            >
              {/* Overlay for better text readability */}
              <Box className="absolute inset-0 bg-black/20" />
              
              {/* Content */}
              <Box className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <Typography 
                  variant="h6" 
                  className="font-bold mb-2 text-shadow"
                >
                  {item.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  className="text-shadow opacity-90"
                >
                  {item.description}
                </Typography>
              </Box>

              {/* Click indicator */}
              {showClickIndicator && (
                <Box className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Typography variant="caption" className="text-white font-medium">
                    {t('home.advertising.clickToSeeMore')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Navigation Arrows */}
      {showNavigation && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-primary shadow-md transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-primary shadow-md transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && (
        <Box className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </Box>
      )}

      {/* Progress Bar */}
      {showProgressBar && (
        <Box className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <Box
            className="h-full bg-primary transition-all duration-300 ease-linear"
            style={{
              width: `${((currentIndex + 1) / items.length) * 100}%`,
            }}
          />
        </Box>
      )}
    </Box>
  );
} 