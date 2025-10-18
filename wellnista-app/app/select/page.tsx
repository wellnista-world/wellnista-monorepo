"use client";

import Link from "next/link";
import Typography from '@mui/material/Typography';
import { Barcode, Camera } from 'lucide-react';
import { useI18n } from '../../i18n';
import { getAppName } from '../../config/app';

export default function SelectScreen() {
  const { t } = useI18n();
  
  const menuItems = [
    {
      icon: <Barcode size={50} />,
      label: t('menu.scanBarcode'),
      href: "/scan",
      color: "bg-[#9F9260]"
    },
    {
      icon: <Camera size={50} />,
      label: t('menu.takePhoto'),
      href: "/scan/scan-image",
      color: "bg-[#9F9260]"
    }
  ];

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <Typography className="!text-2xl font-bold text-primary mb-2">
          {t('menu.welcomeTo')}
        </Typography>
        <Typography className="!text-3xl font-bold text-primary mb-4">
          {getAppName()}
        </Typography>
        <Typography className="!text-sm text-neutral/70">
          {t('menu.chooseAction')}
        </Typography>
      </div>

      {/* Main Menu Grid */}
      <div className="mb-8">
        <Typography className="!text-xl font-semibold text-primary mb-6 pb-3">
          {t('menu.checkNutrition')}
        </Typography>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className="block"
            >
              <div className="bg-white rounded-2xl p-6 h-32 flex flex-col text-primary justify-between shadow-lg hover:opacity-90 transition-all">
                <div className="flex justify-between items-start">
                  {item.icon}
                </div>
                <Typography className="!text-xl font-semibold">
                  {item.label}
                </Typography>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-neutral/70">
        <p>{t('menu.selectMethod')}</p>
        <p>{t('menu.toViewNutrition')}</p>
      </div>
    </div>
  );
}
