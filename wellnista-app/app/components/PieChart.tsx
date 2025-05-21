type PieChartProps = {
  value: number;
  goal: number;
  color: string;
  label: string;
  size?: number;
};

export default function PieChart({ value, goal, color, label, size = 90 }: PieChartProps) {
  const percentage = Math.min((value / goal) * 100, 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox="0 0 90 90" className="mb-2">
      <circle
        cx="45"
        cy="45"
        r={radius}
        fill="none"
        stroke="#eee"
        strokeWidth="12"
      />
      <circle
        cx="45"
        cy="45"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.3em"
        fontSize="1.1em"
        fontWeight="bold"
        fill={color}
      >
        {Math.round(percentage)}%
      </text>
      <text
        x="50%"
        y="70%"
        textAnchor="middle"
        fontSize="0.8em"
        fill="#333"
      >
        {label}
      </text>
    </svg>
  );
} 