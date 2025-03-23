import { Box } from '@mui/material';

interface LegendItemProps {
  color: string;
  text: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, text }) => (
  <Box className="flex items-center space-x-2">
    <Box className={`w-4 h-4 rounded-full ${color}`}></Box>
    <p className="text-sm text-neutral">{text}</p>
  </Box>
);

const IntroductionStatus: React.FC = () => {
  const items: LegendItemProps[] = [
    { color: 'bg-green-500', text: 'ปลอดภัย อยู่ในช่วงค่าเเนะนำ' },
    { color: 'bg-yellow-400', text: 'เกินค่าแนะนำ“เล็กน้อย”' },
    { color: 'bg-red-500', text: 'เกินค่าแนะนำ“มาก”' },
  ];

  return (
    <Box className="grid grid-rows-3 grid-flow-col gap-4 mb-6">
      {items.map((item, idx) => (
        <LegendItem key={idx} color={item.color} text={item.text} />
      ))}
    </Box>
  );
};

export default IntroductionStatus;
