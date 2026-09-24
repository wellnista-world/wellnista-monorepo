"use client";

import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "../../i18n";
import { useAuth } from "../lib/context/AuthContext";
import { Home, Heart, Sparkles, BookOpen, UserCircle } from "lucide-react";

interface TabItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

// Floating dark bar with the AI scan action raised in the middle.
export default function TabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAuth();

  // Don't show tab bar on auth pages or if user is not authenticated
  const hideTabBar =
    !user ||
    pathname === "/" ||
    pathname === "/register" ||
    pathname.startsWith("/register/") ||
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/");

  if (hideTabBar) {
    return null;
  }

  const left: TabItem[] = [
    { icon: <Home size={22} />, label: t("navigation.home"), href: "/home" },
    { icon: <Heart size={22} />, label: t("navigation.menu"), href: "/menu" },
  ];
  const right: TabItem[] = [
    { icon: <BookOpen size={22} />, label: t("navigation.book"), href: "/book" },
    { icon: <UserCircle size={22} />, label: t("navigation.profile"), href: "/profile" },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const scanActive =
    pathname === "/select" || pathname === "/scan" || pathname.startsWith("/scan/");

  const renderItem = (item: TabItem) => {
    const active = isActive(item.href);
    return (
      <button
        key={item.href}
        onClick={() => router.push(item.href)}
        className={`flex flex-col items-center justify-center flex-1 gap-1 py-2 min-w-0 transition-colors ${
          active ? "text-lime" : "text-ink-muted hover:text-ink"
        }`}
        aria-current={active ? "page" : undefined}
      >
        {item.icon}
        <span className="text-[10px] font-medium leading-none">{item.label}</span>
        <span className={`h-1 w-1 rounded-full ${active ? "bg-lime" : "bg-transparent"}`} />
      </button>
    );
  };

  return (
    <>
      {/* Reserve space under the content for the floating bar */}
      <div className="h-28" />
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-md wa-card flex items-end px-2 py-1.5 backdrop-blur-md bg-surface/95">
          {left.map(renderItem)}

          <button
            onClick={() => router.push("/select")}
            className="flex-1 flex flex-col items-center -mt-7"
            aria-label={t("navigation.scan")}
            aria-current={scanActive ? "page" : undefined}
          >
            <span
              className={`wa-gradient flex h-14 w-14 items-center justify-center rounded-full shadow-[0_10px_24px_rgba(205,245,101,0.35)] ring-4 ring-bg transition-transform ${
                scanActive ? "scale-105" : ""
              }`}
            >
              <Sparkles size={24} />
            </span>
            <span className={`mt-1 text-[10px] font-medium leading-none ${scanActive ? "text-lime" : "text-ink-muted"}`}>
              {t("navigation.scan")}
            </span>
            <span className={`mt-1 h-1 w-1 rounded-full ${scanActive ? "bg-lime" : "bg-transparent"}`} />
          </button>

          {right.map(renderItem)}
        </div>
      </nav>
    </>
  );
}
