import Link from "next/link";

export default function SelectScreen() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-secondary text-neutral font-garet text-center">
      <h1 className="text-4xl font-magnolia text-primary mb-6">ยินดีต้อนรับเข้าสู่</h1>
      <h1 className="text-4xl font-magnolia text-primary mb-6">Wellnista</h1>
      <p className="mb-8 text-lg font-semibold text-neutral">
        Choose your action below to get started.
      </p>
      <h1 className="text-4xl font-magnolia text-primary mb-6">ตรวจสอบโภชนาการอาหาร</h1>
      <div className="flex flex-col gap-4">
        {/* ปุ่มใช้ได้ */}
        <Link href="/scan">
          <button className="px-6 py-3 bg-primary text-secondary font-bold rounded-full hover:bg-accent transition">
            สแกน บาร์โค้ด
          </button>
        </Link>
        {/* ปุ่มกำลังพัฒนา */}
        <Link href="/menu">
          <button className="px-6 py-3 bg-primary text-secondary font-bold rounded-full hover:bg-accent transition">
            ถ่ายรูป/พิมพ์ชื่ออาหาร
          </button>
        </Link>
      </div>
    </div>
    );
  }