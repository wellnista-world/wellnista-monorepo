"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
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
  const avatarUrl = "/avatar-placeholder.png"; // Replace with user image if available
  const carbValue = 45;
  const carbGoal = 60;
  const calValue = 1200;
  const calGoal = 2000;
  const bmi = 22.5;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setView(view === "info" ? "carb" : "info")}
          className="bg-primary text-secondary text-xl font-bold rounded-full px-6 py-3 shadow-md hover:bg-accent transition"
        >
          {view === "info" ? "นับคาร์บ" : "ข้อมูลส่วนตัว"}
        </button>
      </div>
      <div className="flex flex-col items-center mb-6">
        {/* Avatar */}
        <Image
          src={avatarUrl}
          alt="avatar"
          className="w-24 h-24 rounded-full mb-4 object-cover"
          width={96}
          height={96}
        />
      </div>
      {view === "info" ? (
        <div>
          {/* Personal info content */}
          <p>ชื่อ - นามสกุล : {userData?.name}</p>
          <p>โรคประจำตัว : {userData?.diseases.join(", ")}</p>
          <p>เพศ อายุ : {userData?.gender} {userData?.age}</p>
          <p>น้ำหนัก ส่วนสูง : {userData?.weight} {userData?.height}</p>
          <p>รอบเอว : {userData?.waist}</p>
          <p>ระดับกิจกรรม : {userData?.activityLevel}</p>
          <div className="text-xl font-bold">BMI: {bmi}</div>
        </div>
      ) : (
        <div>
        {/* Carb Pie Chart */}
        <PieChart value={carbValue} goal={carbGoal} color="#9F9260" label="Carb" />
        {/* Cal Pie Chart */}
        <PieChart value={calValue} goal={calGoal} color="#5EC269" label="Cal" />
        {/* BMI */}
        </div>
      )}
    </div>
  );
} 