'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/api/supabaseClient';
import Link from 'next/link';

export default function HomeScreen() {
  const [displayName, setDisplayName] = useState('...');

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) return;

      // ดึงข้อมูลจาก table users โดยใช้ user.id
      const { data: profile } = await supabase
        .from('users')
        .select('name')
        .eq('user_id', user.id)
        .single();

      if (profile?.name) {
        setDisplayName(profile.name);
      } else {
        // fallback เป็นเบอร์โทร
        setDisplayName(user.phone ?? '...');
      }
    };

    fetchUserName();
  }, []);

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6 flex flex-col items-center">
      {/* Welcome Button */}
      <button className="w-full max-w-xs bg-primary text-secondary text-xl font-bold rounded-full px-6 py-3 mb-6 shadow-md">
        สวัสดี คุณ {displayName}
      </button>

      {/* Main Action Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
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

      {/* Market Info */}
      <div className="w-full max-w-xs mt-8 bg-muted px-6 py-4 rounded-xl text-center text-base font-semibold text-neutral shadow-sm">
        อาหารเฉพาะโรคเพื่อคนที่คุณรัก<br />
        <span className="italic text-accent">Wellnista market</span>
      </div>

      {/* Library Section */}
      <div className="w-full max-w-xs mt-6 bg-white border-2 border-primary px-6 py-4 rounded-xl text-center text-primary font-magnolia text-xl shadow-sm">
        Wellnista Library
      </div>

      {/* Footer Note */}
      <div className="w-full max-w-xs mt-6 text-center text-sm text-neutral leading-relaxed">
        การบันทคารบ้าง่ายกว่าที่คิด<br />
        ช่วยป้องกันโรคไม่ติดต่อเรื้อรัง
      </div>
    </div>
  );
}
