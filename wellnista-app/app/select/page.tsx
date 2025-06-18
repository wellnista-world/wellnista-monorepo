"use client";

import Link from "next/link";
import Typography from '@mui/material/Typography';
import { Barcode, Camera } from 'lucide-react';

export default function SelectScreen() {
  const menuItems = [
    {
      icon: <Barcode size={50} />,
      label: "สแกน บาร์โค้ด",
      href: "/scan",
      color: "bg-[#9F9260]"
    },
    {
      icon: <Camera size={50} />,
      label: "ถ่ายรูปอาหาร",
      href: "/scan/scan-image",
      color: "bg-[#9F9260]"
    }
  ];

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <Typography className="!text-2xl font-bold text-primary mb-2">
          ยินดีต้อนรับเข้าสู่
        </Typography>
        <Typography className="!text-3xl font-bold text-primary mb-4">
          Wellnista
        </Typography>
        <Typography className="!text-sm text-neutral/70">
          Choose your action below to get start
        </Typography>
      </div>

      {/* Main Menu Grid */}
      <div className="mb-8">
        <Typography className="!text-xl font-semibold text-primary mb-6 pb-3">
          ตรวจสอบโภชนาการอาหาร
        </Typography>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className="block"
            >
              <div className="bg-white rounded-2xl p-6 h-32 flex flex-col text-primary justify-between shadow-lg hover:opacity-90 transition-all">
                <div className="flex justify-between items-start">
                  {item.icon}
                </div>
                <Typography className="!text-xl font-semibold">
                  {item.label}
                </Typography>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-neutral/70">
        <p>เลือกวิธีการตรวจสอบอาหารที่คุณต้องการ</p>
        <p>เพื่อดูข้อมูลโภชนาการ</p>
      </div>
    </div>
  );
}
