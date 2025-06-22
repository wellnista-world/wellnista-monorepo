import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import enMessages from '../messages/en.json';
import thMessages from '../messages/th.json';
import zhMessages from '../messages/zh.json';
import jaMessages from '../messages/ja.json';
import koMessages from '../messages/ko.json';

export type Locale = 'th' | 'en' | 'zh' | 'ja' | 'ko';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const messages = {
  en: enMessages,
  th: thMessages,
  zh: zhMessages,
  ja: jaMessages,
  ko: koMessages,
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Helper function to get stored language preference
const getStoredLanguage = (): Locale => {
  if (typeof window === 'undefined') return 'th'; // Default to Thai for SSR
  
  try {
    const stored = localStorage.getItem('wellnista-language');
    if (stored && ['th', 'en', 'zh', 'ja', 'ko'].includes(stored)) {
      return stored as Locale;
    }
  } catch (error) {
    console.warn('Failed to read language preference from localStorage:', error);
  }
  
  return 'th'; // Default to Thai
};

// Helper function to store language preference
const storeLanguage = (locale: Locale): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('wellnista-language', locale);
  } catch (error) {
    console.warn('Failed to save language preference to localStorage:', error);
  }
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('th'); // Default to Thai

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = getStoredLanguage();
    setLocaleState(savedLanguage);
  }, []);

  // Wrapper function to save language preference when it changes
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    storeLanguage(newLocale);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: unknown = messages[locale];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        // Fallback to Thai if translation not found (since Thai is default)
        value = messages.th;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = (value as Record<string, unknown>)[fallbackKey];
          } else {
            return key; // Return the key if translation not found
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters in the string
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param]?.toString() || match;
      });
    }

    return value;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}