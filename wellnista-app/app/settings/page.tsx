'use client';

import { useI18n } from '../../i18n';
import { Typography, Box, Divider } from '@mui/material';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function SettingsPage() {
  const { t, locale } = useI18n();

  const getLanguageName = (code: string) => {
    const languageNames = {
      en: 'English',
      th: 'ไทย (Default)',
      zh: '中文',
      ja: '日本語',
      ko: '한국어'
    };
    return languageNames[code as keyof typeof languageNames] || code;
  };

  return (
    <Box className="justify-center items-center flex flex-col gap-4 bg-secondary px-4 mt-6">
      <Typography
        variant="h4"
        className="font-bold text-center"
      >
        {t('settings.title')}
      </Typography>

      <Box className="mt-6 w-full max-w-sm flex flex-col gap-6">
        {/* Language Settings */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Typography variant="h6" className="mb-3 font-semibold">
            {t('settings.language')}
          </Typography>
          <Typography variant="body2" className="mb-4 text-gray-600">
            {t('settings.languageDescription')}
          </Typography>
          <LanguageSwitcher />
        </Box>

        <Divider />

        {/* Current Language Display */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Typography variant="h6" className="mb-3 font-semibold">
            {t('settings.currentLanguage')}
          </Typography>
          <Typography variant="body1" className="text-primary font-medium">
            {getLanguageName(locale)}
          </Typography>
          {locale === 'th' && (
            <Typography variant="body2" className="text-green-600 mt-1">
              ★ Default language
            </Typography>
          )}
        </Box>

        <Divider />

        {/* App Information */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Typography variant="h6" className="mb-3 font-semibold">
            {t('settings.appInfo')}
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            {t('settings.version')}: 1.0.0
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            {t('settings.developer')}: Wellnista Team
          </Typography>
        </Box>
      </Box>
    </Box>
  );
} 