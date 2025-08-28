'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ResponsiveContainer, TooltipProps } from 'recharts';
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useI18n } from '../../../i18n';

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

interface BmiGraphProps {
  data: BmiRecord[];
  title: string;
  dataKey: 'bmi' | 'weight' | 'waist';
  normalMin?: number;
  normalMax?: number;
  maxY?: number;
  onUpdate?: (oldData: BmiRecord, newData: BmiRecord) => Promise<void>;
}

const formatDateToThai = (dateStr: string | undefined) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  const thaiYear = parseInt(year) + 543;
  return `${day}/${month}/${thaiYear}`;
};

interface CustomTooltipProps extends TooltipProps<number, string> {
  onEdit: (data: BmiRecord) => void;
  dataKey: string;
}

const CustomTooltip = ({ active, payload, label, dataKey }: CustomTooltipProps) => {
  const { t } = useI18n();
  if (active && payload && payload.length) {
    const data = payload[0].payload as BmiRecord;
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow">
        <p className="font-bold">{t('bmi.date')} {formatDateToThai(label)}</p>
        <p className="text-primary">{t('bmi.time')}: {data.time}</p>
        <p className="text-primary">
          {dataKey === 'bmi' ? t('bmi.bmi') : dataKey === 'weight' ? t('bmi.weight') : t('bmi.waist')}: {payload[0].value}
          {dataKey === 'bmi' ? '' : dataKey === 'weight' ? ` ${t('bmi.unitKg')}` : ` ${t('bmi.unitCm')}`}
        </p>
        {dataKey === 'bmi' && data.bmi_category && (
          <p className="text-neutral">{t('bmi.category')}: {t(`bmi.${data.bmi_category}`)}</p>
        )}
      </div>
    );
  }
  return null;
};

const CustomDot = (props: {
  cx?: number;
  cy?: number;
  payload?: BmiRecord;
  onClick?: (data: BmiRecord) => void;
}) => {
  const { cx, cy, payload, onClick } = props;
  if (!cx || !cy || !payload || !onClick) return null;
  return (
    <g onClick={() => onClick(payload)} style={{ cursor: 'pointer' }}>
      <circle
        cx={cx}
        cy={cy}
        r={12}
        fill="transparent"
      />
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#fff"
        stroke="#8884d8"
        strokeWidth={2}
      />
    </g>
  );
};

export default function BmiChart({ data: initialData, title, dataKey, normalMin, normalMax, maxY, onUpdate }: BmiGraphProps) {
  const { t } = useI18n();
  const [selectedData, setSelectedData] = useState<BmiRecord | null>(null);
  const [editData, setEditData] = useState<BmiRecord | null>(null);
  const [open, setOpen] = useState(false);
  const [graphData, setGraphData] = useState<BmiRecord[]>(initialData);

  useEffect(() => {
    setGraphData(initialData);
  }, [initialData]);

  const handleEdit = (data: BmiRecord) => {
    setSelectedData(data);
    setEditData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedData(null);
    setEditData(null);
  };

  const handleSubmit = () => {
    if (editData && selectedData && onUpdate) {
      const dataToUpdate = {
        ...editData,
        weight: editData.weight ?? null,
        height: editData.height ?? null,
        waist: editData.waist ?? null,
        bmi: editData.bmi ?? null
      };
      onUpdate(selectedData, dataToUpdate).then(() => {
        const updatedData = graphData.map(item =>
          item.id === selectedData.id
            ? dataToUpdate
            : item
        );
        setGraphData(updatedData);
      });
    }
    handleClose();
  };

//   const getDataKeyLabel = () => {
//     switch (dataKey) {
//       case 'bmi': return t('bmi.bmi');
//       case 'weight': return t('bmi.weight');
//       case 'waist': return t('bmi.waist');
//       default: return dataKey;
//     }
//   };

//   const getDataKeyUnit = () => {
//     switch (dataKey) {
//       case 'bmi': return '';
//       case 'weight': return ' kg';
//       case 'waist': return ' cm';
//       default: return '';
//     }
//   };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-6">
      <h3 className="text-center font-bold text-xl text-primary mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }}
            height={50}
          />
          <YAxis 
            domain={[0, maxY || 'dataMax']}
            tick={{ fontSize: 10 }}
            width={45}
          />
          <Tooltip 
            content={<CustomTooltip onEdit={handleEdit} dataKey={dataKey} />}
            wrapperStyle={{ fontSize: '14px' }}
          />
          {normalMin !== undefined && normalMax !== undefined && (
            <>
              <ReferenceArea y1={0} y2={normalMin} fill="red" fillOpacity={0.2} />
              <ReferenceArea y1={normalMin} y2={normalMax} fill="green" fillOpacity={0.2} />
              <ReferenceArea y1={normalMax} y2={maxY || 50} fill="red" fillOpacity={0.2} />
            </>
          )}
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke="#393939" 
            strokeWidth={2} 
            dot={<CustomDot onClick={handleEdit} />}
          />
        </LineChart>
      </ResponsiveContainer>

      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: '1rem',
            padding: '1rem',
          }
        }}
      >
        <DialogTitle className="text-center font-bold text-xl text-primary font-magnolia">
          {t('bmi.editData')}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <TextField
              fullWidth
              label={t('bmi.time')}
              value={editData?.time ?? ''}
              disabled
              className="bg-white"
              InputProps={{
                style: {
                  borderRadius: '0.5rem',
                }
              }}
            />
            <TextField
              fullWidth
              label={t('bmi.weight')}
              type="number"
              value={editData?.weight !== undefined && editData?.weight !== null ? editData.weight : ''}
              onChange={(e) => setEditData({ ...editData!, weight: Number(e.target.value) })}
              className="bg-white"
              InputProps={{
                style: {
                  borderRadius: '0.5rem',
                }
              }}
            />
            <TextField
              fullWidth
              label={t('bmi.height')}
              type="number"
              value={editData?.height !== undefined && editData?.height !== null ? editData.height : ''}
              onChange={(e) => setEditData({ ...editData!, height: Number(e.target.value) })}
              className="bg-white"
              InputProps={{
                style: {
                  borderRadius: '0.5rem',
                }
              }}
            />
            <TextField
              fullWidth
              label={t('bmi.waist')}
              type="number"
              value={editData?.waist !== undefined && editData?.waist !== null ? editData.waist : ''}
              onChange={(e) => setEditData({ ...editData!, waist: Number(e.target.value) })}
              className="bg-white"
              InputProps={{
                style: {
                  borderRadius: '0.5rem',
                }
              }}
            />
          </div>
        </DialogContent>
        <DialogActions className="gap-4 p-4">
          <Button 
            onClick={handleClose}
            className="!text-primary !border-primary !border-2 hover:!bg-primary/10"
            variant="outlined"
          >
            {t('bmi.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            className="!bg-primary hover:!bg-accent !text-white font-garet text-xl rounded-full"
          >
            {t('bmi.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
