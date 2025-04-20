'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ResponsiveContainer, TooltipProps } from 'recharts';
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface DtxRecord {
  date: string;
  dtx_value: number | null;
  meal: string;
  meal_phase: string;
  time: string;
}

interface DtxGraphProps {
  data: DtxRecord[];
  title: string;
  normalMin: number;
  normalMax: number;
  maxY: number;
  onUpdate?: (oldData: DtxRecord, newData: DtxRecord) => Promise<void>;
}

const mealNames = ['เช้า', 'กลางวัน', 'เย็น', 'ก่อนนอน'];
const mealTime = ['ก่อนอาหาร', 'หลังอาหาร 2 ชม.'];

const formatDateToThai = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  const thaiYear = parseInt(year) + 543;
  return `${day}/${month}/${thaiYear}`;
};

interface CustomTooltipProps extends TooltipProps<number, string> {
  onEdit: (data: DtxRecord) => void;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DtxRecord;
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow">
        <p className="font-bold">วันที่ {formatDateToThai(label)}</p>
        <p className="text-primary">เวลา: {data.time}</p>
        <p className="text-primary">ระดับน้ำตาล: {payload[0].value}</p>
        {data.meal && (
          <p className="text-neutral">มื้อ: {data.meal}</p>
        )}
      </div>
    );
  }
  return null;
};

const CustomDot = (props: {
  cx?: number;
  cy?: number;
  payload?: DtxRecord;
  onClick?: (data: DtxRecord) => void;
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

export default function DtxGraph({ data: initialData, title, normalMin, normalMax, maxY, onUpdate }: DtxGraphProps) {
  const [selectedData, setSelectedData] = useState<DtxRecord | null>(null);
  const [editData, setEditData] = useState<DtxRecord | null>(null);
  const [open, setOpen] = useState(false);
  const [graphData, setGraphData] = useState<DtxRecord[]>(initialData);

  useEffect(() => {
    setGraphData(initialData);
  }, [initialData]);

  const handleEdit = (data: DtxRecord) => {
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
        dtx_value: editData.dtx_value ?? 0
      };
      onUpdate(selectedData, dataToUpdate).then(() => {
        const updatedData = graphData.map(item => 
          item.date === selectedData.date && item.meal_phase === selectedData.meal_phase
            ? dataToUpdate
            : item
        );
        setGraphData(updatedData);
      });
    }
    handleClose();
  };

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
            domain={[0, maxY]}
            interval={0}
            tickCount={Math.ceil(maxY/20) + 1}
            ticks={Array.from({length: Math.ceil(maxY/20) + 1}, (_, i) => i * 20)}
            tick={{ fontSize: 10 }}
            width={45}
          />
          <Tooltip 
            content={<CustomTooltip onEdit={handleEdit} />}
            wrapperStyle={{ fontSize: '14px' }}
          />
          <ReferenceArea y1={0} y2={normalMin} fill="red" fillOpacity={0.2} />
          <ReferenceArea y1={normalMin} y2={normalMax} fill="green" fillOpacity={0.2} />
          <ReferenceArea y1={normalMax} y2={maxY} fill="red" fillOpacity={0.2} />
          <Line 
            type="monotone" 
            dataKey="dtx_value" 
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
          แก้ไขข้อมูล
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="เวลา"
              value={editData?.time}
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
              label="ค่า DTX"
              type="number"
              value={editData?.dtx_value ?? ''}
              onChange={(e) => setEditData({ ...editData!, dtx_value: Number(e.target.value) })}
              className="bg-white"
              InputProps={{
                style: {
                  borderRadius: '0.5rem',
                }
              }}
            />
            <FormControl fullWidth>
              <InputLabel>เลือกมื้อ</InputLabel>
              <Select
                value={editData?.meal ?? ''}
                onChange={(e) => setEditData({ ...editData!, meal: e.target.value })}
                className="bg-white"
                sx={{
                  borderRadius: '0.5rem',
                }}
              >
                {mealNames.map((meal) => (
                  <MenuItem key={meal} value={meal}>{meal}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>ก่อน/หลัง</InputLabel>
              <Select
                value={editData?.meal_phase ?? ''}
                onChange={(e) => setEditData({ ...editData!, meal_phase: e.target.value })}
                className="bg-white"
                sx={{
                  borderRadius: '0.5rem',
                }}
              >
                {mealTime.map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions className="gap-4 p-4">
          <Button 
            onClick={handleClose}
            className="!text-primary !border-primary !border-2 hover:!bg-primary/10"
            variant="outlined"
          >
            ยกเลิก
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            className="!bg-primary hover:!bg-accent !text-white font-garet text-xl rounded-full"
          >
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
