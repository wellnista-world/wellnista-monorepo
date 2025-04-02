'use client';

import { useState } from 'react';
import { supabase } from '../lib/api/supabaseClient';

import StdTextField from '../components/std/StdTextField';
import MultipleSelectCheckmarks from '../components/util/SelectChecker';
import StdSelect from '../components/std/StdSelect';

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
}

const genderName: string[] = ['ชาย', 'หญิง'];
const activitiveLevel: string[] = [
  'ไม่ออกกำลังกาย/นั่งทำงานอยู่กับที่',
  'ออกกำลังกายเล็กน้อย 1-3วัน/สัปดาห์',
  'ออกกำลังกายปานกลาง 4-5วัน/สัปดาห์',
  'ออกกำลังกายหนัก 6-7วัน/สัปดาห์',
  'ออกกำลังกายหนักมาก 2 ครั้ง/วัน เป็นนักกีฬา',
];
const diseaseNames  = [
  'เบาหวาน',
  'ไต',
  'หัวใจ',
  'ความดัน',
  'เก๊าต์',
  'ไขมัน',
  
];

export default function Register() {
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
  });

const handleInputChange = (field: keyof UserData, value: string | number) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDiseaseChangeValue = (values: string[]) => {
    setUserData((prev) => ({
      ...prev,
      diseases: values,
    }));
  };

  const handleSubmit = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
  
    if (userError || !user) {
      alert('คุณยังไม่ได้เข้าสู่ระบบ');
      return;
    }
  
    const { data, error } = await supabase.from('users').insert([
      {
        ...userData,
        user_id: user.id, // 👈 ผูกข้อมูลกับผู้ใช้ที่ login อยู่
      },
    ]);
  
    if (error) {
      console.error('Error inserting data:', error);
      alert('เกิดข้อผิดพลาดในการลงทะเบียน');
    } else {
      alert('ลงทะเบียนสำเร็จ!');
      console.log('User inserted:', data);
    }
  };

  return (
    <div className="grid grid-cols-6 gap-4 md:place-content-center bg-secondary text-neutral font-garet p-6">
      <div className="col-span-6 text-center text-3xl font-magnolia text-primary">ลงทะเบียน</div>

      <div className="col-span-4 text-2xl font-bold text-neutral">ชื่อ-นามสกุล</div>
      <div className="col-span-6 text-center">
        <StdTextField type="text" onChange={(e) => handleInputChange('name', e)} />
      </div>

      <div className="col-span-4 text-2xl font-bold text-neutral">ชื่อเล่น</div>
      <div className="col-span-6 text-center">
        <StdTextField type="text" onChange={(e) => handleInputChange('nickname', e)} />
      </div>

      <div className="col-span-6 text-2xl font-bold text-neutral">โรคประจำตัว (เลือกได้มากกว่า 1)</div>
      <div className="col-span-6 text-left">
        <MultipleSelectCheckmarks names={diseaseNames} onChangeValue={handleDiseaseChangeValue} />
      </div>

      <div className="col-span-4 text-2xl font-bold text-neutral">ยาประจำตัว</div>
      <div className="col-span-6 text-center">
        <StdTextField type="text" onChange={(e) => handleInputChange('madicines', e)} />
      </div>

      <div className="col-span-6 text-2xl font-bold text-neutral">เพศ</div>
      <div className="col-span-6 text-center">
        <StdSelect names={genderName} onChangeValue={(val) => handleInputChange('gender', val)} />
      </div>

      <div className="col-span-4 text-2xl font-bold text-neutral">อายุ</div>
      <div className="col-span-6 text-center">
        <StdTextField
          type="number"
          onChange={(e) => handleInputChange('age', Number(e))}
        />
      </div>

      <div className="col-span-3 text-2xl font-bold text-neutral">น้ำหนัก</div>
      <div className="col-span-3 text-2xl font-bold text-neutral">ส่วนสูง</div>
      <div className="col-start-1 col-end-4 text-center">
        <StdTextField
          type="number"
          onChange={(e) => handleInputChange('weight', Number(e))}
        />
      </div>
      <div className="col-start-4 col-end-7 text-center">
        <StdTextField
          type="number"
          onChange={(e) => handleInputChange('height', Number(e))}
        />
      </div>

      <div className="col-span-4 text-2xl font-bold text-neutral">เลือกกิจกรรม</div>
      <div className="col-span-6 text-center">
        <StdSelect
          names={activitiveLevel}
          onChangeValue={(val) => handleInputChange('activityLevel', val)}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-10 py-3 col-start-2 col-end-6 bg-primary text-center text-xl text-secondary font-bold rounded-md transition hover:bg-accent"
      >
        ลงทะเบียน
      </button>
    </div>
  );
}
