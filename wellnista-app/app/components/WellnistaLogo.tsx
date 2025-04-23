import { Typography } from '@mui/material';



interface WellnistaLogoProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

export default function WellnistaLogo({ variant = 'h4', className = '' }: WellnistaLogoProps) {
  return (
    <Typography
      variant={variant}
      sx={{
        fontFamily: 'Leckerli One, cursive',
        fontWeight: 'bold',
        textAlign: 'center'
      }}
      className={className}
    >
      Wellnista
    </Typography>
  );
} 