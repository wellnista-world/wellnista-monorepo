// components/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'garet, sans-serif',
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: 'garet, sans-serif',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'garet, sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'garet, sans-serif',
        },
      },
    },
  },
});

export default theme;
