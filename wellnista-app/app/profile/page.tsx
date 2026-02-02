"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PieChart from "../components/PieChart";
import { useAuth } from "../lib/context/AuthContext";
import { supabase } from "../lib/api/supabaseClient";
import { UserData } from "../lib/types/user";
import Typography from "@mui/material/Typography";
import { UserCircle, Activity, Scale, Ruler, Heart, Clock, Pill, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { Calendar } from "../components/Calendar";
import { useI18n } from "../../i18n";
import { calculateNutrition, getActivityLevelFromDescription } from "../lib/utils/nutritionCalculator";

const activitiveLevel: string[] = [
  "ไม่ออกกำลังกาย/นั่งทำงานอยู่กับที่",
  "ออกกำลังกายเล็กน้อย 1-3วัน/สัปดาห์",
  "ออกกำลังกายปานกลาง 3-5วัน/สัปดาห์",
  "ออกกำลังกายหนัก 6-7วัน/สัปดาห์",
  "ออกกำลังกายหนักมาก 2 ครั้ง/วัน เป็นนักกีฬา",
];

const activitiveLevelProtein: number[] = [1.0, 1.0, 1.2, 1.7, 2.2];

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [totalNutrition, setTotalNutrition] = useState({
    calories: 0,
    carbs: 0,
    protein: 0,
  });
  const [showCalculation, setShowCalculation] = useState(false);

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
            carbs:
              acc.carbs +
              (Number(item.nutrition?.total_carbohydrates_per_serving_g) || 0),
          }),
          { calories: 0, protein: 0, carbs: 0 }
        );
        setTotalNutrition(totals);
      }
    };
    fetchHistoryData();
  }, [user]);

  // Calculate nutrition using the centralized utility
  const nutritionResult = userData
    ? calculateNutrition({
        gender: (userData.gender || 'ชาย') as 'male' | 'female' | 'ชาย' | 'หญิง',
        age: userData.age || 30,
        weight: userData.weight || 70,
        height: userData.height || 170,
        activityLevel: getActivityLevelFromDescription(userData.activitylevel || activitiveLevel[0]),
      })
    : null;

  // value only today
  const carbValue = totalNutrition.carbs / 15;

  const bmi = (userData?.weight ?? 0) / ((userData?.height ?? 0) / 100) ** 2;

  const bmiText =
    bmi > 30
      ? t('profile.bmiCategories.obese2')
      : bmi > 25
      ? t('profile.bmiCategories.obese1')
      : bmi > 23
      ? t('profile.bmiCategories.overweight')
      : bmi > 18.5
      ? t('profile.bmiCategories.normal')
      : t('profile.bmiCategories.underweight');

  const carbGoal = nutritionResult?.carbServings ?? 0;
  const calGoal = nutritionResult?.tdee ?? 0;
  const calValue = totalNutrition.calories;

  const proteinValue = totalNutrition.protein;
  const proteinGoal =
    (userData?.weight ?? 0) *
    activitiveLevelProtein[
      activitiveLevel.indexOf(userData?.activitylevel ?? "")
    ];

  const infoItems = [
    {
      icon: <UserCircle size={24} />,
      label: t('profile.name'),
      value: userData?.name || "-",
    },
    {
      icon: <Heart size={24} />,
      label: t('profile.diseases'),
      value: userData?.diseases?.join(", ") || "-",
    },
    {
      icon: <Activity size={24} />,
      label: t('profile.gender'),
      value: userData?.gender || "-",
    },
    {
      icon: <Clock size={24} />,
      label: t('profile.age'),
      value: `${userData?.age || "-"} ${t('profile.years')}`,
    },
    {
      icon: <Scale size={24} />,
      label: t('profile.weight'),
      value: `${userData?.weight || "-"} ${t('profile.kg')}`,
    },
    {
      icon: <Ruler size={24} />,
      label: t('profile.height'),
      value: `${userData?.height || "-"} ${t('profile.cm')}`,
    },
    {
      icon: <Pill size={24} />,
      label: t('profile.medicines'),
      value: userData?.medicines || "-",
    },
    {
      icon: <UserCircle size={24} />,
      label: t('profile.nationalId'),
      value: userData?.national_id || "-",
    },
    {
      icon: <UserCircle size={24} />,
      label: t('profile.address'),
      value: userData?.address || "-",
    },
    {
      icon: <Heart size={24} />,
      label: t('profile.familyMedicalHistory'),
      value: userData?.family_medical_history?.join(", ") || "-",
    },
    {
      icon: <Activity size={24} />,
      label: t('profile.personalCarbValue'),
      value: userData?.personal_carb_value ? `${userData.personal_carb_value}` : "-",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6">
      {/* Nutrition Progress */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
        <Typography className="text-lg font-semibold text-primary mb-6">
          {t('profile.todayProgress')}
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
              {carbValue.toFixed(0)}/{carbGoal.toFixed(0)} {t('profile.carb')}
            </Typography>
            <Typography className="text-xs text-neutral/70">{t('profile.carb')}</Typography>
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
              {calValue}/{calGoal.toFixed(0)} {t('profile.kilocalories')}
            </Typography>
            <Typography className="text-xs text-neutral/70">{t('profile.calories')}</Typography>
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
              {proteinValue.toFixed(0)}/{proteinGoal.toFixed(0)} {t('profile.grams')}
            </Typography>
            <Typography className="text-xs text-neutral/70">{t('profile.protein')}</Typography>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
        <Typography className="text-lg font-semibold text-primary mb-6">
          {t('profile.eatingCalendar')}
        </Typography>
        <Calendar
          calGoal={calGoal}
          carbGoal={carbGoal}
          proteinGoal={proteinGoal}
          todayNutrition={{
            calories: totalNutrition.calories,
            carbs: totalNutrition.carbs,
            protein: totalNutrition.protein,
          }}
        />
      </div>

      {/* Nutrition Calculation Breakdown */}
      {nutritionResult && nutritionResult.isValid && (
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <button
            onClick={() => setShowCalculation(!showCalculation)}
            className="w-full flex items-center justify-between mb-4"
          >
            <Typography className="text-lg font-semibold text-primary">
              {t('nutrition.calculationBreakdown')}
            </Typography>
            {showCalculation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showCalculation && (
            <div className="space-y-4 pt-4 border-t border-neutral/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/5 rounded-xl p-4">
                  <Typography className="text-xs text-neutral/70 mb-1">
                    {t('nutrition.bmr')}
                  </Typography>
                  <Typography className="text-xl font-bold text-primary">
                    {nutritionResult.bmr.toLocaleString()}
                  </Typography>
                  <Typography className="text-xs text-neutral/70">
                    {t('nutrition.kcalPerDay')}
                  </Typography>
                </div>

                <div className="bg-secondary/5 rounded-xl p-4">
                  <Typography className="text-xs text-neutral/70 mb-1">
                    {t('nutrition.tdee')}
                  </Typography>
                  <Typography className="text-xl font-bold text-primary">
                    {nutritionResult.tdee.toLocaleString()}
                  </Typography>
                  <Typography className="text-xs text-neutral/70">
                    {t('nutrition.kcalPerDay')}
                  </Typography>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4">
                <Typography className="text-xs text-neutral/70 mb-2">
                  {t('nutrition.carbRatio')}
                </Typography>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Typography className="text-sm text-neutral/70">
                      {t('nutrition.carbKcal')}
                    </Typography>
                    <Typography className="font-semibold">
                      {nutritionResult.carbKcal.toLocaleString()} {t('profile.kilocalories')}
                    </Typography>
                  </div>

                  <div className="flex justify-between items-center">
                    <Typography className="text-sm text-neutral/70">
                      {t('nutrition.carbGrams')}
                    </Typography>
                    <Typography className="font-semibold">
                      {nutritionResult.carbGrams.toLocaleString()} {t('profile.grams')}
                    </Typography>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-neutral/10">
                    <Typography className="text-sm font-semibold text-primary">
                      {t('nutrition.carbServings')}
                    </Typography>
                    <Typography className="text-lg font-bold text-primary">
                      {nutritionResult.carbServings.toFixed(1)} {t('profile.carb')}
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-neutral/60">
                <Typography className="italic">
                  {t('nutrition.disclaimer')}
                </Typography>
                <Typography className="italic">
                  {t('nutrition.assumptions')}
                </Typography>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Typography className="text-lg font-semibold text-primary">
            {t('profile.personalInfo')}
          </Typography>
          <button
            onClick={() => router.push('/profile/edit')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-secondary rounded-full hover:bg-accent transition"
          >
            <Edit size={16} />
            <span className="text-sm font-medium">{t('profile.editProfile')}</span>
          </button>
        </div>
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
          <Typography className="text-sm text-neutral/70 mb-2">{t('profile.bmi')}</Typography>
          <Typography className="text-2xl font-bold text-primary">
            {bmi.toFixed(1)}
          </Typography>
          <Typography className="text-xs text-neutral/70 mt-1">
            {t('profile.bmi')}
          </Typography>
          <Typography className="text-xs mt-1 text-primary">{bmiText}</Typography>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Typography className="text-sm text-neutral/70 mb-2">
            {t('profile.activityLevel')}
          </Typography>
          <Typography className="text-2xl font-bold text-primary">
            {userData?.activitylevel || "-"}
          </Typography>
          <Typography className="text-xs text-neutral/70 mt-1">
            {t('profile.dailyActivity')}
          </Typography>
        </div>
      </div>
    </div>
  );
}
