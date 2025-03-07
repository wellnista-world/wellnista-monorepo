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
    
    <div className="grid grid-cols-6 gap-4 md:place-content-center bg-secondary text-neutral font-garet ">

      <div className="col-span-6 text-center text-3xl font-magnolia text-primary ">
        สมุดบันทึกน้ำตาล
      </div>

      <div className="col-span-4 text-2xl font-bold text-neutral">
        วัน - เวลา
      </div>

      <div className=" col-start-1 col-end-4 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        {currentDate}
      </div>  
      <div className=" col-start-7 col-end-4 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        {currentTime}
      </div>

      <div className=" col-span-4 text-2xl font-bold text-neutral">
        มื้ออาหาร
      </div>

      <div className="py-3 col-start-1 col-end-3 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        เช้า
      </div>
      <div className="py-3 col-start-3 col-end-5 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        กลางวัน
      </div>
      <div className="py-3 col-start-5 col-end-7 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        เย็น
      </div>

      <div className="py-3 col-start-1 col-end-4 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        ก่อนอาหาร
      </div>
      <div className="py-3 col-start-4 col-end-7 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        หลังอาหาร
      </div>

      <div className="col-start-1 col-end-3 text-4xl content-center text-center font-bold text-neutral">
        DTX
      </div>
      <div className="py-3 col-start-3 col-end-7 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        input DTX
      </div>

      <div className="mt-20 py-3 col-start-2 col-end-6 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        บันทึก
      </div>
    
    </div>
  );
}