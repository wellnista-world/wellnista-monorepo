import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary text-neutral">
      <h1 className="text-4xl font-magnolia font-bold text-primary mb-4">ยินดีต้อนรับเข้าสู่ Wellnista</h1>
      <p className="mb-6 text-neutral text-lg font-garet font-semibold">
  Design your happier wellness life with AI-powered insights.
</p>
      <Link href="/home">
        <button className="px-6 py-3 bg-primary text-secondary font-bold font-garet rounded-full hover:bg-accent">
          เริ่มใช้งาน
        </button>
      </Link>
    </div>
  );
}
