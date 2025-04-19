'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ResponsiveContainer, TooltipProps } from 'recharts';

interface DtxRecord {
  date: string; // e.g. '2025-04-10'
  dtx_value: number;
  meal?: string; // Add meal information
}

interface DtxGraphProps {
  data: DtxRecord[];
  title: string;
  normalMin: number;
  normalMax: number;
  maxY: number;
}

const formatDateToThai = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  const thaiYear = parseInt(year) + 543;
  return `${day}/${month}/${thaiYear}`;
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow">
        <p className="font-bold">วันที่ {formatDateToThai(label)}</p>
        <p className="text-primary">ระดับน้ำตาล: {payload[0].value}</p>
        {payload[0].payload.meal && (
          <p className="text-neutral">มื้อ: {payload[0].payload.meal}</p>
        )}
      </div>
    );
  }
  return null;
};

export default function DtxGraph({ data, title, normalMin, normalMax, maxY }: DtxGraphProps) {
  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-6">
      <h3 className="text-center font-bold text-xl text-primary mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, maxY]} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceArea y1={0} y2={normalMin} fill="red" fillOpacity={0.2} />
          <ReferenceArea y1={normalMin} y2={normalMax} fill="green" fillOpacity={0.2} />
          <ReferenceArea y1={normalMax} y2={maxY} fill="red" fillOpacity={0.2} />
          <Line type="monotone" dataKey="dtx_value" stroke="#393939" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
