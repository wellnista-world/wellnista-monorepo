'use client';

import { useI18n } from '../../i18n';
import { Typography, Box, Button } from '@mui/material';

export default function I18nExample() {
  const { t, locale, setLocale } = useI18n();

  return (
    <Box className="p-4 space-y-4">
      <Typography variant="h4" className="text-center">
        {t('common.loading')}
      </Typography>
      
      <Box className="space-y-2">
        <Typography variant="h6">Navigation Examples:</Typography>
        <Typography>{t('navigation.home')}</Typography>
        <Typography>{t('navigation.menu')}</Typography>
        <Typography>{t('navigation.profile')}</Typography>
        <Typography>{t('navigation.scan')}</Typography>
      </Box>

      <Box className="space-y-2">
        <Typography variant="h6">Profile Examples:</Typography>
        <Typography>{t('profile.title')}</Typography>
        <Typography>{t('profile.personalInfo')}</Typography>
        <Typography>{t('profile.name')}</Typography>
        <Typography>{t('profile.age')} ({t('profile.years')})</Typography>
        <Typography>{t('profile.weight')} ({t('profile.kg')})</Typography>
        <Typography>{t('profile.height')} ({t('profile.cm')})</Typography>
      </Box>

      <Box className="space-y-2">
        <Typography variant="h6">BMI Categories:</Typography>
        <Typography>{t('profile.bmiCategories.normal')}</Typography>
        <Typography>{t('profile.bmiCategories.overweight')}</Typography>
        <Typography>{t('profile.bmiCategories.obese1')}</Typography>
      </Box>

      <Box className="space-y-2">
        <Typography variant="h6">Activity Levels:</Typography>
        <Typography>{t('activityLevels.sedentary')}</Typography>
        <Typography>{t('activityLevels.moderatelyActive')}</Typography>
      </Box>

      <Box className="space-y-2">
        <Typography variant="h6">Diseases:</Typography>
        <Typography>{t('diseases.diabetes')}</Typography>
        <Typography>{t('diseases.heart')}</Typography>
        <Typography>{t('diseases.hypertension')}</Typography>
      </Box>

      <Box className="text-center">
        <Typography variant="body2" className="mb-2">
          Current Language: {locale === 'en' ? 'English' : 'ไทย'}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => setLocale(locale === 'en' ? 'th' : 'en')}
          className="bg-primary text-white"
        >
          Switch to {locale === 'en' ? 'ไทย' : 'English'}
        </Button>
      </Box>
    </Box>
  );
} 