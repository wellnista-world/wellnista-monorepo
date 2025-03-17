import Link from "next/link";
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/api/supabaseClient';



export default function HomeScreen() {

  return (
    <div className="flex flex-col items-center justify-center bg-secondary text-neutral font-garet text-center">
      <h1 className="text-4xl font-magnolia text-primary mb-6">ยินดีต้อนรับเข้าสู่ Wellnista</h1>
      <p className="mb-8 text-lg font-semibold text-neutral">
        Choose your action below to get started.
      </p>
      <div className="flex flex-col gap-4">
        {/* ปุ่มเด่น */}
        <Link href="/scan">
          <button className="px-6 py-3 bg-primary text-secondary font-bold rounded-full hover:bg-accent transition">
            ตรวจสอบโภชนาการอาหารจาก บาร์โค๊ด
          </button>
        </Link>
        {/* ปุ่ม Outline */}
        <Link href="/menu">
          <button className="px-6 py-3 border-2 border-accent text-accent font-semibold rounded-full hover:bg-accent hover:text-secondary transition">
            ตรวจสอบโภชนาการอาหารจานเดียว
          </button>
        </Link>
      </div>
    </div>
  );
}
