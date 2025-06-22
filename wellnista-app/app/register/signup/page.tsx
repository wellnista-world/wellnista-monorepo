'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/api/supabaseClient';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useI18n } from '../../../i18n';
import CountryCodeSelector from '../../components/CountryCodeSelector';
import { CountryCode, getDefaultCountry } from '../../../config/countryCodes';

export default function SignupPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(getDefaultCountry());
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (rawPhone: string, country: CountryCode) => {
    const cleaned = rawPhone.replace(/\D/g, '');
    // Remove leading 0 for Thailand
    if (country.code === 'TH' && cleaned.startsWith('0')) {
      return country.dialCode + cleaned.slice(1);
    }
    return country.dialCode + cleaned;
  };

  const handleLoginLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    router.push('/');
  };

  const handleSignup = async () => {
    setError(null);
    setLoading(true);

    const formattedPhone = formatPhoneNumber(phone, selectedCountry);

    const { data, error } = await supabase.auth.signUp({
      phone: formattedPhone,
      password,
    });

    if (error || !data.user) {
      setError(error?.message ?? t('errors.general'));
      setLoading(false);
      return;
    }

    const { user } = data;
    const { error: insertError } = await supabase.from('users').insert([
      {
        user_id: user.id,
        phone: formattedPhone,
        country_code: selectedCountry.code,
        dial_code: selectedCountry.dialCode,
      },
    ]);

    if (insertError) {
      setError(t('auth.signupSuccess'));
      console.error(insertError);
    } else {
      router.push('/register');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6">
      {/* Header with Welcome Message */}
      <div className="mb-8 text-center">
        <Typography className="text-2xl font-bold text-primary mb-1">
          {t('auth.signupTitle')}
        </Typography>
        <Typography className="text-sm text-neutral/70">
          {t('auth.signupSubtitle')}
        </Typography>
      </div>

      {/* Signup Form */}
      <div className="max-w-sm mx-auto space-y-4">
        <div className="flex gap-2">
          <div className="w-36">
            <CountryCodeSelector
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
            />
          </div>
          <TextField
            label={t('auth.phoneNumberWithCountry')}
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            className="bg-white rounded"
            placeholder={t('auth.phonePlaceholder')}
          />
        </div>
        <TextField
          label={t('auth.password')}
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          className="bg-white rounded"
        />
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full px-6 py-3 bg-primary text-secondary rounded-full hover:bg-accent transition font-garet font-semibold"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.signup')}
        </button>
        {error && (
          <Typography color="error" className="text-center">
            {error}
          </Typography>
        )}

        <div className="text-center pt-2">
          <Typography variant="body2" className="text-neutral/70">
            {t('auth.alreadyHaveAccount')}{' '}
            <a href="#" className="text-primary underline font-semibold" onClick={handleLoginLinkClick}>
              {t('auth.loginHere')}
            </a>
          </Typography>
        </div>
      </div>
    </div>
  );
}
