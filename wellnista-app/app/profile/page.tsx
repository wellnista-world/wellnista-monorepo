"use client";
import { useState, useEffect } from "react";
import PieChart from "../components/PieChart";
import { useAuth } from "../lib/context/AuthContext";
import { supabase } from "../lib/api/supabaseClient";
import { UserData } from "../lib/types/user";

export default function ProfilePage() {
  const [view, setView] = useState<"info" | "carb">("info");
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!user?.id || userData) return;
    const fetchUserData = async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setUserData(data);
    };
    fetchUserData();
  }, [user, userData]);

  // Example data (replace with real data as needed)
  const carbValue = 45;
  const carbGoal = 60;
  const calValue = 1200;
  const calGoal = 2000;
  const bmi = 22.5;

  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4 text-3xl font-bold text-secondary">
          {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView("info")}
          className={`flex-1 px-6 py-3 rounded-full font-bold text-xl shadow-md transition
            ${
              view === "info"
                ? "bg-primary text-secondary"
                : "bg-white text-primary border border-primary"
            }
          `}
        >
          ข้อมูลส่วนตัว
        </button>
        <button
          onClick={() => setView("carb")}
          className={`flex-1 px-6 py-3 rounded-full font-bold text-xl shadow-md transition
            ${
              view === "carb"
                ? "bg-primary text-secondary"
                : "bg-white text-primary border border-primary"
            }
          `}
        >
          นับคาร์บ
        </button>
      </div>
      {view === "info" ? (
        <div className="text-xl font-semibold space-y-2">
          {/* Personal info content */}
          <p>ชื่อ - นามสกุล : {userData?.name}</p>
          <p>โรคประจำตัว : {userData?.diseases.join(", ")}</p>
          <p>เพศ {userData?.gender}</p>
          <p>อายุ {userData?.age} ปี</p>
          <p>น้ำหนัก : {userData?.weight} กิโลกรัม </p>
          <p>ส่วนสูง : {userData?.height} เซนติเมตร</p>
          <p>รอบเอว : {userData?.waist}</p>
          <p>ระดับกิจกรรม : {userData?.activityLevel}</p>
          <div className="text-xl font-bold">BMI: {bmi}</div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 py-4">
          {/* Centered and bigger charts */}
          <PieChart
            value={carbValue}
            goal={carbGoal}
            color="#9F9260"
            label="Carb"
            size={180}
          />
          <PieChart
            value={calValue}
            goal={calGoal}
            color="#5EC269"
            label="Cal"
            size={180}
          />
          {/* BMI */}
        </div>
      )}
    </div>
  );
}
