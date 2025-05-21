"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/api/supabaseClient";
import { useAuth } from "../lib/context/AuthContext";
import Link from 'next/link';
import Typography from '@mui/material/Typography';


export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
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

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6 flex flex-col items-center">
      {/* Welcome Button */}
      <div className="w-full max-w-xs bg-primary text-center text-secondary text-3xl font-bold rounded-l px-6 py-3 mb-6 shadow-md">
        <Typography className="text-xl font-bold">สวัสดี คุณ</Typography> 
        {userName}
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
      <Link href="/profile">
        <button className="w-full bg-primary text-secondary text-xl font-bold rounded-full px-6 py-3 shadow-md hover:bg-accent transition">
          ไปที่โปรไฟล์
        </button>
      </Link>

        <Link href="/select">
          <button className="w-full bg-primary text-secondary text-xl font-bold rounded-full px-6 py-3 shadow-md hover:bg-accent transition">
            กินดีมั้ย ?
          </button>
        </Link>
        <Link href="/menu">
          <button className="w-full bg-primary text-secondary text-xl font-bold rounded-full px-6 py-3 shadow-md hover:bg-accent transition">
            กินอะไรดี ?
          </button>
        </Link>
        <Link href="/book">
          <button className="w-full bg-primary text-secondary text-xl font-bold rounded-full px-6 py-3 shadow-md hover:bg-accent transition">
            สมุดบันทึก<br />น้ำตาล
          </button>
        </Link>
      </div>

      {/* Market Info route to line official account */}
      {/* hover to change color like our style */}
      <div 
        onClick={() => window.open('https://lin.ee/AwaT0wg', '_blank')}
        className="w-full max-w-xs mt-6 bg-white border-2 border-primary px-6 py-4 rounded-xl text-center text-primary font-magnolia text-xl shadow-sm cursor-pointer hover:bg-primary hover:text-white transition-colors"
      >
        อาหารเฉพาะโรคเพื่อคนที่คุณรัก<br />
        <span className="italic text-accent">Wellnista market</span>
      </div>

      {/* Library Section */}
      <div 
        onClick={() => router.push('/home/library')}
        className="w-full max-w-xs mt-6 bg-white border-2 border-primary px-6 py-4 rounded-xl text-center text-primary font-magnolia text-xl shadow-sm cursor-pointer hover:bg-primary hover:text-white transition-colors"
      >
        Wellnista Library
      </div>

      {/* Footer Note */}
      <div className="w-full max-w-xs mt-6 text-center text-sm text-neutral leading-relaxed">
        การบันทึกคาร์บง่ายกว่าที่คิด<br />
        ช่วยป้องกันโรคไม่ติดต่อเรื้อรัง
      </div>

      <div className="max-w-md mx-auto p-4 mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-accent text-secondary py-2 px-4 rounded-md hover:bg-accent/90 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
