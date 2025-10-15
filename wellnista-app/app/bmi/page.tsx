'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { supabase } from '../lib/api/supabaseClient';
import { useI18n } from '../../i18n';
import { TrendingUp, Scale, Ruler, Activity } from 'lucide-react';
import BmiChart from '../components/util/BmiChart';

interface BmiRecord {
  id: number;
  date: string;
  time: string;
  weight: number | null;
  height: number | null;
  waist: number | null;
  bmi: number | null;
  bmi_category: string | null;
}

export default function BmiTracking() {
  const { t } = useI18n();
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [weight, setWeight] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [waist, setWaist] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [bmiRecords, setBmiRecords] = useState<BmiRecord[]>([]);
  const [lastRecord, setLastRecord] = useState<BmiRecord | null>(null);

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
    const fetchBmiData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('bmi_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (data && data.length > 0) {
        setBmiRecords(data);
        setLastRecord(data[0]);
      }
    };

    fetchBmiData();
  }, [loading]);

  const calculateBmi = (weight: number, height: number): number => {
    // BMI = weight(kg) / (height(m))^2
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBmiCategory = (bmi: number): string => {
    if (bmi < 18.5) return 'underweight';
    if (bmi >= 18.5 && bmi < 25) return 'normal';
    if (bmi >= 25 && bmi < 30) return 'overweight';
    return 'obese';
  };

  const getBmiColor = (category: string): string => {
    switch (category) {
      case 'underweight': return 'bg-blue-100 text-blue-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'overweight': return 'bg-yellow-100 text-yellow-800';
      case 'obese': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = async () => {
    if (!weight || !height) {
      alert(t('bmi.pleaseCompleteData'));
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert(t('bmi.pleaseLoginFirst'));
      setLoading(false);
      return;
    }

    const calculatedBmi = calculateBmi(weight, height);
    const bmiCategory = getBmiCategory(calculatedBmi);

    const { error } = await supabase.from('bmi_records').insert([
      {
        user_id: user.id,
        date: currentDate,
        time: currentTime,
        weight: weight,
        height: height,
        waist: waist,
        bmi: calculatedBmi,
        bmi_category: bmiCategory,
      },
    ]);

    if (error) {
      console.error('Error inserting BMI record:', error);
      alert(t('bmi.errorSavingData'));
    } else {
      alert(t('bmi.dataSavedSuccessfully'));
      setWeight(null);
      setHeight(null);
      setWaist(null);
    }

    setLoading(false);
  };

  const handleUpdate = async (oldData: BmiRecord, newData: BmiRecord) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('bmi_records')
      .update(newData)
      .eq('user_id', user.id)
      .eq('id', oldData.id);

    if (error) {
      console.error('Error updating BMI record:', error);
      alert(t('bmi.errorUpdatingData'));
    } else {
      setLoading(true); 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet flex flex-col items-center px-4 py-6 space-y-4">
      <Typography variant="h5" className="text-primary font-magnolia text-3xl mb-2">
        {t('bmi.title')}
      </Typography>

      <div className="w-full max-w-sm space-y-4">
        {/* Date & Time Display */}
        <Typography className="text-xl font-bold">{t('bmi.dateTime')}</Typography>
        <div className="flex gap-4">
          <Box className="bg-white border-2 border-primary rounded px-4 py-2 w-full text-center font-semibold text-lg">
            {currentDate}
          </Box>
        </div>

        {/* Input Fields */}
        <TextField
          fullWidth
          type="number"
          label={t('bmi.weight')}
          value={weight ?? ''}
          onChange={(e) => setWeight(e.target.value === '' ? null : Number(e.target.value))}
          className="bg-white"
          InputProps={{
            startAdornment: <Scale size={20} className="text-primary mr-2" />,
          }}
        />

        <TextField
          fullWidth
          type="number"
          label={t('bmi.height')}
          value={height ?? ''}
          onChange={(e) => setHeight(e.target.value === '' ? null : Number(e.target.value))}
          className="bg-white"
          InputProps={{
            startAdornment: <Ruler size={20} className="text-primary mr-2" />,
          }}
        />

        <TextField
          fullWidth
          type="number"
          label={t('bmi.waist')}
          value={waist ?? ''}
          onChange={(e) => setWaist(e.target.value === '' ? null : Number(e.target.value))}
          className="bg-white"
          InputProps={{
            startAdornment: <Activity size={20} className="text-primary mr-2" />,
          }}
        />

        {/* Save Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          className="!bg-primary hover:!bg-accent !text-white font-garet text-xl rounded-full mt-6"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('bmi.save')}
        </Button>

        {/* Last Record Display */}
        {lastRecord && (
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold text-primary mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                {t('bmi.lastRecord')}
              </Typography>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <Typography variant="body2" className="text-neutral/70">
                    {t('bmi.weight')}
                  </Typography>
                  <Typography variant="h6" className="font-bold text-primary">
                    {lastRecord.weight} {t('bmi.unitKg')}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography variant="body2" className="text-neutral/70">
                    {t('bmi.height')}
                  </Typography>
                  <Typography variant="h6" className="font-bold text-primary">
                    {lastRecord.height} {t('bmi.unitCm')}
                  </Typography>
                </div>
              </div>

              {lastRecord.waist && (
                <div className="text-center mb-4">
                  <Typography variant="body2" className="text-neutral/70">
                    {t('bmi.waist')}
                  </Typography>
                  <Typography variant="h6" className="font-bold text-primary">
                    {lastRecord.waist} {t('bmi.unitCm')}
                  </Typography>
                </div>
              )}

              <div className="text-center">
                <Typography variant="body2" className="text-neutral/70 mb-2">
                  {t('bmi.currentBMI')}
                </Typography>
                <Typography variant="h4" className="font-bold text-primary mb-2">
                  {lastRecord.bmi?.toFixed(1)}
                </Typography>
                {lastRecord.bmi_category && (
                  <Chip
                    label={t(`${lastRecord.bmi_category}`)}
                    className={`${getBmiColor(lastRecord.bmi_category)} font-semibold`}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Target BMI Info */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-4">
            <Typography variant="body2" className="text-center text-neutral/70">
              {t('bmi.targetBMI')}
            </Typography>
          </CardContent>
        </Card>

        {/* BMI Records List */}
        {bmiRecords.length > 0 && (
          <Card className="bg-white shadow-lg">
            <CardContent className="p-4">
              <Typography variant="h6" className="font-bold text-primary mb-4">
                {t('bmi.bmiGraph')}
              </Typography>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {bmiRecords.slice(0, 10).map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <Typography variant="body2" className="font-semibold">
                        {record.date}
                      </Typography>
                      <Typography variant="caption" className="text-neutral/70">
                        {record.weight}{t('bmi.unitKg')} / {record.height}{t('bmi.unitCm')}
                      </Typography>
                    </div>
                    <div className="text-right">
                      <Typography variant="body2" className="font-bold">
                        {record.bmi?.toFixed(1)}
                      </Typography>
                      {record.bmi_category && (
                        <Chip
                          size="small"
                          label={t(`${record.bmi_category}`)}
                          className={`${getBmiColor(record.bmi_category)} text-xs`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {bmiRecords.length === 0 && (
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <Typography variant="body1" className="text-neutral/70">
                {t('bmi.noData')}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* BMI Charts */}
        {bmiRecords.length > 0 && (
          <>
            <BmiChart
              data={bmiRecords}
              title={t('bmi.bmiGraph')}
              dataKey="bmi"
              normalMin={18.5}
              normalMax={24.9}
              maxY={40}
              onUpdate={handleUpdate}
            />

            <BmiChart
              data={bmiRecords}
              title={t('bmi.weightGraph')}
              dataKey="weight"
              maxY={200}
              onUpdate={handleUpdate}
            />

            {bmiRecords.some(record => record.waist) && (
              <BmiChart
                data={bmiRecords.filter(record => record.waist)}
                title={t('bmi.waistGraph')}
                dataKey="waist"
                maxY={150}
                onUpdate={handleUpdate}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
