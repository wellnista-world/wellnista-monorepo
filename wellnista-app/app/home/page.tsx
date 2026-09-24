"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/api/supabaseClient";
import { useAuth } from "../lib/context/AuthContext";
import { useI18n } from "../../i18n";
import {
  Camera,
  Heart,
  BookOpen,
  Activity,
  HeartPulse,
  Brain,
  Library,
  Settings,
  ShoppingBag,
  LogOut,
  ChevronRight,
  Sparkles,
  Flame,
} from "lucide-react";
import AdvertisingCarousel from "../components/AdvertisingCarousel";
import { getAdvertisingItems } from "../../config/advertising";
import DailyPopup from "../components/DailyPopup";
import { useDailyPopup } from "../hooks/useDailyPopup";
import RingGauge from "../components/ui/RingGauge";
import type { UserData } from "../lib/types/user";
import { calculateNutrition, getActivityLevelFromDescription } from "../lib/utils/nutritionCalculator";

function bmiOf(weight: number, height: number): number {
  const m = height / 100;
  return Math.round((weight / (m * m)) * 10) / 10;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, locale } = useI18n();
  const [profile, setProfile] = useState<Partial<UserData> | null>(null);
  const { showPopup, closePopup } = useDailyPopup();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("users")
        .select("name, nickname, gender, age, weight, height, activitylevel")
        .eq("user_id", user.id)
        .single();
      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }
      setProfile(data);
    };
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      const { error } = await supabase.auth.signOut();
      if (error) console.warn("Supabase logout error:", error);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  // Personal targets from the profile (same maths as the scan screen).
  const stats = useMemo(() => {
    if (!profile?.weight || !profile?.height || !profile?.age) return null;
    const nutrition = calculateNutrition({
      gender: (profile.gender || "ชาย") as "male" | "female" | "ชาย" | "หญิง",
      age: profile.age,
      weight: profile.weight,
      height: profile.height,
      activityLevel: getActivityLevelFromDescription(profile.activitylevel || ""),
    });
    if (!nutrition.isValid) return null;
    const bmi = bmiOf(profile.weight, profile.height);
    const category =
      bmi < 18.5 ? "bmiUnder" : bmi < 25 ? "bmiNormal" : bmi < 30 ? "bmiOver" : "bmiObese";
    return { nutrition, bmi, category };
  }, [profile]);

  const hour = new Date().getHours();
  const greetingKey = hour < 12 ? "home.goodMorning" : hour < 18 ? "home.goodAfternoon" : "home.goodEvening";
  const displayName = profile?.nickname || profile?.name || "";
  const initial = (displayName || user?.email || "W").trim().charAt(0).toUpperCase();

  const advertisingItems = getAdvertisingItems(locale);

  if (!user) {
    return null; // AuthProvider will handle the redirect
  }

  const quickActions = [
    {
      icon: <Camera size={22} />,
      well: "wa-iconwell",
      label: t("home.eatThisScan"),
      sub: t("menu.checkNutrition"),
      href: "/select",
    },
    {
      icon: <Heart size={22} />,
      well: "wa-iconwell wa-iconwell--mint",
      label: t("home.whatToEat"),
      sub: t("menu.diseaseSpecificFood"),
      href: "/menu",
    },
  ];

  const trackers = [
    { icon: <BookOpen size={20} />, label: t("home.bloodSugarLog"), href: "/book", tint: "text-lime" },
    { icon: <Activity size={20} />, label: t("home.bmiTracking"), href: "/bmi", tint: "text-mint" },
    { icon: <HeartPulse size={20} />, label: t("home.bloodPressureTracking"), href: "/blood-pressure", tint: "text-danger" },
    { icon: <Brain size={20} />, label: t("home.mentalHealthTracking"), href: "/mental-health", tint: "text-violet" },
  ];

  const more = [
    { icon: <ShoppingBag size={20} />, label: t("home.wellnistaMarket"), href: "/product" },
    { icon: <Library size={20} />, label: t("home.wellnistaLibrary"), href: "/home/library" },
    { icon: <Settings size={20} />, label: t("navigation.settings"), href: "/settings" },
  ];

  return (
    <div className="mx-auto max-w-md pb-6">
      {/* Greeting */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="wa-eyebrow">{t(greetingKey)}</p>
          <h1 className="text-2xl font-semibold text-ink leading-tight">
            {displayName || t("auth.welcomeBack")}
          </h1>
        </div>
        <Link
          href="/profile"
          className="wa-gradient flex h-11 w-11 items-center justify-center rounded-full text-base font-bold ring-2 ring-line"
          aria-label={t("navigation.profile")}
        >
          {initial}
        </Link>
      </div>

      {/* Daily target card */}
      {stats ? (
        <div className="wa-card mb-4 p-5">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2 text-sm text-ink-muted">
                <Flame size={16} className="text-lime" />
                {t("home.dailyTarget")}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-ink">{stats.nutrition.carbServings}</span>
                <span className="text-sm text-ink-muted">{t("home.servingsUnit")}</span>
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                {stats.nutrition.carbGrams} {t("nutrition.gramsPerDay")} · {stats.nutrition.tdee}{" "}
                {t("nutrition.kcalPerDay")}
              </p>
            </div>
            <RingGauge value={stats.bmi / 40} size={104} stroke={9}>
              <span className="text-2xl font-bold text-ink">{stats.bmi}</span>
              <span className="text-[10px] uppercase tracking-wider text-ink-muted">{t("home.bmiLabel")}</span>
            </RingGauge>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs">
            <span className="text-ink-muted">{t("profile.bmi")}</span>
            <span className={`wa-chip ${stats.category === "bmiNormal" ? "wa-chip--active" : ""}`}>
              {t(`home.${stats.category}`)}
            </span>
          </div>
        </div>
      ) : (
        <Link href="/profile/edit" className="wa-card mb-4 flex items-center gap-4 p-5">
          <span className="wa-iconwell shrink-0">
            <Flame size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">{t("home.completeProfile")}</p>
            <p className="text-xs text-ink-muted">{t("home.completeProfileDesc")}</p>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </Link>
      )}

      {/* AI tip banner */}
      <div className="wa-gradient mb-6 flex items-start gap-3 rounded-3xl p-4">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/10">
          <Sparkles size={16} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug">{t("home.tipText")}</p>
          <p className="mt-1 text-[11px] font-medium opacity-70">{t("home.tipTitle")}</p>
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="mb-3 text-base font-semibold text-ink">{t("home.quickActions")}</h2>
      <div className="mb-6 grid grid-cols-2 gap-3">
        {quickActions.map((a) => (
          <Link key={a.href} href={a.href} className="wa-card flex h-36 flex-col justify-between p-4 transition-transform active:scale-[0.98]">
            <span className={a.well}>{a.icon}</span>
            <div>
              <p className="font-semibold leading-tight text-ink">{a.label}</p>
              <p className="mt-0.5 line-clamp-2 text-[11px] text-ink-muted">{a.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Health tracking */}
      <h2 className="mb-3 text-base font-semibold text-ink">{t("home.healthTracking")}</h2>
      <div className="mb-6 grid grid-cols-2 gap-3">
        {trackers.map((item) => (
          <Link key={item.href} href={item.href} className="wa-card flex items-center gap-3 p-4 transition-transform active:scale-[0.98]">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 ${item.tint}`}>
              {item.icon}
            </span>
            <span className="text-sm font-medium leading-tight text-ink">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Promotions */}
      <h2 className="mb-3 text-base font-semibold text-ink">{t("home.promotions")}</h2>
      <div className="mb-6 overflow-hidden rounded-3xl">
        <AdvertisingCarousel items={advertisingItems} autoSlideInterval={4000} />
      </div>

      {/* More */}
      <h2 className="mb-3 text-base font-semibold text-ink">{t("home.more")}</h2>
      <div className="wa-card mb-6 divide-y divide-line">
        {more.map((item) => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
          >
            <span className="text-lime">{item.icon}</span>
            <span className="flex-1 text-sm font-medium text-ink">{item.label}</span>
            <ChevronRight size={18} className="text-ink-muted" />
          </button>
        ))}
      </div>

      <p className="mb-4 px-2 text-center text-xs text-ink-muted">{t("home.carbLogging")}</p>

      <div className="flex items-center justify-center gap-4 text-xs text-ink-muted">
        <a href="https://lin.ee/q4tHGv0" target="_blank" rel="noopener noreferrer" className="underline">
          {t("home.contactLine")}
        </a>
        <button onClick={handleLogout} className="inline-flex items-center gap-1 underline">
          <LogOut size={14} />
          {t("auth.logout")}
        </button>
      </div>

      <DailyPopup open={showPopup} onClose={closePopup} imageUrl="/promote.webp" />
    </div>
  );
}
