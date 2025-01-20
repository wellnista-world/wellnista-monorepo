import Link from "next/link";

export default function HomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary text-neutral font-garet text-center">
      <h1 className="text-4xl font-magnolia text-primary mb-6">Welcome to Wellnista</h1>
      <p className="mb-8 text-lg font-semibold text-neutral">
        Choose your action below to get started.
      </p>
      <div className="flex flex-col gap-4">
        {/* ปุ่มเด่น */}
        <Link href="/scan">
          <button className="px-6 py-3 bg-primary text-secondary font-bold rounded-full hover:bg-accent transition">
            Go to Scan Page
          </button>
        </Link>
        {/* ปุ่ม Outline */}
        <Link href="/menu">
          <button className="px-6 py-3 border-2 border-accent text-accent font-semibold rounded-full hover:bg-accent hover:text-secondary transition">
            Go to Menu
          </button>
        </Link>
      </div>
    </div>
  );
}
