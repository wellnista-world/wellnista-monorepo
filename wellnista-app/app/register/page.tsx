'use client';

import { useState, } from 'react';
import { supabase } from '../lib/api/supabaseClient';
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  ThemeProvider,
  FormControl,
} from '@mui/material';

import MultipleSelectCheckmarks from '../components/util/SelectChecker';
import StdSelect from '../components/std/StdSelect';
import theme from '..//components/theme/theme';
import { useRouter } from 'next/navigation';

export interface UserData {
  name: string;
  nickname: string;
  diseases: string[];
  medicines: string;
  gender: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  activitylevel: string;
  waist?: number | null;
}

const genderName: string[] = ['ชาย', 'หญิง'];
const activitiveLevel: string[] = [
  'ไม่ออกกำลังกาย/นั่งทำงานอยู่กับที่',
  'ออกกำลังกายเล็กน้อย 1-3วัน/สัปดาห์',
  'ออกกำลังกายปานกลาง 4-5วัน/สัปดาห์',
  'ออกกำลังกายหนัก 6-7วัน/สัปดาห์',
  'ออกกำลังกายหนักมาก 2 ครั้ง/วัน เป็นนักกีฬา',
];
const diseaseNames = ['เบาหวาน', 'ไต', 'หัวใจ', 'ความดัน', 'เก๊าต์', 'ไขมัน', 'อื่นๆ', 'ไม่มี'];


export default function Register() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    name: '',
    nickname: '',
    diseases: [],
    medicines: '',
    gender: '',
    age: null,
    weight: null,
    height: null,
    activitylevel: '',
    waist: null,
  });

  const [loading, setLoading] = useState(false);
  const [newDisease, setNewDisease] = useState("");
  const [popUp, setPopUp] = useState(false);

  const handleInputChange = (field: keyof UserData, value: string | number | null) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDiseaseChangeValue = (values: string[]) => {
    setUserData((prev) => ({ ...prev, diseases: values }));

    if(values.includes('อื่นๆ')){
      setPopUp(true);
    }else {
      setPopUp(false);
    }
    
  };


  const handleAddDisease = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDisease(event.target.value);
    /*const findIndex = userData.diseases.indexOf("อื่นๆ")
    console.log (findIndex);
    if (newDisease.trim() !== '') {
      setUserData(prevUserData => ({
        ...prevUserData,
        diseases: [...prevUserData.diseases[findIndex], newDisease],
      }));
      //setNewDisease(''); // เคลียร์ input หลังจากเพิ่ม
      console.log (userData.diseases);
    }*/
  };

  const handleBlur = () => {
    if (newDisease.trim() !== '') {
      const findIndex = userData.diseases.indexOf("อื่นๆ");
      setUserData(prevUserData => {
        const updatedDiseases = [...prevUserData.diseases];
        if (findIndex !== -1) {
          updatedDiseases[findIndex] = prevUserData.diseases[findIndex] + ' ' + newDisease.trim();
        } else {
          updatedDiseases.push(newDisease.trim());
        }
        return { ...prevUserData, diseases: updatedDiseases };
      });
      // ไม่เคลียร์ newDisease ที่นี่
    }
    console.log(userData.diseases);
  }


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

    const { error } = await supabase.from('users').update({
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
      <Box className="min-h-screen bg-secondary flex justify-center items-start px-4 pt-6 pb-12">
        <Box className="w-full max-w-sm p-6 space-y-4">
          <Typography variant="h5" className="text-primary text-neutral font-garet text-center">
            ลงทะเบียน
          </Typography>

          <TextField
            id="outlined-basic"
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

          <FormControl fullWidth>
            <MultipleSelectCheckmarks labelInput='โรคประจำตัว' names={diseaseNames} onChangeValue={handleDiseaseChangeValue} >
            </MultipleSelectCheckmarks> 
          </FormControl>

          { popUp &&(
              <TextField
              label="โรคประจำตัวอื่นๆ"
              fullWidth
              variant='outlined'
              value={newDisease}
              onChange={handleAddDisease}
              onBlur={handleBlur}
            />
          ) }
          

          <TextField
            label="ยาประจำตัว"
            fullWidth
            variant="outlined"
            value={userData.medicines}
            onChange={(e) => handleInputChange('medicines', e.target.value)}
          />
     
          <StdSelect label='เพศ' names={genderName} onChangeValue={(val) => handleInputChange('gender', val)} />

          <TextField
            label="อายุ"
            fullWidth
            type="number"
            value={userData.age ?? ''}
            onChange={(e) => handleInputChange('age', e.target.value === '' ? null : Number(e.target.value))}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="น้ำหนัก"
              type="number"
              value={userData.weight ?? ''}
              onChange={(e) => handleInputChange('weight', e.target.value === '' ? null : Number(e.target.value))}
            />
            <TextField
              label="ส่วนสูง"
              type="number"
              value={userData.height ?? ''}
              onChange={(e) => handleInputChange('height', e.target.value === '' ? null : Number(e.target.value))}
            />
          </div>

          <TextField
            label="รอบเอว"
            fullWidth
            type="number"
            value={userData.waist ?? ''}
            onChange={(e) => handleInputChange('waist', e.target.value === '' ? null : Number(e.target.value))}
          />

          <StdSelect label='ระดับกิจกรรม' names={activitiveLevel} onChangeValue={(val) => handleInputChange('activitylevel', val)} />
          
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
