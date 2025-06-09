"use client";
import { useState, useEffect } from "react";
import PieChart from "../components/PieChart";
import { useAuth } from "../lib/context/AuthContext";
import { supabase } from "../lib/api/supabaseClient";
import { UserData } from "../lib/types/user";
import Typography from "@mui/material/Typography";
import { UserCircle, Activity, Scale, Ruler, Heart, Clock } from "lucide-react";

export default function ProfilePage() {
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
  const proteinValue = 100;
  const proteinGoal = 120;
  const bmi = 22.5;

  const infoItems = [
    {
      icon: <UserCircle size={24} />,
      label: "ชื่อ - นามสกุล",
      value: userData?.name || "-",
    },
    {
      icon: <Heart size={24} />,
      label: "โรคประจำตัว",
      value: userData?.diseases?.join(", ") || "-",
    },
    {
      icon: <Activity size={24} />,
      label: "เพศ",
      value: userData?.gender || "-",
    },
    {
      icon: <Clock size={24} />,
      label: "อายุ",
      value: `${userData?.age || "-"} ปี`,
    },
    {
      icon: <Scale size={24} />,
      label: "น้ำหนัก",
      value: `${userData?.weight || "-"} กิโลกรัม`,
    },
    {
      icon: <Ruler size={24} />,
      label: "ส่วนสูง",
      value: `${userData?.height || "-"} เซนติเมตร`,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6">
      {/* Nutrition Progress */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
        <Typography className="text-lg font-semibold text-primary mb-6">
          ความคืบหน้าวันนี้
        </Typography>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center bg-secondary/5 rounded-xl p-4">
            <PieChart
              value={carbValue}
              goal={carbGoal}
              color="#9F9260"
              label=""
              size={100}
            />
            <Typography className="text-sm font-semibold text-primary mt-3">
              {carbValue}/{carbGoal}
            </Typography>
            <Typography className="text-xs text-neutral/70">
              คาร์โบไฮเดรต
            </Typography>
          </div>
          <div className="flex flex-col items-center bg-secondary/5 rounded-xl p-4">
            <PieChart
              value={calValue}
              goal={calGoal}
              color="#5EC269"
              label=""
              size={100}
            />
            <Typography className="text-sm font-semibold text-primary mt-3">
              {calValue}/{calGoal}
            </Typography>
            <Typography className="text-xs text-neutral/70">
              แคลอรี่
            </Typography>
          </div>
          <div className="flex flex-col items-center bg-secondary/5 rounded-xl p-4">
            <PieChart
              value={proteinValue}
              goal={proteinGoal}
              color="#3776A1"
              label=""
              size={100}
            />
            <Typography className="text-sm font-semibold text-primary mt-3">
              {proteinValue}/{proteinGoal}
            </Typography>
            <Typography className="text-xs text-neutral/70">
              โปรตีน
            </Typography>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
        <Typography className="text-lg font-semibold text-primary mb-4">
          ข้อมูลส่วนตัว
        </Typography>
        <div className="space-y-4">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-primary">{item.icon}</div>
                <Typography className="text-neutral/70">
                  {item.label}
                </Typography>
              </div>
              <Typography className="font-semibold">{item.value}</Typography>
            </div>
          ))}
        </div>
      </div>

      {/* Health Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Typography className="text-sm text-neutral/70 mb-2">BMI</Typography>
          <Typography className="text-2xl font-bold text-primary">
            {bmi}
          </Typography>
          <Typography className="text-xs text-neutral/70 mt-1">
            ดัชนีมวลกาย
          </Typography>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Typography className="text-sm text-neutral/70 mb-2">
            ระดับกิจกรรม
          </Typography>
          <Typography className="text-2xl font-bold text-primary">
            {userData?.activityLevel || "-"}
          </Typography>
          <Typography className="text-xs text-neutral/70 mt-1">
            กิจกรรมประจำวัน
          </Typography>
        </div>
      </div>
    </div>
  );
}
