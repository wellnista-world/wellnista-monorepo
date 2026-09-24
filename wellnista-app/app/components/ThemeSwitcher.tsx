"use client";

import { Moon, Sun, MonitorSmartphone } from "lucide-react";
import { useI18n } from "../../i18n";
import { useThemeMode } from "../lib/context/ThemeModeContext";
import type { ThemePreference } from "../lib/theme-mode";

// Dark / Light / System segmented control (Settings page).
export default function ThemeSwitcher() {
  const { t } = useI18n();
  const { preference, setPreference } = useThemeMode();

  const options: { value: ThemePreference; label: string; icon: React.ReactNode }[] = [
    { value: "dark", label: t("settings.themeDark"), icon: <Moon size={16} /> },
    { value: "light", label: t("settings.themeLight"), icon: <Sun size={16} /> },
    { value: "system", label: t("settings.themeSystem"), icon: <MonitorSmartphone size={16} /> },
  ];

  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={t("settings.theme")}>
      {options.map((o) => {
        const active = preference === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setPreference(o.value)}
            className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-xs font-medium transition-colors ${
              active
                ? "wa-gradient border-transparent"
                : "border-line bg-surface-2 text-ink-muted hover:text-ink"
            }`}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
