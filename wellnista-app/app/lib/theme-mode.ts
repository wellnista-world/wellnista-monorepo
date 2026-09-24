// Theme mode: what the user chose (dark / light / follow the system) and what
// actually gets applied. Pure helpers so the provider, the head bootstrap
// script and the tests agree.

export type ThemePreference = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'wellnista-theme';
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'dark';

export const THEME_COLORS: Record<ResolvedTheme, string> = {
  dark: '#0a0e0b',
  light: '#f6f8f3',
};

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'dark' || value === 'light' || value === 'system';
}

// Stored value → preference, falling back to the default for anything odd.
export function parseThemePreference(stored: string | null | undefined): ThemePreference {
  return isThemePreference(stored) ? stored : DEFAULT_THEME_PREFERENCE;
}

// Preference → the theme to paint. `system` follows the OS setting.
export function resolveTheme(preference: ThemePreference, prefersDark: boolean): ResolvedTheme {
  if (preference === 'system') return prefersDark ? 'dark' : 'light';
  return preference;
}

// Inline script for <head>: applies the stored theme before first paint so a
// light-mode user never sees a dark flash (and vice versa). Mirrors the
// helpers above; keep them in sync.
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var p=(s==='dark'||s==='light'||s==='system')?s:'${DEFAULT_THEME_PREFERENCE}';var d=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var t=p==='system'?(d?'dark':'light'):p;document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;
