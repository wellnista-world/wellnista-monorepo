import { Box } from '@mui/material';
import { useI18n } from '../../../i18n';

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
  const { t } = useI18n();
  
  const items: LegendItemProps[] = [
    { color: 'bg-green-500', text: t('introductionStatus.safe') },
    { color: 'bg-yellow-400', text: t('introductionStatus.moderate') },
    { color: 'bg-red-500', text: t('introductionStatus.high') },
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
