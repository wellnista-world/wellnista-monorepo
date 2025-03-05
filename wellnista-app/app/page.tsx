import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col item-center justify-center bg-secondary text-neutral">
      <h1 className=" text-center text-4xl font-magnolia font-bold text-primary mt-10">ยินดีต้อนรับเข้าสู่ Wellnista</h1>
      <p className="mt-5 text-center text-neutral text-lg font-garet font-semibold">
  Design your happier wellness life with AI-powered insights.
</p>
      <Link href="/home">
        <button className="flex flex-col h-20 mx-5 mt-10 w-80 item-center justify-center text-center text-xl bg-primary text-secondary font-bold font-garet rounded-md hover:bg-accent">
          เริ่มใช้งาน
        </button>
      </Link>
      <Link href="book">
        <button className="flex flex-col h-20 mx-5 mt-10 w-80 item-center justify-center text-center text-xl  bg-primary text-secondary font-bold font-garet rounded-md hover:bg-accent">
          book testing
        </button>
      </Link>
    </div>
  );
}
