"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Typography from "@mui/material/Typography";
import { supabase } from "@/app/lib/api/supabaseClient";
import { useAuth } from "@/app/lib/context/AuthContext";

interface NutritionData {
  date: string;
  calories: number;
  carbs: number;
  protein: number;
  calGoal: number;
  carbGoal: number;
  proteinGoal: number;
}

interface NutritionRecord {
  scanned_at: string;
  nutrition: {
    total_calories_kcal: number;
    total_carbohydrates_per_serving_g: number;
    protein_per_serving_g: number;
  } | null;
}

interface CalendarProps {
  calGoal: number;
  carbGoal: number;
  proteinGoal: number;
  todayNutrition: {
    calories: number;
    carbs: number;
    protein: number;
  };
}

export function Calendar({ calGoal, carbGoal, proteinGoal, todayNutrition }: CalendarProps) {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [nutritionData, setNutritionData] = useState<NutritionData[]>([]);

  // Helper to get Thailand local date string (YYYY-MM-DD)
  const getThailandDateString = (date: Date) => {
    // Add 7 hours to UTC time to get Thailand time
    const thailandDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const year = thailandDate.getUTCFullYear();
    const month = thailandDate.getUTCMonth();
    const day = thailandDate.getUTCDate();
    // Create a new date at midnight Thailand time
    const thailandMidnight = new Date(Date.UTC(year, month, day));
    return thailandMidnight.toISOString().split('T')[0];
  };

  // Fetch monthly data for calendar
  const fetchMonthData = useCallback(async () => {
    if (!user?.id) return;

    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const { data } = await supabase
      .from("food_scan_history")
      .select(`
        scanned_at,
        nutrition:nutrition_id (
          total_calories_kcal,
          total_carbohydrates_per_serving_g,
          protein_per_serving_g
        )
      `)
      .eq("user_id", user.id)
      .gte("scanned_at", startDate.toISOString())
      .lte("scanned_at", endDate.toISOString());

    if (data) {
      const dailyData = (data as unknown as NutritionRecord[]).reduce((acc: { [key: string]: NutritionData }, item) => {
        // Use Thailand local date for the key
        const date = getThailandDateString(new Date(item.scanned_at));
        if (!acc[date]) {
          acc[date] = {
            date,
            calories: 0,
            carbs: 0,
            protein: 0,
            calGoal,
            carbGoal,
            proteinGoal
          };
        }
        if (item.nutrition) {
          acc[date].calories += Number(item.nutrition.total_calories_kcal) || 0;
          acc[date].carbs += (Number(item.nutrition.total_carbohydrates_per_serving_g) || 0) / 15;
          acc[date].protein += Number(item.nutrition.protein_per_serving_g) || 0;
        } else {
          // If nutrition is null, treat as 0 (do nothing, already initialized to 0)
        }
        return acc;
      }, {});

      // Add today's data to the monthly data using Thailand local date
      const today = getThailandDateString(new Date());
      if (
        !dailyData[today] &&
        (todayNutrition.calories > 0 || todayNutrition.carbs > 0 || todayNutrition.protein > 0)
      ) {
        dailyData[today] = {
          date: today,
          calories: todayNutrition.calories,
          carbs: todayNutrition.carbs,
          protein: todayNutrition.protein,
          calGoal,
          carbGoal,
          proteinGoal
        };
      }
      // Debug log
      console.log('Calendar dailyData keys:', Object.keys(dailyData));

      setNutritionData(Object.values(dailyData));
    }
  }, [currentDate, user?.id, calGoal, carbGoal, proteinGoal, todayNutrition]);

  // Fetch monthly data only when month changes
  useEffect(() => {
    fetchMonthData();
  }, [fetchMonthData]);

  const getDayColor = (day: number) => {
    const date = getThailandDateString(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    const dayData = nutritionData.find(d => d.date === date);

    // If no data or all values are 0 or NaN, return white
    if (
      !dayData ||
      ((Number(dayData.calories) === 0 || isNaN(Number(dayData.calories))) &&
        (Number(dayData.carbs) === 0 || isNaN(Number(dayData.carbs))) &&
        (Number(dayData.protein) === 0 || isNaN(Number(dayData.protein))))
    ) {
      return "bg-white";
    }

    const overCal = dayData.calories > dayData.calGoal;
    const overCarb = dayData.carbs > dayData.carbGoal;
    const overProtein = dayData.protein > dayData.proteinGoal;

    const overCount = [overCal, overCarb, overProtein].filter(Boolean).length;

    switch (overCount) {
      case 0:
        return "bg-[#5EC269]"; // green
      case 1:
        return "bg-[#FFD700]"; // yellow
      case 2:
        return "bg-[#FFA500]"; // orange
      case 3:
        return "bg-[#FF0000]"; // red
      default:
        return "bg-white";
    }
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderDays = () => {
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = getThailandDateString(cellDate) === getThailandDateString(new Date());
      days.push(
        <div
          key={day}
          className={`h-10 flex items-center justify-center rounded-full ${
            isToday ? "ring-2 ring-black font-bold black" : ""
          } ${getDayColor(day)}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-secondary/10 rounded-full"
        >
          <ChevronLeft className="text-primary" />
        </button>
        <Typography className="text-lg font-semibold text-primary">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear() + 543}
        </Typography>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-secondary/10 rounded-full"
        >
          <ChevronRight className="text-primary" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((day) => (
          <Typography key={day} className="text-sm text-neutral/70">
            {day}
          </Typography>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
} 