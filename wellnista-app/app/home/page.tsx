import Link from "next/link";

export default function HomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome Wellnista</h1>
      <p className="mb-6 text-gray-600">Choose your action below to get started.</p>
      <div className="flex flex-col gap-4">
        <Link href="/scan">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Go to Scan Page
          </button>
        </Link>
        <Link href="/menu">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Go to Menu
          </button>
        </Link>
      </div>
    </div>
  );
}
