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
import { Heart, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import BloodPressureChart from '../../app/components/util/BloodPressureChart';

interface BloodPressureRecord {
  id: number;
  date: string;
  time: string;
  systolic: number | null;
  diastolic: number | null;
  pulse: number | null;
  bp_category: string | null;
  notes?: string | null;
}

export default function BloodPressureTracking() {
  const { t } = useI18n();
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [systolic, setSystolic] = useState<number | null>(null);
  const [diastolic, setDiastolic] = useState<number | null>(null);
  const [pulse, setPulse] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [bpRecords, setBpRecords] = useState<BloodPressureRecord[]>([]);
  const [lastRecord, setLastRecord] = useState<BloodPressureRecord | null>(null);

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
    const fetchBpData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('blood_pressure_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (data && data.length > 0) {
        setBpRecords(data);
        setLastRecord(data[0]);
      }
    };

    fetchBpData();
  }, [loading]);

  const getBpCategory = (systolic: number, diastolic: number): string => {
    if (systolic < 120 && diastolic < 80) return 'normal';
    if (systolic < 130 && diastolic < 80) return 'elevated';
    if (systolic < 140 || diastolic < 90) return 'stage1';
    if (systolic < 180 || diastolic < 120) return 'stage2';
    return 'crisis';
  };

  const getBpColor = (category: string): string => {
    switch (category) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'elevated': return 'bg-yellow-100 text-yellow-800';
      case 'stage1': return 'bg-orange-100 text-orange-800';
      case 'stage2': return 'bg-red-100 text-red-800';
      case 'crisis': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBpIcon = (category: string) => {
    switch (category) {
      case 'normal': return <Heart size={20} className="text-green-600" />;
      case 'elevated': return <Activity size={20} className="text-yellow-600" />;
      case 'stage1': return <AlertTriangle size={20} className="text-orange-600" />;
      case 'stage2': return <AlertTriangle size={20} className="text-red-600" />;
      case 'crisis': return <AlertTriangle size={20} className="text-red-800" />;
      default: return <Heart size={20} className="text-gray-600" />;
    }
  };

  const handleSubmit = async () => {
    if (!systolic || !diastolic) {
      alert(t('bloodPressure.pleaseCompleteData'));
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert(t('bloodPressure.pleaseLoginFirst'));
      setLoading(false);
      return;
    }

    const bpCategory = getBpCategory(systolic, diastolic);

    const { error } = await supabase.from('blood_pressure_records').insert([
      {
        user_id: user.id,
        date: currentDate,
        time: currentTime,
        systolic: systolic,
        diastolic: diastolic,
        pulse: pulse,
        bp_category: bpCategory,
        notes: notes || null,
      },
    ]);

    if (error) {
      console.error('Error inserting blood pressure record:', error);
      alert(t('bloodPressure.errorSavingData'));
    } else {
      alert(t('bloodPressure.dataSavedSuccessfully'));
      setSystolic(null);
      setDiastolic(null);
      setPulse(null);
      setNotes('');
    }

    setLoading(false);
  };

  const handleUpdate = async (oldData: BloodPressureRecord, newData: BloodPressureRecord) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('blood_pressure_records')
      .update(newData)
      .eq('user_id', user.id)
      .eq('id', oldData.id);

    if (error) {
      console.error('Error updating blood pressure record:', error);
      alert(t('bloodPressure.errorUpdatingData'));
    } else {
      setLoading(true); 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet flex flex-col items-center px-4 py-6 space-y-4">
      <Typography variant="h5" className="text-primary font-magnolia text-3xl mb-2">
        {t('bloodPressure.title')}
      </Typography>

      <div className="w-full max-w-sm space-y-4">
        {/* Date & Time Display */}
        <Typography className="text-xl font-bold">{t('bloodPressure.dateTime')}</Typography>
        <div className="flex gap-4">
          <Box className="bg-white border-2 border-primary rounded px-4 py-2 w-full text-center font-semibold text-lg">
            {currentDate}
          </Box>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-2 gap-4">
          <TextField
            fullWidth
            type="number"
            label={t('bloodPressure.systolic')}
            value={systolic ?? ''}
            onChange={(e) => setSystolic(e.target.value === '' ? null : Number(e.target.value))}
            className="bg-white"
            InputProps={{
              startAdornment: <Heart size={20} className="text-primary mr-2" />,
            }}
          />
          <TextField
            fullWidth
            type="number"
            label={t('bloodPressure.diastolic')}
            value={diastolic ?? ''}
            onChange={(e) => setDiastolic(e.target.value === '' ? null : Number(e.target.value))}
            className="bg-white"
            InputProps={{
              startAdornment: <Heart size={20} className="text-primary mr-2" />,
            }}
          />
        </div>

        <TextField
          fullWidth
          type="number"
          label={t('bloodPressure.pulse')}
          value={pulse ?? ''}
          onChange={(e) => setPulse(e.target.value === '' ? null : Number(e.target.value))}
          className="bg-white"
          InputProps={{
            startAdornment: <Activity size={20} className="text-primary mr-2" />,
          }}
        />

        <TextField
          fullWidth
          label={t('bloodPressure.notes')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-white"
          multiline
          rows={2}
        />

        {/* Save Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          className="!bg-primary hover:!bg-accent !text-white font-garet text-xl rounded-full mt-6"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('bloodPressure.save')}
        </Button>

        {/* Last Record Display */}
        {lastRecord && (
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold text-primary mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                {t('bloodPressure.lastRecord')}
              </Typography>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <Typography variant="body2" className="text-neutral/70">
                    {t('bloodPressure.systolic')}
                  </Typography>
                  <Typography variant="h6" className="font-bold text-primary">
                    {lastRecord.systolic} {t('bloodPressure.unitMmHg')}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography variant="body2" className="text-neutral/70">
                    {t('bloodPressure.diastolic')}
                  </Typography>
                  <Typography variant="h6" className="font-bold text-primary">
                    {lastRecord.diastolic} {t('bloodPressure.unitMmHg')}
                  </Typography>
                </div>
              </div>

              {lastRecord.pulse && (
                <div className="text-center mb-4">
                  <Typography variant="body2" className="text-neutral/70">
                    {t('bloodPressure.pulse')}
                  </Typography>
                  <Typography variant="h6" className="font-bold text-primary">
                    {lastRecord.pulse} {t('bloodPressure.unitBpm')}
                  </Typography>
                </div>
              )}

              <div className="text-center">
                <Typography variant="body2" className="text-neutral/70 mb-2">
                  {t('bloodPressure.currentBP')}
                </Typography>
                <Typography variant="h4" className="font-bold text-primary mb-2">
                  {lastRecord.systolic}/{lastRecord.diastolic}
                </Typography>
                {lastRecord.bp_category && (
                  <div className="flex items-center justify-center gap-2">
                    {getBpIcon(lastRecord.bp_category)}
                    <Chip
                      label={t(`bloodPressure.categories.${lastRecord.bp_category}`)}
                      className={`${getBpColor(lastRecord.bp_category)} font-semibold`}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Target BP Info */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-4">
            <Typography variant="body2" className="text-center text-neutral/70">
              {t('bloodPressure.targetBP')}
            </Typography>
          </CardContent>
        </Card>

        {/* BP Records List */}
        {bpRecords.length > 0 && (
          <Card className="bg-white shadow-lg">
            <CardContent className="p-4">
              <Typography variant="h6" className="font-bold text-primary mb-4">
                {t('bloodPressure.bpGraph')}
              </Typography>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {bpRecords.slice(0, 10).map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <Typography variant="body2" className="font-semibold">
                        {record.date}
                      </Typography>
                      <Typography variant="caption" className="text-neutral/70">
                        {record.systolic}/{record.diastolic} {t('bloodPressure.unitMmHg')}
                      </Typography>
                    </div>
                    <div className="text-right">
                      <Typography variant="body2" className="font-bold">
                        {record.systolic}/{record.diastolic}
                      </Typography>
                      {record.bp_category && (
                        <Chip
                          size="small"
                          label={t(`bloodPressure.categories.${record.bp_category}`)}
                          className={`${getBpColor(record.bp_category)} text-xs`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {bpRecords.length === 0 && (
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <Typography variant="body1" className="text-neutral/70">
                {t('bloodPressure.noData')}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* BP Charts */}
        {bpRecords.length > 0 && (
          <>
            <BloodPressureChart
              data={bpRecords}
              title={t('bloodPressure.systolicGraph')}
              dataKey="systolic"
              normalMin={90}
              normalMax={120}
              maxY={200}
              onUpdate={handleUpdate}
            />

            <BloodPressureChart
              data={bpRecords}
              title={t('bloodPressure.diastolicGraph')}
              dataKey="diastolic"
              normalMin={60}
              normalMax={80}
              maxY={120}
              onUpdate={handleUpdate}
            />

            {bpRecords.some(record => record.pulse) && (
              <BloodPressureChart
                data={bpRecords.filter(record => record.pulse)}
                title={t('bloodPressure.pulseGraph')}
                dataKey="pulse"
                normalMin={60}
                normalMax={100}
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
