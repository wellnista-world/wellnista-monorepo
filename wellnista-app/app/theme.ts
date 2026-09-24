import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

// MUI side of the Wellnista AI design tokens (see app/globals.css @theme).
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#cdf565',
      contrastText: '#0a0e0b',
    },
    secondary: {
      main: '#7fe7b6',
      contrastText: '#0a0e0b',
    },
    error: { main: '#ff6b6b' },
    warning: { main: '#ffc857' },
    background: {
      default: '#0a0e0b',
      paper: '#151b16',
    },
    text: {
      primary: '#f1f5ee',
      secondary: '#9aa69c',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Kanit, sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 14, backgroundColor: '#1e2721' },
        notchedOutline: { borderColor: 'rgba(255, 255, 255, 0.1)' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundColor: '#151b16', borderRadius: 24 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: '#151b16' },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
