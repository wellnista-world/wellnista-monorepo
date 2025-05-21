"use client";
import { useState } from "react";

export default function ProfilePage() {
  const [view, setView] = useState<"info" | "carb">("info");

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">user</h1>
        <button
          onClick={() => setView(view === "info" ? "carb" : "info")}
          className="bg-primary text-secondary text-xl font-bold rounded-full px-6 py-3 shadow-md hover:bg-accent transition"
        >
          {view === "info" ? "นับคาร์บ" : "ข้อมูลส่วนตัว"}
        </button>
      </div>
      {view === "info" ? (
        <div>
          {/* Personal info content */}
          <p>ชื่อ - นามสกุล</p>
          <p>โรคประจำตัว</p>
          <p>เพศ อายุ</p>
          <p>น้ำหนัก ส่วนสูง</p>
          <p>รอบเอว</p>
          <p>ระดับกิจกรรม</p>
        </div>
      ) : (
        <div>
          {/* Carb counting content */}
          <p>3 การ์บ...</p>
          <p>BMI: ...</p>
        </div>
      )}
    </div>
  );
} 