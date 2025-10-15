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
import { useI18n } from '../../i18n';

// Thai values for database storage
const mealNamesThai: string[] = ['เช้า', 'กลางวัน', 'เย็น', 'ก่อนนอน'];
const mealTimeThai: string[] = ['ก่อนอาหาร', 'หลังอาหาร 2 ชม.'];

// Translation keys for display
const mealNamesKeys: string[] = ['morning', 'lunch', 'evening', 'beforeBed'];
const mealTimeKeys: string[] = ['beforeMeal', 'afterMeal'];

interface DtxRecord {
  id: number;
  date: string;
  dtx_value: number | null;
  meal_phase: string;
  meal: string;
  time: string;
}

export default function InforDtx() {
  const { t } = useI18n();
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [dtxValue, setDtxValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [beforeData, setBeforeData] = useState<DtxRecord[]>([]);
  const [afterData, setAfterData] = useState<DtxRecord[]>([]);

  // Helper function to get Thai value from translation key
  const getThaiValue = (key: string, type: 'meal' | 'time'): string => {
    if (type === 'meal') {
      const index = mealNamesKeys.indexOf(key);
      return index !== -1 ? mealNamesThai[index] : key;
    } else {
      const index = mealTimeKeys.indexOf(key);
      return index !== -1 ? mealTimeThai[index] : key;
    }
  };

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
      alert(t('bloodSugar.pleaseCompleteData'));
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert(t('bloodSugar.pleaseLoginFirst'));
      setLoading(false);
      return;
    }

    // Convert translation keys to Thai values for database storage
    const thaiMeal = getThaiValue(selectedMeal, 'meal');
    const thaiTime = getThaiValue(selectedTime, 'time');

    const { error } = await supabase.from('dtx_records').insert([
      {
        user_id: user.id,
        date: currentDate,
        time: currentTime,
        meal: thaiMeal,
        meal_phase: thaiTime,
        dtx_value: dtxValue,
      },
    ]);

    if (error) {
      console.error('Error inserting DTX:', error);
      alert(t('bloodSugar.errorSavingData'));
    } else {
      alert(t('bloodSugar.dataSavedSuccessfully'));
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
      alert(t('bloodSugar.errorUpdatingData'));
    } else {
      setLoading(true); 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet flex flex-col items-center px-4 py-6 space-y-4">
      <Typography variant="h5" className="text-primary font-magnolia text-3xl mb-2">
        {t('bloodSugar.title')}
      </Typography>

      <div className="w-full max-w-sm space-y-4">
        <Typography className="text-xl font-bold">{t('bloodSugar.dateTime')}</Typography>
        <div className="flex gap-4">
          <Box className="bg-white border-2 border-primary rounded px-4 py-2 w-full text-center font-semibold text-lg">
            {currentDate}
          </Box>
        </div>

        <FormControl fullWidth>
          <InputLabel>{t('bloodSugar.selectMeal')}</InputLabel>
          <Select label={t('bloodSugar.selectMeal')} variant='outlined' value={selectedMeal} onChange={(e) => setSelectedMeal(e.target.value)} className="bg-white">
            {mealNamesKeys.map((meal) => (
              <MenuItem key={meal} value={meal}>{t(`bloodSugar.${meal}`)}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>{t('bloodSugar.beforeAfter')}</InputLabel>
          <Select label={t('bloodSugar.beforeAfter')} variant='outlined' value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="bg-white">
            {mealTimeKeys.map((item) => (
              <MenuItem key={item} value={item}>{t(`bloodSugar.${item}`)}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="number"
          label={t('bloodSugar.bloodGlucoseValue')}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : t('bloodSugar.save')}
        </Button>

        <DtxGraph
          data={beforeData}
          title={t('bloodSugar.beforeMealGraph')}
          normalMin={80}
          normalMax={182}
          maxY={450}
          onUpdate={handleUpdate}
        />

        <DtxGraph
          data={afterData}
          title={t('bloodSugar.afterMealGraph')}
          normalMin={80}
          normalMax={160}
          maxY={450}
          onUpdate={handleUpdate}
        />

      </div>
    </div>
  );
}