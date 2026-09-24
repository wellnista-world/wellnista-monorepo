import { describe, it, expect } from "vitest";
import {
  DEFAULT_THEME_PREFERENCE,
  THEME_BOOTSTRAP_SCRIPT,
  THEME_STORAGE_KEY,
  isThemePreference,
  parseThemePreference,
  resolveTheme,
} from "../theme-mode";

describe("theme preference parsing", () => {
  it("accepts the three known values", () => {
    expect(parseThemePreference("dark")).toBe("dark");
    expect(parseThemePreference("light")).toBe("light");
    expect(parseThemePreference("system")).toBe("system");
  });

  it("falls back to the default for anything else", () => {
    expect(parseThemePreference(null)).toBe(DEFAULT_THEME_PREFERENCE);
    expect(parseThemePreference("")).toBe(DEFAULT_THEME_PREFERENCE);
    expect(parseThemePreference("blue")).toBe(DEFAULT_THEME_PREFERENCE);
    expect(isThemePreference("blue")).toBe(false);
  });
});

describe("resolveTheme", () => {
  it("returns explicit choices unchanged", () => {
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("follows the OS for system", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});

describe("bootstrap script", () => {
  function run(stored: string | null, prefersDark: boolean): string | null {
    localStorage.clear();
    if (stored !== null) localStorage.setItem(THEME_STORAGE_KEY, stored);
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({ matches: prefersDark && query.includes("dark") })) as never;
    document.documentElement.removeAttribute("data-theme");
    try {
      // eslint-disable-next-line no-new-func
      new Function(THEME_BOOTSTRAP_SCRIPT)();
    } finally {
      window.matchMedia = original;
    }
    return document.documentElement.getAttribute("data-theme");
  }

  it("applies the stored theme before paint and mirrors resolveTheme", () => {
    expect(run("light", true)).toBe("light");
    expect(run("dark", false)).toBe("dark");
    expect(run("system", true)).toBe("dark");
    expect(run("system", false)).toBe("light");
    expect(run(null, false)).toBe(resolveTheme(DEFAULT_THEME_PREFERENCE, false));
    expect(run("garbage", true)).toBe(resolveTheme(DEFAULT_THEME_PREFERENCE, true));
  });
});
