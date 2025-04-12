'use client';

import { useState } from 'react';
import { supabase } from '../lib/api/supabaseClient';
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  ThemeProvider,
} from '@mui/material';

import MultipleSelectCheckmarks from '../components/util/SelectChecker';
import StdSelect from '../components/std/StdSelect';
import theme from '..//components/theme/theme';
import { useRouter } from 'next/navigation';

interface UserData {
  name: string;
  nickname: string;
  diseases: string[];
  madicines: string;
  gender: string;
  age: number;
  weight: number;
  height: number;
  activityLevel: string;
  waist?: number;
}

const genderName: string[] = ['ชาย', 'หญิง'];
const activitiveLevel: string[] = [
  'ไม่ออกกำลังกาย/นั่งทำงานอยู่กับที่',
  'ออกกำลังกายเล็กน้อย 1-3วัน/สัปดาห์',
  'ออกกำลังกายปานกลาง 4-5วัน/สัปดาห์',
  'ออกกำลังกายหนัก 6-7วัน/สัปดาห์',
  'ออกกำลังกายหนักมาก 2 ครั้ง/วัน เป็นนักกีฬา',
];
const diseaseNames = ['เบาหวาน', 'ไต', 'หัวใจ', 'ความดัน', 'เก๊าต์', 'ไขมัน'];

export default function Register() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    name: '',
    nickname: '',
    diseases: [],
    madicines: '',
    gender: '',
    age: 0,
    weight: 0,
    height: 0,
    activityLevel: '',
    waist: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof UserData, value: string | number) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDiseaseChangeValue = (values: string[]) => {
    setUserData((prev) => ({ ...prev, diseases: values }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert('คุณยังไม่ได้เข้าสู่ระบบ');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.from('users').update({
      ...userData,
    }).eq('user_id', user.id);

    if (error) {
      console.error('Error inserting data:', error);
      alert('เกิดข้อผิดพลาดในการลงทะเบียน');
    } else {
      alert('ลงทะเบียนสำเร็จ!');
      router.push('/home');
    }

    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="min-h-screen bg-secondary text-neutral flex justify-center items-start px-4 pt-6 pb-12">
        <Box className="w-full max-w-sm p-6 space-y-4">
          <Typography variant="h5" className="text-primary font-magnolia text-center">
            ลงทะเบียน
          </Typography>

          <TextField
            label="ชื่อ - นามสกุล"
            fullWidth
            variant="outlined"
            value={userData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          <TextField
            label="ชื่อเล่น"
            fullWidth
            variant="outlined"
            value={userData.nickname}
            onChange={(e) => handleInputChange('nickname', e.target.value)}
          />

          <MultipleSelectCheckmarks names={diseaseNames} onChangeValue={handleDiseaseChangeValue} />

          <TextField
            label="ยาประจำตัว"
            fullWidth
            variant="outlined"
            value={userData.madicines}
            onChange={(e) => handleInputChange('madicines', e.target.value)}
          />

          <StdSelect names={genderName} onChangeValue={(val) => handleInputChange('gender', val)} />

          <TextField
            label="อายุ"
            fullWidth
            type="number"
            value={userData.age}
            onChange={(e) => handleInputChange('age', Number(e.target.value))}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="น้ำหนัก"
              type="number"
              value={userData.weight}
              onChange={(e) => handleInputChange('weight', Number(e.target.value))}
            />
            <TextField
              label="ส่วนสูง"
              type="number"
              value={userData.height}
              onChange={(e) => handleInputChange('height', Number(e.target.value))}
            />
          </div>

          <TextField
            label="รอบเอว"
            fullWidth
            type="number"
            value={userData.waist}
            inputProps={{ min: 1 }}
            onChange={(e) => handleInputChange('waist', Number(e.target.value))}
          />

          <StdSelect names={activitiveLevel} onChangeValue={(val) => handleInputChange('activityLevel', val)} />

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            className="!bg-primary hover:!bg-accent !text-white mt-4 rounded-full"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'ลงทะเบียน'}
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
