'use client';

import { useEffect, useState } from 'react';
import { supabase } from './lib/api/supabaseClient';
import Link from 'next/link';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';

interface User {
  phone?: string;
  password?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formatPhoneNumber = (rawPhone: string) => {
    const cleaned = rawPhone.replace(/\D/g, ''); // ลบ non-numeric ออก
    if (cleaned.startsWith('0')) {
      return '+66' + cleaned.slice(1);
    }
    return '+66' + cleaned; // fallback กรณี user ลืมใส่ 0
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };

    getUser();
  }, []);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    const formattedPhone = formatPhoneNumber(phone);
    const { data, error } = await supabase.auth.signInWithPassword({
      phone: formattedPhone,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
      router.push('/home');
    }
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="flex flex-col justify-center items-center bg-secondary text-neutral font-garet min-h-screen px-4">
      <Typography
        variant="h3"
        className="font-magnolia font-bold text-primary mt-10 text-center"
      >
        ยินดีต้อนรับเข้าสู่ Wellnista
      </Typography>
      <Typography
        variant="subtitle1"
        className="mt-5 font-garet text-neutral text-lg text-center font-semibold"
      >
        Design your happier wellness life with AI-powered insights.
      </Typography>

      <Box className="mt-10 w-full max-w-sm flex flex-col gap-4">
        {user ? (
          <>
            <Typography className="text-xl text-center">
              ยินดีต้อนรับ, {user.phone}
            </Typography>
            <Button
              variant="contained"
              onClick={signOut}
              className="bg-red-500 hover:bg-red-600 text-white font-garet"
              fullWidth
            >
              ออกจากระบบ
            </Button>
          </>
        ) : (
          <>
            <TextField
              label="เบอร์โทร (เช่น 0812345678)"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              className="bg-white rounded"
            />
            <TextField
              label="รหัสผ่าน"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              className="bg-white rounded"
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="px-6 py-3 bg-primary text-secondary rounded-full hover:bg-accent transition font-garet"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'เข้าสู่ระบบ'}
            </button>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Box className="flex justify-between mt-2 text-sm text-gray-500">
              <Link href="/register/signup" passHref legacyBehavior>
                <Typography className="cursor-pointer hover:underline">ลงทะเบียน</Typography>
              </Link>
              <Typography className="cursor-pointer hover:underline" onClick={() => {}}>
                ลืมรหัสผ่าน?
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </div>
  );
}
