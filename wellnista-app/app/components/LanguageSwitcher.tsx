'use client';

import { useI18n } from '../../i18n';
import { Button, ButtonGroup } from '@mui/material';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <ButtonGroup variant="outlined" size="small" className="bg-white">
      <Button
        onClick={() => setLocale('en')}
        variant={locale === 'en' ? 'contained' : 'outlined'}
        className={locale === 'en' ? 'bg-primary text-white' : 'text-primary'}
      >
        EN
      </Button>
      <Button
        onClick={() => setLocale('th')}
        variant={locale === 'th' ? 'contained' : 'outlined'}
        className={locale === 'th' ? 'bg-primary text-white' : 'text-primary'}
      >
        ไทย
      </Button>
    </ButtonGroup>
  );
} 