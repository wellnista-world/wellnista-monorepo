"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createAppTheme } from "../../theme";
import {
  DEFAULT_THEME_PREFERENCE,
  THEME_COLORS,
  THEME_STORAGE_KEY,
  parseThemePreference,
  resolveTheme,
  type ResolvedTheme,
  type ThemePreference,
} from "../theme-mode";

interface ThemeModeContextValue {
  /** What the user picked: dark, light, or follow the system. */
  preference: ThemePreference;
  /** What is painted right now. */
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  /** Flip between dark and light (used by the header button). */
  toggle: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

const DARK_QUERY = "(prefers-color-scheme: dark)";

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(DARK_QUERY).matches;
}

// Applies the theme to the document: the CSS tokens key off data-theme, and
// the browser chrome colour follows through the theme-color meta tag.
function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  root.style.colorScheme = resolved;
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute("content", THEME_COLORS[resolved]));
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  // Server render and first client render both use the default; the stored
  // choice is applied in the effect below (the <head> bootstrap script has
  // already painted it, so there is no visible flash).
  const [preference, setPreferenceState] = useState<ThemePreference>(DEFAULT_THEME_PREFERENCE);
  const [prefersDark, setPrefersDark] = useState(true);

  useEffect(() => {
    try {
      setPreferenceState(parseThemePreference(localStorage.getItem(THEME_STORAGE_KEY)));
    } catch {
      /* storage unavailable: keep the default */
    }
    setPrefersDark(systemPrefersDark());

    if (!window.matchMedia) return;
    const mq = window.matchMedia(DARK_QUERY);
    const onChange = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const resolved = resolveTheme(preference, prefersDark);

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setPreference(resolved === "dark" ? "light" : "dark");
  }, [resolved, setPreference]);

  const muiTheme = useMemo(() => createAppTheme(resolved), [resolved]);

  const value = useMemo(
    () => ({ preference, resolved, setPreference, toggle }),
    [preference, resolved, setPreference, toggle]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used within a ThemeModeProvider");
  return ctx;
}
