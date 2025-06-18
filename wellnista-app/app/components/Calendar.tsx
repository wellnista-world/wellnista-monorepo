"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Typography from "@mui/material/Typography";

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

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
    const today = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={day}
          className={`h-10 flex items-center justify-center rounded-full ${
            isToday ? "bg-primary text-secondary" : "hover:bg-secondary/10"
          }`}
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