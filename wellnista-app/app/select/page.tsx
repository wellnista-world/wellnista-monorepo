import Link from "next/link";

export default function SelectScreen() {
    return (
    <div>
    
    {/*Body*/}
    <div className="text-center mt-8">
      <h1 className="text-2xl font-magnolia mb-2">ยินดีต้อนรับเข้าสู่</h1>
      <h1 className="text-3xl font-magnolia font-bold text-[#000000]">Wellnista</h1>
      <p className="text-sm font-magnolia text-[#000000] mt-4">Choose your action below to get start</p>
    </div>
      
    <h3 className="text-center text-lg text-[#000000] mt-6">ตรวจสอบโภชนาการอาหาร</h3>
      <div className="mt-6 flex flex-col gap-6 w-full items-center justify-center">
        {/* ปุ่มใช้ได้ */}
        <Link href="/scan">
          <button className="w-80 py-4 bg-primary text-2xl text-secondary font-bold rounded-lg hover:bg-accent transition">
            สแกน บาร์โค้ด
          </button>
        </Link>
        {/* ปุ่มกำลังพัฒนา */}
        <Link href="/menu">
          <button className="w-80 py-4 bg-primary text-2xl text-secondary font-bold rounded-lg hover:bg-accent transition">
            ถ่ายรูป / พิมพ์ชื่ออาหาร
          </button>
        </Link>
      </div>
    </div>
    );
  }
