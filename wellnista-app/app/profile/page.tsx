"use client";
import { useState, useEffect } from "react";
import PieChart from "../components/PieChart";
import { useAuth } from "../lib/context/AuthContext";
import { supabase } from "../lib/api/supabaseClient";
import { UserData } from "../lib/types/user";
import Typography from "@mui/material/Typography";
import { UserCircle, Activity, Scale, Ruler, Heart, Clock } from "lucide-react";
import { Calendar } from "../components/Calendar";

const activitiveLevel: string[] = [
  "ไม่ออกกำลังกาย/นั่งทำงานอยู่กับที่",
  "ออกกำลังกายเล็กน้อย 1-3วัน/สัปดาห์",
  "ออกกำลังกายปานกลาง 4-5วัน/สัปดาห์",
  "ออกกำลังกายหนัก 6-7วัน/สัปดาห์",
  "ออกกำลังกายหนักมาก 2 ครั้ง/วัน เป็นนักกีฬา",
];

const activitiveLevelValue: number[] = [1.2, 1.375, 1.55, 1.725, 1.9];
const activitiveLevelProtein: number[] = [1.0, 1.0, 1.2, 1.7, 2.2];

export default function ProfilePage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [totalNutrition, setTotalNutrition] = useState({
    calories: 0,
    carbs: 0,
    protein: 0,
  });

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

  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from("food_scan_history")
        .select(
          `
          *,
          nutrition:nutrition_id (
            total_calories_kcal,
            protein_per_serving_g,
            total_carbohydrates_per_serving_g
          )
        `
        )
        .eq("user_id", user.id);

      if (data) {
        // Calculate total nutrition only datetime today
        const today = new Date();
        const todayData = data.filter((item) => {
          const itemDate = new Date(item.scanned_at);
          return itemDate.toDateString() === today.toDateString();
        });
        console.log(todayData);
        const totals = todayData.reduce(
          (acc, item) => ({
            calories:
              acc.calories + (Number(item.nutrition?.total_calories_kcal) || 0),
            protein:
              acc.protein +
              (Number(item.nutrition?.protein_per_serving_g) || 0),
            carbs: acc.carbs + (Number(item.nutrition?.total_carbohydrates_per_serving_g) || 0),
          }),
          { calories: 0, protein: 0, carbs: 0 }
        );
        setTotalNutrition(totals);
      }
    };
    fetchHistoryData();
  }, [user]);

  const teddMan =
    (66 + 13.7 * (userData?.weight ?? 0) + 5 * (userData?.height ?? 0) - 6.8) *
    activitiveLevelValue[
      activitiveLevel.indexOf(userData?.activityLevel ?? "")
    ];

  const teddWoman =
    (655 +
      9.6 * (userData?.weight ?? 0) +
      1.8 * (userData?.height ?? 0) -
      4.7) *
    activitiveLevelValue[
      activitiveLevel.indexOf(userData?.activityLevel ?? "")
    ];

  // value only today
  const carbValue = totalNutrition.carbs / 15;
  const carbGoal = (userData?.gender === "ชาย" ? teddMan * 0.2 : teddWoman * 0.2) / 15;

  const calValue = totalNutrition.calories;
  const calGoal = userData?.gender === "ชาย" ? teddMan : teddWoman;

  const proteinValue = totalNutrition.protein;
  const proteinGoal = (userData?.weight ?? 0) * activitiveLevelProtein[activitiveLevel.indexOf(userData?.activityLevel ?? "")];

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
              {carbValue.toFixed(0)}/{carbGoal.toFixed(0)} คาร์บ
            </Typography>
            <Typography className="text-xs text-neutral/70">
              คาร์บ
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
              {calValue}/{calGoal.toFixed(0)} กิโลแคลอรี่
            </Typography>
            <Typography className="text-xs text-neutral/70">แคลอรี่</Typography>
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
              {proteinValue}/{proteinGoal} กรัม
            </Typography>
            <Typography className="text-xs text-neutral/70">โปรตีน</Typography>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
        <Typography className="text-lg font-semibold text-primary mb-6">
          ปฏิทินการกิน
        </Typography>
        <Calendar 
          calGoal={calGoal}
          carbGoal={carbGoal}
          proteinGoal={proteinGoal}
          todayNutrition={{
            calories: totalNutrition.calories,
            carbs: totalNutrition.carbs,
            protein: totalNutrition.protein
          }}
        />
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
