//"use client";

//import Link from "next/link";


export default function register() {
    return (
    
    <div className="grid grid-cols-6 gap-4 md:place-content-center bg-secondary text-neutral font-garet ">

      <div className="col-span-6 text-center text-3xl font-magnolia text-primary ">
        ลงทะเบียน
      </div>

      <div className="col-span-4 text-2xl font-bold text-neutral">
        ชื่อ-นามสกุล
      </div>
      <div className="py-3 col-span-6 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        input name
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