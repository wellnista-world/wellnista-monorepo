"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchProductByBarcode, NutritionalInfo } from "@/app/lib/api/image-analyze";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const barcode = searchParams.get("barcode");
  const [product, setProduct] = useState<NutritionalInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const maxCarbs = 8;

  useEffect(() => {
    if (!barcode) {
      setError("ไม่พบบาร์โค้ดใน URL");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const data = await fetchProductByBarcode(barcode);

        if (!data) {
          throw new Error("ไม่พบข้อมูลผลิตภัณฑ์ หรือข้อมูลไม่สมบูรณ์");
        }

        setProduct(data);
      } catch (err) {
        setError((err as Error).message || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [barcode]);

  if (loading) {
    return (
      <div className="mt-10 flex items-center justify-center">
        <div className="mt-8 w-48 h-48 flex items-center text-2xl text-secondary bg-primary justify-center rounded-full border-[#8A7F5F] border-t-transparent animate-spin">
          <p className="text-[#FFFFFF]">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary text-red-500 font-garet">
        <p>{error}</p>
      </div>
    );
  }

  const carbValue = product?.nutriments.carbohydrates ?? 0;
  const sodiumValue = product?.nutriments["sodium_value"] ?? 0;
  const fatValue = product?.nutriments.fat ?? 0;
  const sugarValue = product?.nutriments.sugars_value ?? 0;
  const protein = product?.nutriments.proteins_serving ?? 0;
  const kcal = product?.nutriments["energy-kcal_serving"] ?? 0;

  const carbPercentage = Math.min(((carbValue / 15) / maxCarbs) * 100, 100);

  // Calculate green stars based on nutritional values
  let greenStarCount = 0;
  if (sugarValue >= 0 && sugarValue <= 2) greenStarCount++;
  if (fatValue >= 0 && fatValue <= 10) greenStarCount++;
  if (sodiumValue >= 0 && sodiumValue <= 700) greenStarCount++;

  return (
    <div className="flex flex-col min-h-screen bg-secondary text-neutral font-garet p-4">
      <p className="text-3xl font-bold mb-4">
        {product?.product_name_th || product?.product_name_en || product?.product_name || "ไม่มีชื่อผลิตภัณฑ์"}
      </p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-full w-full h-full items-center">
        {product?.image_url ? (
          <img
            src={(product?.image_url as string) || "/placeholder-image.jpg"}
            alt={product?.product_name_en || "รูปภาพของผลิตภัณฑ์"}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center bg-gray-200 rounded-lg">
            <p>ไม่มีรูปภาพ</p>
          </div>
        )}
        </div>
        <div className="flex items-center mb-4 justify-center">
        {/* <div className="flex space-x-1 text-primary">
          {[...Array(greenStarCount)].map((_, index) => (
            <span key={index} className="text-2xl">★</span>
          ))}
        </div> */}
        <p className="text-3xl font-bold ml-4">{greenStarCount * 10} point</p>
        </div>
      </div>
      {/* Labels for Color Explanation */}
      <div className="grid grid-rows-3 grid-flow-col gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <p className="text-sm text-neutral">ปลอดภัย อยู่ในช่วงค่าเเนะนำ</p>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
            <p className="text-sm text-neutral">เกินค่าแนะนำ“เล็กน้อย”</p>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <p className="text-sm text-neutral">เกินค่าแนะนำ“มาก”</p>
          </div>
        </div>
      </div>

      {/* Indicators for Sugar, Sodium, and Fat */}
      <div className="flex flex-col space-y-6 mb-6 w-full max-w-md">
        {/* Sugar Row */}
        <div className="flex flex-col space-y-2">
          <p className="text-neutral font-bold">น้ำตาล</p>
          <div className="flex items-center justify-between">
            {/* Green Circle */}
            <div
              className={`flex items-center justify-center rounded-full bg-green-500 w-12 h-12 text-lg text-white font-bold ${sugarValue >= 0 && sugarValue <= 2 ? "ring-4 ring-green-300" : "opacity-50"
                }`}
            >
              1
            </div>
            {/* Yellow Circle */}
            <div
              className={`flex items-center justify-center rounded-full bg-yellow-400 w-12 h-12 text-lg text-white font-bold ${sugarValue >= 3 && sugarValue <= 7 ? "ring-4 ring-yellow-300" : "opacity-50"
                }`}
            >
              2
            </div>
            {/* Red Circle */}
            <div
              className={`flex items-center justify-center rounded-full bg-red-500 w-12 h-12 text-lg text-white font-bold ${sugarValue > 7 ? "ring-4 ring-red-300" : "opacity-50"
                }`}
            >
              3
            </div>
          </div>
        </div>

        {/* Sodium Row */}
        <div className="flex flex-col space-y-2">
          <p className="text-neutral font-bold">โซเดียม</p>
          <div className="flex items-center justify-between">
            {/* Green Circle */}
            <div
              className={`flex items-center justify-center rounded-full bg-green-500 w-12 h-12 text-lg text-white font-bold ${sodiumValue >= 0 && sodiumValue <= 700 ? "ring-4 ring-green-300" : "opacity-50"
                }`}
            >
              1
            </div>
            {/* Yellow Circle */}
            <div
              className={`flex items-center justify-center rounded-full bg-yellow-400 w-12 h-12 text-lg text-white font-bold ${sodiumValue >= 701 && sodiumValue <= 1050 ? "ring-4 ring-yellow-300" : "opacity-50"
                }`}
            >
              2
            </div>
            {/* Red Circle */}
            <div
              className={`flex items-center justify-center rounded-full bg-red-500 w-12 h-12 text-lg text-white font-bold ${sodiumValue > 1050 ? "ring-4 ring-red-300" : "opacity-50"
                }`}
            >
              3
            </div>
          </div>
        </div>

        {/* Fat Row */}
        <div className="flex flex-col space-y-2">
          <p className="text-neutral font-bold">ไขมัน</p>
          <div className="flex items-center justify-between">
            {/* Green Circle */}
            <div
              className={`flex items-center justify-center rounded-full bg-green-500 w-12 h-12 text-lg text-white font-bold ${fatValue >= 0 && fatValue <= 10 ? "ring-4 ring-green-300" : "opacity-50"
                }`}
            >
              1
            </div>
            {/* Yellow Circle */}
            <div
              className={`flex items-center justify-center rounded-full bg-yellow-400 w-12 h-12 text-lg text-white font-bold ${fatValue >= 11 && fatValue <= 13 ? "ring-4 ring-yellow-300" : "opacity-50"
                }`}
            >
              2
            </div>
            {/* Red Circle */}
            <div
              className={`flex items-center justify-center rounded-full bg-red-500 w-12 h-12 text-lg text-white font-bold ${fatValue > 13 ? "ring-4 ring-red-300" : "opacity-50"
                }`}
            >
              3
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow w-full text-lg font-bold">
          <p>แคลอรี่: {kcal ?? "ไม่มีข้อมูล"} kcal</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow w-full text-lg font-bold">
          <p>โปรตีน: {protein ?? "ไม่มีข้อมูล"} กรัม</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-6">
        <div className="flex flex-col items-start bg-white p-4 rounded-lg shadow w-full">
          <h2 className="text-lg font-bold mb-2">ข้อมูลทางโภชนาการ</h2>
          <ul className="text-sm space-y-1">
            <li>ไขมัน: {fatValue} กรัม</li>
            <li>โซเดียม: {sodiumValue} มิลลิกรัม</li>
            <li>น้ำตาล: {sugarValue} กรัม</li>
            <li>คาร์โบไฮเดรต: {carbValue} กรัม</li>
            <li>วิตามินเอ: {product?.nutriments["vitamin-a"] ?? "ไม่มีข้อมูล"} มก.</li>
            <li>วิตามินบี1: {product?.nutriments["vitamin-b1"] ?? "ไม่มีข้อมูล"} มก.</li>
            <li>วิตามินบี2: {product?.nutriments["vitamin-b2"] ?? "ไม่มีข้อมูล"} มก.</li>
            <li>แคลเซียม: {product?.nutriments.calcium ?? "ไม่มีข้อมูล"} มก.</li>
            <li>ธาตุเหล็ก: {product?.nutriments.iron ?? "ไม่มีข้อมูล"} มก.</li>
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow w-full mb-8">
          <h2 className="text-lg font-bold mb-2">ปริมาณคาร์บ</h2>
          <div className="w-24 h-24 mb-4">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              <path
                className="circle"
                strokeDasharray={`${carbPercentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#9F9260"
                strokeWidth="3"
              />
            </svg>
          </div>
          <p className="text-sm text-neutral">
            {Math.round(carbValue / 15)} คาร์บ ({Math.round(carbPercentage)}% ของ {maxCarbs} คาร์บสูงสุด)
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 grid-flow-col gap-4 mb-6">
        <div>
          <button
          className="px-6 py-3 w-full bg-[#5EC269] text-neutral text-xl font-semibold rounded-lg hover:bg-accent transition">
          กินแล้ว
          </button>
        </div>
        <div>
          <button
          className="px-6 py-3 w-full bg-[#DD524C] text-neutral text-xl font-semibold rounded-lg hover:bg-accent transition">
          ไม่ได้กิน
          </button>
        </div>
        <div>

        </div>       
      </div>

      <div className="flex justify-center">
        <button
          className="px-6 py-3 bg-primary text-secondary font-semibold rounded-full hover:bg-accent transition"
          onClick={() => router.push("/scan")}
        >
          ย้อนกลับ
        </button>
      </div>
    </div>
  );
}
