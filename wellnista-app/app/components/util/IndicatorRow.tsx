import { Box } from '@mui/material';

interface IndicatorRowProps {
  label: string;
  value: number;
  thresholds: [number, number]; // [greenMax, yellowMax]
}

const IndicatorRow: React.FC<IndicatorRowProps> = ({ label, value, thresholds }) => {
  const [greenMax, yellowMax] = thresholds;

  const getCircleClass = (circleLevel: number) => {
    switch (circleLevel) {
      case 1:
        return value <= greenMax
          ? "ring-4 ring-green-300 opacity-100"
          : "opacity-50";
      case 2:
        return value > greenMax && value <= yellowMax
          ? "ring-4 ring-yellow-300 opacity-100"
          : "opacity-50";
      case 3:
        return value > yellowMax
          ? "ring-4 ring-red-300 opacity-100"
          : "opacity-50";
      default:
        return "opacity-50";
    }
  };

  return (
    <Box className="flex flex-col space-y-2">
      <p className="text-neutral font-bold">{label}</p>
      <Box className="flex items-center justify-between">
        <Box
          className={`flex items-center justify-center rounded-full bg-green-500 w-12 h-12 text-lg text-white font-bold ${getCircleClass(1)}`}
        >
          1
        </Box>
        <Box
          className={`flex items-center justify-center rounded-full bg-yellow-400 w-12 h-12 text-lg text-white font-bold ${getCircleClass(2)}`}
        >
          2
        </Box>
        <Box
          className={`flex items-center justify-center rounded-full bg-red-500 w-12 h-12 text-lg text-white font-bold ${getCircleClass(3)}`}
        >
          3
        </Box>
      </Box>
    </Box>
  );
};

export default IndicatorRow;
