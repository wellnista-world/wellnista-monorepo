"use client";

import Link from "next/link";
import { Barcode, Camera, ChevronRight, Sparkles } from "lucide-react";
import { useI18n } from "../../i18n";

// "Log food": pick how to identify what you are about to eat.
export default function SelectScreen() {
  const { t } = useI18n();

  const options = [
    {
      icon: <Camera size={24} />,
      well: "wa-iconwell",
      label: t("menu.takePhoto"),
      sub: t("scan.aiPhotoHint"),
      href: "/scan/scan-image",
    },
    {
      icon: <Barcode size={24} />,
      well: "wa-iconwell wa-iconwell--mint",
      label: t("menu.scanBarcode"),
      sub: t("scan.barcodeHint"),
      href: "/scan",
    },
  ];

  return (
    <div className="mx-auto max-w-md pb-6">
      <div className="mb-6">
        <p className="wa-eyebrow">{t("navigation.scan")}</p>
        <h1 className="text-2xl font-semibold text-ink">{t("menu.checkNutrition")}</h1>
        <p className="mt-1 text-sm text-ink-muted">{t("menu.chooseAction")}</p>
      </div>

      <div className="space-y-3">
        {options.map((o) => (
          <Link
            key={o.href}
            href={o.href}
            className="wa-card flex items-center gap-4 p-4 transition-transform active:scale-[0.98]"
          >
            <span className={`${o.well} h-12 w-12 shrink-0`}>{o.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{o.label}</p>
              <p className="text-xs text-ink-muted">{o.sub}</p>
            </div>
            <ChevronRight size={18} className="text-ink-muted" />
          </Link>
        ))}
      </div>

      <div className="wa-gradient mt-6 flex items-start gap-3 rounded-3xl p-4">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/10">
          <Sparkles size={16} />
        </span>
        <div>
          <p className="text-sm font-semibold">{t("menu.selectMethod")}</p>
          <p className="text-xs opacity-80">{t("menu.toViewNutrition")}</p>
        </div>
      </div>
    </div>
  );
}
