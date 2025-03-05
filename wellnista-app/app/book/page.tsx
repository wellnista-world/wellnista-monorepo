"use client";

//import Link from "next/link";
import React, { useState,useEffect } from 'react';
//import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';




export default function InforDtx() {
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0"); // เติม 0 ถ้าหลักเดียว
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // เดือนเริ่มจาก 0
    const year = date.getFullYear();
    const hour = date.getHours().toString();
    const min = date.getMinutes().toString().padStart(2, "0");

    setCurrentDate(`${day}/${month}/${year}`);
    setCurrentTime(`${hour}:${min}`);

  }, []);
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary text-neutral font-garet text-center">
      <h1 className="text-4xl font-magnolia text-primary ">สมุดบันทึกน้ำตาล</h1>
      <div className="mb-8 text-xl font-semibold text-neutral">
       วัน - เวลา
       <div className="mx-2 px-6 py-3 bg-primary text-secondary font-bold rounded-full transition">
            {currentDate}
        </div>  
          <div className="mx-10 px-6 py-3 bg-primary text-secondary font-bold rounded-full transition">
            {currentTime}
          </div>
      </div>
    
    </div>
  );
}