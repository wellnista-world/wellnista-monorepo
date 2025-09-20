'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, Typography, IconButton, Dialog, DialogContent } from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';
import { useI18n } from '../../../i18n';

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

interface BloodPressureChartProps {
  data: BloodPressureRecord[];
  title: string;
  dataKey: keyof Pick<BloodPressureRecord, 'systolic' | 'diastolic' | 'pulse'>;
  normalMin: number;
  normalMax: number;
  maxY: number;
  onUpdate: (oldData: BloodPressureRecord, newData: BloodPressureRecord) => void;
}

export default function BloodPressureChart({
  data,
  title,
  dataKey,
  normalMin,
  normalMax,
  maxY,
}: BloodPressureChartProps) {
  const { t } = useI18n();
  const [editingRecord, setEditingRecord] = useState<BloodPressureRecord | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Transform data for chart
  const chartData = data
    .filter(record => record[dataKey] !== null)
    .map(record => ({
      ...record,
      date: new Date(record.date).toLocaleDateString(),
      value: record[dataKey] as number,
    }))
    .reverse(); // Show oldest to newest

  const handleEdit = (record: BloodPressureRecord) => {
    setEditingRecord(record);
    setEditDialogOpen(true);
  };

  const handleDelete = async (recordId: number) => {
    if (window.confirm(t('bloodPressure.confirmDelete'))) {
      // Here you would call the delete API
      console.log('Delete record:', recordId);
    }
  };

  const getDataKeyLabel = () => {
    switch (dataKey) {
      case 'systolic': return t('bloodPressure.systolic');
      case 'diastolic': return t('bloodPressure.diastolic');
      case 'pulse': return t('bloodPressure.pulse');
      default: return '';
    }
  };

  const getUnit = () => {
    switch (dataKey) {
      case 'systolic':
      case 'diastolic': return t('bloodPressure.unitMmHg');
      case 'pulse': return t('bloodPressure.unitBpm');
      default: return '';
    }
  };

  const getLineColor = () => {
    switch (dataKey) {
      case 'systolic': return '#ef4444'; // red
      case 'diastolic': return '#3b82f6'; // blue
      case 'pulse': return '#10b981'; // green
      default: return '#6b7280'; // gray
    }
  };

  return (
    <>
      <Card className="bg-white shadow-lg">
        <CardContent className="p-4">
          <Typography variant="h6" className="font-bold text-primary mb-4">
            {title}
          </Typography>
          
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    domain={[0, maxY]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value} ${getUnit()}`, getDataKeyLabel()]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <ReferenceLine 
                    y={normalMin} 
                    stroke="#10b981" 
                    strokeDasharray="5 5" 
                    label={{ value: `Normal Min: ${normalMin}`, position: "top" }}
                  />
                  <ReferenceLine 
                    y={normalMax} 
                    stroke="#10b981" 
                    strokeDasharray="5 5" 
                    label={{ value: `Normal Max: ${normalMax}`, position: "top" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={getLineColor()}
                    strokeWidth={2}
                    dot={{ fill: getLineColor(), strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: getLineColor(), strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <Typography variant="body1" className="text-neutral/70">
                {t('bloodPressure.noDataForChart')}
              </Typography>
            </div>
          )}

          {/* Records List */}
          {chartData.length > 0 && (
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {chartData.map((record) => (
                <div key={record.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <Typography variant="body2" className="font-semibold">
                      {record.date}
                    </Typography>
                    <Typography variant="caption" className="text-neutral/70">
                      {record.time}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography variant="body2" className="font-bold">
                      {record.value} {getUnit()}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(record)}
                      className="text-primary hover:text-accent"
                    >
                      <Edit size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(record.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent className="p-6">
          <Typography variant="h6" className="font-bold text-primary mb-4">
            {t('bloodPressure.editRecord')}
          </Typography>
          {editingRecord && (
            <div className="space-y-4">
              <Typography variant="body2" className="text-neutral/70">
                {t('bloodPressure.editNote')}
              </Typography>
              <Typography variant="body1" className="font-medium">
                {editingRecord.date} - {editingRecord.time}
              </Typography>
              <Typography variant="body1" className="font-medium">
                {getDataKeyLabel()}: {editingRecord[dataKey]} {getUnit()}
              </Typography>
              {/* Here you would add form fields for editing */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setEditDialogOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => {
                    // Handle save logic here
                    setEditDialogOpen(false);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-accent"
                >
                  {t('common.save')}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
