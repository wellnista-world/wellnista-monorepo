import { useI18n } from '../../../i18n';

interface LegendItemProps {
  color: string;
  text: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, text }) => (
  <div className="flex items-center gap-2">
    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`} />
    <p className="text-xs text-ink-muted">{text}</p>
  </div>
);

// Legend for the 1 / 2 / 3 traffic-light indicators.
const IntroductionStatus: React.FC = () => {
  const { t } = useI18n();

  const items: LegendItemProps[] = [
    { color: 'bg-mint', text: t('introductionStatus.safe') },
    { color: 'bg-warn', text: t('introductionStatus.moderate') },
    { color: 'bg-danger', text: t('introductionStatus.high') },
  ];

  return (
    <div className="mb-4 flex flex-col gap-1.5">
      {items.map((item, idx) => (
        <LegendItem key={idx} color={item.color} text={item.text} />
      ))}
    </div>
  );
};

export default IntroductionStatus;
