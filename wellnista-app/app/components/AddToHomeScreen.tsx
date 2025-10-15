"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useI18n } from '../../i18n';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function AddToHomeScreen() {
  const { t } = useI18n();
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if the app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) return;

    // Check if we've shown the prompt before
    const hasShownPrompt = localStorage.getItem('hasShownInstallPrompt');
    if (hasShownPrompt) return;

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Hide the prompt
    setShowPrompt(false);
    setDeferredPrompt(null);

    // Save that we've shown the prompt
    localStorage.setItem('hasShownInstallPrompt', 'true');

    // Log the outcome
    console.log(`User response to the install prompt: ${outcome}`);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('hasShownInstallPrompt', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-primary">{t('addToHomeScreen.title')}</h3>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-gray-100 rounded-full"
          aria-label={t('common.close')}
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {t('addToHomeScreen.description')}
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition"
        >
          {t('addToHomeScreen.install')}
        </button>
        <button
          onClick={handleDismiss}
          className="flex-1 border border-gray-300 text-gray-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          {t('addToHomeScreen.notNow')}
        </button>
      </div>
    </div>
  );
} 