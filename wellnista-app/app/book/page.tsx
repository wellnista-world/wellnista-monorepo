"use client";

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import 'react-datepicker/dist/react-datepicker.css';
import StdSelect from "@/app/components/std/StdSelect";
import TextFields from '../components/std/StdTextField';



const mealNames: string[]=["เช้า" ,"กลางวัน" ,"เย็น"]
const mealTime: string[]=["ก่อนอาหาร" ,"หลังอาหาร"]

export default function InforDtx() {
  
  const MainButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 24,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#9F9260',
    borderColor: '#9F9260',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(24, 111, 204, 0.5)',
    },
  });
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

      <div className=" py-3 col-start-1 col-end-4 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        {currentDate}
      </div>
      <div className=" py-3 col-start-7 col-end-4 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        {currentTime}
      </div>

      <div className=" col-span-4 text-2xl font-bold text-neutral">
        มื้ออาหาร
      </div>
      
      <div className="col-start-1 col-end-3 content-center text-center text-xl text-secondary font-bold rounded-md transition">
        <StdSelect names={mealNames} />
      </div>
      
      <div className="col-start-1 col-end-4 content-center text-center text-xl text-secondary font-bold rounded-md transition">
        <StdSelect names={mealTime}/>
      </div>
      
      <div className="col-start-1 col-end-3 text-4xl content-center text-center font-bold text-neutral">
        DTX
      </div>
      <div className=" col-start-3 col-end-7 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        <TextFields type='number' />
      </div>

      <div className="mt-20 py-3 col-start-2 col-end-6 text-center ">
        <MainButton variant="contained">
          บันทึก
        </MainButton>
      </div>

    </div>
  );
}

