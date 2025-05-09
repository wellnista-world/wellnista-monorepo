'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { supabase } from '../lib/api/supabaseClient';
import DtxGraph from '../components/util/DtxChart';

const mealNames: string[] = ['เช้า', 'กลางวัน', 'เย็น', 'ก่อนนอน'];
const mealTime: string[] = ['ก่อนอาหาร', 'หลังอาหาร 2 ชม.'];

interface DtxRecord {
  id: number;
  date: string;
  dtx_value: number | null;
  meal_phase: string;
  meal: string;
  time: string;
}

export default function InforDtx() {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [dtxValue, setDtxValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [beforeData, setBeforeData] = useState<DtxRecord[]>([]);
  const [afterData, setAfterData] = useState<DtxRecord[]>([]);

  useEffect(() => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');

    setCurrentDate(`${year}-${month}-${day}`);
    setCurrentTime(`${hour}:${min}`);
  }, []);

  useEffect(() => {
    const fetchGraphData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('dtx_records')
        .select('id, date, dtx_value, meal_phase, meal, time')
        .eq('user_id', user.id)
        .order('date', { ascending: true })
        .limit(30);

      const before = data?.filter((r) => r.meal_phase === 'ก่อนอาหาร' || r.meal_phase === 'ก่อน') || [];
      const after = data?.filter((r) => r.meal_phase === 'หลังอาหาร 2 ชม.' || r.meal_phase === 'หลัง 2 ชม.') || [];

      setBeforeData(before);
      setAfterData(after);
    };

    fetchGraphData();
  }, [loading]);

  const handleSubmit = async () => {
    if (!selectedMeal || !selectedTime || !dtxValue) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert('กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('dtx_records').insert([
      {
        user_id: user.id,
        date: currentDate,
        time: currentTime,
        meal: selectedMeal,
        meal_phase: selectedTime,
        dtx_value: dtxValue,
      },
    ]);

    if (error) {
      console.error('Error inserting DTX:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } else {
      alert('บันทึกข้อมูลสำเร็จ!');
      setSelectedMeal('');
      setSelectedTime('');
      setDtxValue(null);
    }

    setLoading(false);
  };

  const handleUpdate = async (oldData: DtxRecord, newData: DtxRecord) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('dtx_records')
      .update(newData)
      .eq('user_id', user.id)
      .eq('id', oldData.id);

    if (error) {
      console.error('Error updating DTX:', error);
      alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
    } else {
      setLoading(true); 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet flex flex-col items-center px-4 py-6 space-y-4">
      <Typography variant="h5" className="text-primary font-magnolia text-3xl mb-2">
        สมุดบันทึกน้ำตาล
      </Typography>

      <div className="w-full max-w-sm space-y-4">
        <Typography className="text-xl font-bold">วัน-เวลา</Typography>
        <div className="flex gap-4">
          <Box className="bg-white border-2 border-primary rounded px-4 py-2 w-full text-center font-semibold text-lg">
            {currentDate}
          </Box>
        </div>

        <FormControl fullWidth>
          <InputLabel>เลือกมื้อ</InputLabel>
          <Select label="เลือกมื้อ" variant='outlined' value={selectedMeal} onChange={(e) => setSelectedMeal(e.target.value)} className="bg-white">
            {mealNames.map((meal) => (
              <MenuItem key={meal} value={meal}>{meal}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>ก่อน/หลัง</InputLabel>
          <Select label="ก่อน/หลัง" variant='outlined' value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="bg-white">
            {mealTime.map((item) => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="number"
          label="ค่า DTX"
          value={dtxValue ?? ''}
          onChange={(e) => setDtxValue(e.target.value === '' ? null : Number(e.target.value))}
          className="bg-white"
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          className="!bg-primary hover:!bg-accent !text-white font-garet text-xl rounded-full mt-6"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'บันทึก'}
        </Button>

        <DtxGraph
          data={beforeData}
          title="ก่อนอาหาร"
          normalMin={80}
          normalMax={182}
          maxY={450}
          onUpdate={handleUpdate}
        />

        <DtxGraph
          data={afterData}
          title="หลังอาหาร"
          normalMin={80}
          normalMax={160}
          maxY={450}
          onUpdate={handleUpdate}
        />

      </div>
    </div>
  );
}