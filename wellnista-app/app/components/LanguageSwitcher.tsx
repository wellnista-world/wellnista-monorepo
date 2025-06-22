'use client';

import { useI18n } from '../../i18n';
import { Button } from '@mui/material';

interface Language {
  code: 'th' | 'en' | 'zh' | 'ja' | 'ko';
  label: string;
  isDefault?: boolean;
}

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const languages: Language[] = [
    { code: 'th', label: 'ไทย', isDefault: true },
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          variant={locale === lang.code ? 'contained' : 'outlined'}
          size="small"
          className={`${
            locale === lang.code 
              ? 'bg-primary text-white' 
              : 'text-primary'
          } ${
            lang.isDefault && locale !== lang.code 
              ? 'border-2 border-primary' 
              : ''
          }`}
          title={lang.isDefault ? 'Default language' : ''}
        >
          {lang.label}
          {lang.isDefault && locale === lang.code && (
            <span className="ml-1 text-xs">★</span>
          )}
        </Button>
      ))}
    </div>
  );
} 