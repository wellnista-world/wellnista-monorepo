"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchProductByBarcode, NutritionalInfo } from "@/app/lib/api/image-analyze";
import IntroductionStatus from "@/app/components/util/IntroductionStatus";
import IndicatorRow from "@/app/components/util/IndicatorRow";
import Box from '@mui/material/Box';
import Image from "next/image";
import { supabase } from "@/app/lib/api/supabaseClient";
import { useAuth } from "@/app/lib/context/AuthContext";

export interface NutritionData {
  timestamp?: string; // or Date if you convert
  food_category: string;
  food_image?: string;
  food_name_thai?: string;
  food_name_eng?: string;
  brand_trademark_thai?: string;
  brand_trademark_eng?: string;
  barcode?: string;
  total_calories_kcal?: number;
  total_sugar?: number;
  total_fat_g?: number;
  total_sodium_mg?: number;
  serving_size_g?: string;
  servings_per_container?: string;
  calories_per_serving?: number;
  total_fat_per_serving_g?: number;
  saturated_fat_per_serving_g?: number;
  cholesterol_per_serving_mg?: number;
  protein_per_serving_g?: number;
  total_carbohydrates_g?: number;
  fiber_per_serving_g?: string;
  sugar_per_serving_g?: string;
  sodium_per_serving_mg?: string;
  vitamin_a_percentage?: string;
  vitamin_b1_percentage?: string;
  vitamin_b2_percentage?: string;
  calcium_percentage?: number;
  iron_percentage?: number;
  health_choice_symbol?: string;
  halal_symbol?: string;
  eec_symbol?: string;
  certified_vegan_symbol?: string;
  heart_healthy_food?: string;
  other_symbols?: string;
  carbohydrates_per_serving_g?: number;
}

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const barcode = searchParams.get("barcode");
  const [product, setProduct] = useState<NutritionalInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const maxCarbs = 8;

  // create handle function when click กิน it will save data to supabase
  // try to search barcode from supabase in nutritional_data table
  // if found, insert data to food_scan_history table
  // if not found, save nutritional_data to nutritional_data table
  // then insert data to food_scan_history table
  const handleEat = async () => {
    // 1. Check if barcode exists in nutritional_data
    const { data } = await supabase
      .from("nutrition_data")
      .select("*")
      .eq("barcode", barcode);

    let nutritionId;

    if (!data || data.length === 0) {
      // 2. Map product to NutritionData
      const nutritionData: NutritionData = {
        barcode: barcode ?? undefined,
        food_name_thai: product?.product_name_th,
        food_name_eng: product?.product_name_en,
        food_image: product?.image_url as string,
        total_calories_kcal: product?.nutriments["energy-kcal_serving"],
        total_sugar: product?.nutriments.sugars_value,
        total_fat_g: product?.nutriments.fat,
        total_sodium_mg: product?.nutriments["sodium_value"],
        food_category: "อาหาร",
        timestamp: new Date().toISOString(),
        carbohydrates_per_serving_g: product?.nutriments.carbohydrates,
      };

      // 3. Insert into nutritional_data
      const { data: inserted, error: insertError } = await supabase
        .from("nutrition_data")
        .insert([nutritionData])
        .select();

      if (insertError) {
        console.error("Failed to save nutritional data:", insertError);
        return;
      }
      nutritionId = inserted?.[0]?.id; // or use barcode as key
    } else {
      nutritionId = data[0].id; // or use barcode as key
    }

    // 4. Insert into food_scan_history
    const { error: historyError } = await supabase
      .from("food_scan_history")
      .insert({
        barcode: barcode,
        scanned_at: new Date(),
        user_id: user?.id,
        nutrition_id: nutritionId, // if you have a relation
      });

      router.push("/scan");

    if (historyError) {
      console.error("Failed to save scan history:", historyError);
    } else {
      console.log("Scan history saved!");
      router.push("/scan");
    }
  };

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
      <Box className="mt-10 flex items-center justify-center">
        <Box className="mt-8 w-48 h-48 flex items-center text-2xl text-secondary bg-primary justify-center rounded-full border-[#8A7F5F] border-t-transparent animate-spin">
          <p className="text-[#FFFFFF]">Loading...</p>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex items-center justify-center min-h-screen bg-secondary text-red-500 font-garet">
        <p>{error}</p>
      </Box>
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
    <Box className="flex flex-col min-h-screen bg-secondary text-neutral font-garet p-4">
      <p className="text-3xl font-bold mb-4">
        {product?.product_name_th || product?.product_name_en || product?.product_name || "ไม่มีชื่อผลิตภัณฑ์"}
      </p>
      <Box className="grid grid-cols-2 gap-4 mb-6">
        <Box className="rounded-full w-full h-full items-center">
          {product?.image_url ? (
            <Image
              src={(product?.image_url as string) || "/placeholder-image.jpg"}
              alt={product?.product_name_en || "รูปภาพของผลิตภัณฑ์"}
              className="w-full h-full object-cover rounded-lg"
              width={500}
              height={500}
            />
          ) : (
            <Box className="flex items-center justify-center bg-gray-200 rounded-lg">
              <p>ไม่มีรูปภาพ</p>
            </Box>
          )}
        </Box>
        <Box className="flex items-center mb-4 justify-center">
          {/* <Box className="flex space-x-1 text-primary">
          {[...Array(greenStarCount)].map((_, index) => (
            <span key={index} className="text-2xl">★</span>
          ))}
        </Box> */}
          <p className="text-3xl font-bold ml-4">{greenStarCount * 10} point</p>
        </Box>
      </Box>
      {/* Labels for Color Explanation */}
      <IntroductionStatus />
      <Box className="flex flex-col space-y-6 mb-6 w-full max-w-md">
        <IndicatorRow label="น้ำตาล" value={sugarValue} thresholds={[2, 7]} />
        <IndicatorRow label="โซเดียม" value={sodiumValue} thresholds={[700, 1050]} />
        <IndicatorRow label="ไขมัน" value={fatValue} thresholds={[10, 13]} />
      </Box>

      <Box className="grid grid-cols-2 gap-4 mb-6">
        <Box className="bg-white p-4 rounded-lg shadow w-full text-lg font-bold">
          <p>แคลอรี่: {kcal ?? "ไม่มีข้อมูล"} kcal</p>
        </Box>
        <Box className="bg-white p-4 rounded-lg shadow w-full text-lg font-bold">
          <p>โปรตีน: {protein ?? "ไม่มีข้อมูล"} กรัม</p>
        </Box>
      </Box>

      <Box className="flex flex-col md:flex-row w-full gap-6">
        <Box className="flex flex-col items-start bg-white p-4 rounded-lg shadow w-full">
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
        </Box>

        <Box className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow w-full mb-8">
          <h2 className="text-lg font-bold mb-2">ปริมาณคาร์บ</h2>
          <Box className="w-24 h-24 mb-4">
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
          </Box>
          <p className="text-sm text-neutral">
            {Math.round(carbValue / 15)} คาร์บ ({Math.round(carbPercentage)}% ของ {maxCarbs} คาร์บสูงสุด)
          </p>
        </Box>
      </Box>

      <Box className="grid grid-cols-2 grid-flow-col gap-4 mb-6">
        <Box>
          <button
            onClick={handleEat}
            className="px-6 py-3 w-full bg-[#5EC269] text-neutral text-xl font-semibold rounded-lg hover:bg-accent transition">
            กินแล้ว
          </button>
        </Box>
        <Box>
          <button
            className="px-6 py-3 w-full bg-[#DD524C] text-neutral text-xl font-semibold rounded-lg hover:bg-accent transition">
            ไม่ได้กิน
          </button>
        </Box>
        <Box>

        </Box>
      </Box>

      <Box className="flex justify-center">
        <button
          className="px-6 py-3 bg-primary text-secondary font-semibold rounded-full hover:bg-accent transition"
          onClick={() => router.push("/scan")}
        >
          ย้อนกลับ
        </button>
      </Box>
    </Box>
  );
}
