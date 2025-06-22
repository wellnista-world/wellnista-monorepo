'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '../../i18n';
import { Typography, Box, Divider, Button, Alert } from '@mui/material';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Download, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function SettingsPage() {
  const { t, locale } = useI18n();
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'success' | 'error'>('idle');

  const getLanguageName = (code: string) => {
    const languageNames = {
      en: 'English',
      th: 'ไทย (Default)',
      zh: '中文',
      ja: '日本語',
      ko: '한국어',
      id: 'Bahasa Indonesia'
    };
    return languageNames[code as keyof typeof languageNames] || code;
  };

  useEffect(() => {
    // Check if the app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsInstalled(isStandalone);
    };

    checkIfInstalled();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setInstallStatus('error');
      return;
    }

    setInstallStatus('installing');

    try {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setInstallStatus('success');
        setIsInstalled(true);
        setDeferredPrompt(null);
      } else {
        setInstallStatus('error');
      }
    } catch (error) {
      console.error('Installation error:', error);
      setInstallStatus('error');
    }
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

        {/* Install App Section */}
        {!isInstalled && (
          <>
            <Box className="bg-white rounded-lg p-4 shadow-sm">
              <Typography variant="h6" className="mb-3 font-semibold">
                {t('settings.installApp')}
              </Typography>
              <Typography variant="body2" className="mb-4 text-gray-600">
                {t('settings.installAppDescription')}
              </Typography>
              
              {installStatus === 'success' && (
                <Alert severity="success" className="mb-4">
                  {t('settings.installAppSuccess')}
                </Alert>
              )}
              
              {installStatus === 'error' && (
                <Alert severity="error" className="mb-4">
                  {t('settings.installAppError')}
                </Alert>
              )}

              <Button
                variant="contained"
                startIcon={<Download size={20} />}
                onClick={handleInstall}
                disabled={!deferredPrompt || installStatus === 'installing'}
                className="w-full bg-primary hover:bg-accent text-white font-semibold"
              >
                {installStatus === 'installing' 
                  ? t('common.loading') 
                  : t('settings.installAppButton')
                }
              </Button>
            </Box>
            <Divider />
          </>
        )}

        {/* App Already Installed Message */}
        {isInstalled && (
          <>
            <Box className="bg-white rounded-lg p-4 shadow-sm">
              <Typography variant="h6" className="mb-3 font-semibold flex items-center gap-2">
                <CheckCircle size={20} className="text-green-600" />
                {t('settings.installApp')}
              </Typography>
              <Typography variant="body2" className="text-green-600">
                {t('settings.appInstalled')}
              </Typography>
            </Box>
            <Divider />
          </>
        )}

        {/* App Information */}
        <Box className="bg-white rounded-lg p-4 shadow-sm">
          <Typography variant="h6" className="mb-3 font-semibold">
            {t('settings.appInfo')}
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            {t('settings.version')}: 1.2.0
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            {t('settings.developer')}: Wellnista Team
          </Typography>
        </Box>
      </Box>
    </Box>
  );
} 