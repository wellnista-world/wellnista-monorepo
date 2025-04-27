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
import WellnistaLogo from './components/WellnistaLogo';

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
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (!error && user) {
        // If already authenticated, redirect to home
        router.push('/home');
        return;
      }
      
      setUser(null);
    };

    checkAuth();
  }, [router]);

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
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // Clear any local storage or session data
      localStorage.clear();
      sessionStorage.clear();
      // Force a hard refresh of the page
      window.location.href = '/';
    }
  };

  return (
    <Box className="justify-center items-center flex flex-col gap-1 bg-secondary px-4 mt-6">
      <Typography
        variant="h4"
        className="font-bold text-center"
      >
        ยินดีต้อนรับเข้าสู่
      </Typography>
      <Box>
        <WellnistaLogo />
      </Box>
      <Typography
        variant="h5"
        className="font-bold mt-10 text-center"
      >
        เวลล์นิสต้า
      </Typography>
      <Typography
        variant="subtitle1"
        className="mt-10 text-lg text-center font-semibold"
      >
        ทำให้สุขภาพดี กลายเป็นเรื่องง่ายของทุกคน
      </Typography>

      <Box className="mt-6 w-full max-w-sm flex flex-col gap-4">
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
              fullWidth
              label="เบอร์โทร (เช่น 0812345678)"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white rounded"
            />
            <TextField
              fullWidth
              label="รหัสผ่าน"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

            <Box className="flex justify-between text-sm text-gray-500">
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
    </Box>
  );
}
