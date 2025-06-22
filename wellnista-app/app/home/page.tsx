"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/api/supabaseClient";
import { useAuth } from "../lib/context/AuthContext";
import { useI18n } from "../../i18n";
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { 
  UserCircle, 
  Camera, 
  BookOpen, 
  Store, 
  Library, 
  LogOut,
  Heart,
  ChevronRight,
  Settings
} from 'lucide-react';

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { t } = useI18n();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("name")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user name:", error);
        return;
      }

      setUserName(data.name);
    };

    fetchUserName();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
  };

  if (!user) {
    return null; // AuthProvider will handle the redirect
  }

  const menuItems = [
    {
      icon: <UserCircle size={24} />,
      label: t('navigation.profile'),
      href: "/profile",
      color: "bg-[#5EC269]"
    },
    {
      icon: <Camera size={24} />,
      label: t('home.eatThisScan'),
      href: "/select",
      color: "bg-[#9F9260]"
    },
    {
      icon: <Heart size={24} />,
      label: t('home.whatToEat'),
      href: "/menu",
      color: "bg-[#DD524C]"
    },
    {
      icon: <BookOpen size={24} />,
      label: t('home.bloodSugarLog'),
      href: "/book",
      color: "bg-[#8A7F5F]"
    }
  ];

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6">
      {/* Header with Welcome Message */}
      <div className="mb-8">
        <Typography className="text-2xl font-bold text-primary mb-1">
          {t('auth.welcomeUser').replace('{phone}', userName || '')}
        </Typography>
        <Typography className="text-sm text-neutral/70">
          {t('auth.welcomeBack')}
        </Typography>
      </div>

      {/* Main Menu Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.href}
            className="block"
          >
            <div className={`bg-white rounded-2xl p-6 h-32 flex flex-col text-primary justify-between shadow-lg hover:opacity-90 transition-all`}>
              <div className="flex justify-between items-start">
                {item.icon}
              </div>
              <Typography className="text-lg font-semibold">
                {item.label}
              </Typography>
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Services */}
      <div className="space-y-4 mb-8">
        <div 
          onClick={() => window.open('https://lin.ee/AwaT0wg', '_blank')}
          className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-sm hover:bg-primary/5 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <Store size={24} className="text-primary" />
            <div>
              <Typography className="font-semibold text-primary">
                {t('home.wellnistaMarket')}
              </Typography>
              <Typography className="text-sm text-neutral/70">
                {t('home.specializedFood')}
              </Typography>
            </div>
          </div>
          <ChevronRight size={20} className="text-primary" />
        </div>

        <div 
          onClick={() => router.push('/home/library')}
          className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-sm hover:bg-primary/5 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <Library size={24} className="text-primary" />
            <Typography className="font-semibold text-primary">
              {t('home.wellnistaLibrary')}
            </Typography>
          </div>
          <ChevronRight size={20} className="text-primary" />
        </div>

        <div 
          onClick={() => router.push('/settings')}
          className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-sm hover:bg-primary/5 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <Settings size={24} className="text-primary" />
            <Typography className="font-semibold text-primary">
              {t('navigation.settings')}
            </Typography>
          </div>
          <ChevronRight size={20} className="text-primary" />
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-neutral/70 mb-8">
        <p>{t('home.carbLogging')}</p>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-white rounded-2xl p-4 flex items-center justify-center gap-2 text-primary hover:bg-primary/5 transition-all"
      >
        <LogOut size={20} />
        <Typography className="font-semibold">
          {t('auth.logout')}
        </Typography>
      </button>
    </div>
  );
}
