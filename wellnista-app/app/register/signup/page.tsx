'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/api/supabaseClient';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function SignupPage() {
  const router = useRouter();
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

  const handleSignup = async () => {
    setError(null);
    setLoading(true);

    const formattedPhone = formatPhoneNumber(phone);

    const { data, error } = await supabase.auth.signUp({
      phone: formattedPhone,
      password,
    });

    if (error || !data.user) {
      setError(error?.message ?? 'เกิดข้อผิดพลาด');
      setLoading(false);
      return;
    }

    // ✅ Insert into 'users' table
    const { user } = data;
    const { error: insertError } = await supabase.from('users').insert([
      {
        user_id: user.id,
      },
    ]);

    if (insertError) {
      setError('สมัครสำเร็จ แต่เกิดข้อผิดพลาดในการบันทึกข้อมูลเพิ่มเติม');
      console.error(insertError);
    }

    router.push('/register');
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-secondary text-neutral font-garet text-center px-4">
      <Typography variant="h3" className="font-magnolia font-bold text-primary mt-10">
        สมัครสมาชิก
      </Typography>
      <Typography variant="subtitle1" className="mt-4 font-garet font-semibold text-neutral">
        ลงทะเบียนด้วยเบอร์โทรและรหัสผ่านของคุณ
      </Typography>

      <Box className="w-full max-w-sm mt-10 flex flex-col gap-4">
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
          onClick={handleSignup}
          disabled={loading}
          className="px-6 py-3 bg-primary text-secondary rounded-full hover:bg-accent transition font-garet"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'สมัครสมาชิก'}
        </button>
        {error && <Typography color="error">{error}</Typography>}

        <Typography variant="body2" className="mt-4">
          มีบัญชีแล้ว?{' '}
          <a href="" className="text-primary underline">
            เข้าสู่ระบบ
          </a>
        </Typography>
      </Box>
    </div>
  );
}
