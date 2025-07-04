'use client';

import { useI18n } from '../../i18n';
import Typography from "@mui/material/Typography";

export default function MenuScreen() {
  const { t } = useI18n();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-blue-60">{t('menu.title')}</h2>
      {/* <p className="mb-6 text-gray-600">Choose your action below to get started.</p> */}
      <div className="flex flex-col gap-4">
        {t('menu.underDevelopment')}
      </div>
    </div>
  );
}
