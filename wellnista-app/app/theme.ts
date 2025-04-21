import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#9F9260',
    },
    secondary: {
      main: '#FFF4D2',
    },
  },
  typography: {
    fontFamily: 'Kanit, sans-serif',
  },
};

const theme = createTheme(themeOptions);

export default theme; 