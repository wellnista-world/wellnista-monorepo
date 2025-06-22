'use client';

import { useI18n } from '../../i18n';
import { Button } from '@mui/material';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const languages = [
    { code: 'th', label: 'ไทย' },
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' }
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          variant={locale === lang.code ? 'contained' : 'outlined'}
          size="small"
          className={locale === lang.code ? 'bg-primary text-white' : 'text-primary'}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
} 