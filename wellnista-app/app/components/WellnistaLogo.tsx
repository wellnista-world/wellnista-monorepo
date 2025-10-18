import { Typography } from '@mui/material';
import { getAppName } from '../../config/app';

interface AppLogoProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

export default function AppLogo({ variant = 'h4', className = '' }: AppLogoProps) {
  return (
    <Typography
      variant={variant}
      className={`leckerli-one-regular text-center ${className}`}
    >
      {getAppName()}
    </Typography>
  );
} 