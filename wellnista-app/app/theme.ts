import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import type { ResolvedTheme } from './lib/theme-mode';

// MUI side of the Wellnista AI design tokens. Values mirror the @theme block
// (dark) and the [data-theme="light"] overrides in app/globals.css.
const palettes: Record<ResolvedTheme, ThemeOptions['palette']> = {
  dark: {
    mode: 'dark',
    primary: { main: '#cdf565', contrastText: '#0a0e0b' },
    secondary: { main: '#7fe7b6', contrastText: '#0a0e0b' },
    error: { main: '#ff6b6b' },
    warning: { main: '#ffc857' },
    background: { default: '#0a0e0b', paper: '#151b16' },
    text: { primary: '#f1f5ee', secondary: '#9aa69c' },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  light: {
    mode: 'light',
    primary: { main: '#3f7a0b', contrastText: '#ffffff' },
    secondary: { main: '#1f8a5b', contrastText: '#ffffff' },
    error: { main: '#d94848' },
    warning: { main: '#c98a12' },
    background: { default: '#f6f8f3', paper: '#ffffff' },
    text: { primary: '#101511', secondary: '#5e6a60' },
    divider: 'rgba(10, 14, 11, 0.08)',
  },
};

const surfaces: Record<ResolvedTheme, { input: string; line: string; paper: string }> = {
  dark: { input: '#1e2721', line: 'rgba(255, 255, 255, 0.1)', paper: '#151b16' },
  light: { input: '#eef2ea', line: 'rgba(10, 14, 11, 0.12)', paper: '#ffffff' },
};

export function createAppTheme(mode: ResolvedTheme) {
  const s = surfaces[mode];
  return createTheme({
    palette: palettes[mode],
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: 'Kanit, sans-serif',
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiButton: { styleOverrides: { root: { borderRadius: 999 } } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: 14, backgroundColor: s.input },
          notchedOutline: { borderColor: s.line },
        },
      },
      MuiDialog: { styleOverrides: { paper: { backgroundColor: s.paper, borderRadius: 24 } } },
      MuiDrawer: { styleOverrides: { paper: { backgroundColor: s.paper } } },
    },
  });
}

// Default (dark) theme for code that has not moved to useThemeMode().
const theme = createAppTheme('dark');

export default theme;
