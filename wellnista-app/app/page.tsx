"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/api/supabaseClient";
import Link from "next/link";
import { useI18n } from "../i18n";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import WellnistaLogo from "./components/WellnistaLogo";
import LanguageSwitcher from "./components/LanguageSwitcher";
import CountryCodeSelector from "./components/CountryCodeSelector";
import { CountryCode, getDefaultCountry } from "../config/countryCodes";

interface User {
  phone?: string;
  password?: string;
}

export default function Home() {
  const { t } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(getDefaultCountry());
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formatPhoneNumber = (rawPhone: string, country: CountryCode) => {
    const cleaned = rawPhone.replace(/\D/g, "");
    // Remove leading 0 for Thailand
    if (country.code === 'TH' && cleaned.startsWith('0')) {
      return country.dialCode + cleaned.slice(1);
    }
    return country.dialCode + cleaned;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user) {
        // If already authenticated, redirect to home
        router.push("/home");
        return;
      }

      setUser(null);
    };

    checkAuth();
  }, [router]);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    const formattedPhone = formatPhoneNumber(phone, selectedCountry);
    const { data, error } = await supabase.auth.signInWithPassword({
      phone: formattedPhone,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
      router.push("/home");
    }
    setLoading(false);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // Clear any local storage or session data
      localStorage.clear();
      sessionStorage.clear();
      // Force a hard refresh of the page
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6">
      {/* Header with Welcome Message */}
      <div className="mb-8 text-center">
        <Typography className="text-2xl font-bold text-primary mb-1">
          {t("auth.welcome")}
        </Typography>
        <Box className="flex justify-center mt-4">
          <WellnistaLogo />
        </Box>
        <Typography className="text-xl font-bold text-primary mt-6">
          {t("auth.wellnistaBrand")}
        </Typography>
        <Typography className="text-sm text-neutral/70 mt-2">
          {t("auth.tagline")}
        </Typography>
      </div>

      {/* Login Form */}
      <div className="max-w-sm mx-auto space-y-4">
        {user ? (
          <div className="text-center">
            <Typography className="text-xl text-center text-primary mb-4">
              {t("auth.welcomeUser", { phone: user.phone || "" })}
            </Typography>
            <Button
              variant="contained"
              onClick={signOut}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-garet rounded-full"
            >
              {t("auth.logout")}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <div className="w-36">
                <CountryCodeSelector
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                />
              </div>
              <TextField
                fullWidth
                label={t("auth.phoneNumberWithCountry")}
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white rounded"
                placeholder={t("auth.phonePlaceholder")}
              />
            </div>
            <TextField
              fullWidth
              label={t("auth.password")}
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white rounded"
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full px-6 py-3 bg-primary text-secondary rounded-full hover:bg-accent transition font-garet font-semibold"
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("auth.login")
              )}
            </button>
            {error && (
              <Typography color="error" variant="body2" className="text-center">
                {error}
              </Typography>
            )}

            <div className="flex justify-between text-sm text-neutral/70 pt-2">
              <Link href="/register/signup" passHref legacyBehavior>
                <Typography className="cursor-pointer hover:underline text-primary">
                  {t("auth.register")}
                </Typography>
              </Link>
              <Typography
                className="cursor-pointer hover:underline text-primary"
                onClick={() => {}}
              >
                {t("auth.forgotPassword")}
              </Typography>
            </div>
          </>
        )}

        {/* Language Switcher */}
        <div className="flex justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
