'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/api/supabaseClient';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useI18n } from '../../../i18n';

export default function SignupPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (rawPhone: string) => {
    const cleaned = rawPhone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '+66' + cleaned.slice(1);
    }
    return '+66' + cleaned;
  };

  const handleLoginLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    router.push('/');
  };

  const handleSignup = async () => {
    setError(null);
    setLoading(true);

    const formattedPhone = formatPhoneNumber(phone);

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
    <div className="flex flex-col justify-center items-center min-h-screen bg-secondary text-neutral font-garet text-center px-4">
      <Typography variant="h3" className="font-magnolia font-bold text-primary mt-10">
        {t('auth.signupTitle')}
      </Typography>
      <Typography variant="subtitle1" className="mt-4 font-garet font-semibold text-neutral">
        {t('auth.signupSubtitle')}
      </Typography>

      <Box className="w-full max-w-sm mt-10 flex flex-col gap-4">
        <TextField
          label={t('auth.phonePlaceholder')}
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          className="bg-white rounded"
        />
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
          className="px-6 py-3 bg-primary text-secondary rounded-full hover:bg-accent transition font-garet"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.signup')}
        </button>
        {error && <Typography color="error">{error}</Typography>}

        <Typography variant="body2" className="mt-4">
          {t('auth.alreadyHaveAccount')}{' '}
          <a href="#" className="text-primary underline" onClick={handleLoginLinkClick}>
            {t('auth.loginHere')}
          </a>
        </Typography>
      </Box>
    </div>
  );
}
