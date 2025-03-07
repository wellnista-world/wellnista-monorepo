import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col  justify-center item-center bg-secondary text-neutral font-garet text-center">
      <h1 className=" text-center text-5xl font-magnolia font-bold text-primary mt-10">ยินดีต้อนรับเข้าสู่ Wellnista</h1>
      <p className="mt-5 text-center text-neutral text-lg font-garet font-semibold">
  Design your happier wellness life with AI-powered insights.
</p>
      <div className="flex flex-col gap-4  justify-center">
        <Link href="/home">
          <button className="mt-5 py-10 w-80 text-3xl bg-primary text-secondary font-bold rounded-md hover:bg-accent">
            เริ่มใช้งาน
          </button>
        </Link>
        
        
      </div>  
    </div>
   /* <Link href="book">
    <button className="py-10 w-80 text-3xl bg-primary text-secondary font-bold rounded-md hover:bg-accent">
      book testing
    </button>
  </Link> */
  );
}
