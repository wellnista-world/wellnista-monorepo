interface IndicatorRowProps {
  label: string;
  value: number;
  unit?: string;
  thresholds: [number, number]; // [greenMax, yellowMax]
}

// Three-level traffic light for one nutrient (sugar / sodium / fat).
const IndicatorRow: React.FC<IndicatorRowProps> = ({ label, value, unit, thresholds }) => {
  const [greenMax, yellowMax] = thresholds;
  const level = value <= greenMax ? 1 : value <= yellowMax ? 2 : 3;

  const styles: Record<number, string> = {
    1: "bg-mint text-bg",
    2: "bg-warn text-bg",
    3: "bg-danger text-bg",
  };

  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-ink-muted">
          {value}
          {unit ? ` ${unit}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-opacity ${
              n === level ? `${styles[n]} ring-4 ring-white/10` : "bg-surface-2 text-ink-muted opacity-60"
            }`}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
};

export default IndicatorRow;
