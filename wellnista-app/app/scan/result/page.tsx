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
import { useI18n } from "../../../i18n";

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
  const { t } = useI18n();
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

      router.push("/profile");

    if (historyError) {
      console.error("Failed to save scan history:", historyError);
    } else {
      console.log("Scan history saved!");
      router.push("/profile");
    }
  };

  useEffect(() => {
    if (!barcode) {
      setError(t('scan.noBarcodeInUrl'));
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        // First, try to get data from Supabase nutrition_data table
        const { data: nutritionData } = await supabase
          .from("nutrition_data")
          .select("*")
          .eq("barcode", barcode)
          .single();

        if (nutritionData) {
          // If found in Supabase, convert to NutritionalInfo format
          const convertedData: NutritionalInfo = {
            product_name: nutritionData.food_name_eng || nutritionData.food_name_thai,
            product_name_th: nutritionData.food_name_thai,
            product_name_en: nutritionData.food_name_eng,
            image_url: nutritionData.food_image,
            brands: nutritionData.brand_trademark_eng || nutritionData.brand_trademark_thai,
            nutriments: {
              "energy-kcal_serving": nutritionData.total_calories_kcal,
              sugars_value: nutritionData.total_sugar,
              fat: nutritionData.total_fat_g,
              "sodium_value": nutritionData.total_sodium_mg,
              carbohydrates: nutritionData.carbohydrates_per_serving_g,
              proteins_serving: nutritionData.protein_per_serving_g,
              "vitamin-a": nutritionData.vitamin_a_percentage,
              "vitamin-b1": nutritionData.vitamin_b1_percentage,
              "vitamin-b2": nutritionData.vitamin_b2_percentage,
              calcium: nutritionData.calcium_percentage,
              iron: nutritionData.iron_percentage
            }
          };
          setProduct(convertedData);
          setLoading(false);
          return;
        }

        // If not found in Supabase, fetch from barcode API
        const data = await fetchProductByBarcode(barcode);

        if (!data) {
          throw new Error(t('scan.productNotFound'));
        }

        setProduct(data);
      } catch (err) {
        setError((err as Error).message || t('scan.unknownError'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [barcode, t]);

  if (loading) {
    return (
      <Box className="mt-10 flex items-center justify-center">
        <Box className="mt-8 w-48 h-48 flex items-center text-2xl text-secondary bg-primary justify-center rounded-full border-[#8A7F5F] border-t-transparent animate-spin">
          <p className="text-[#FFFFFF]">{t('common.loading')}</p>
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
        {product?.product_name_th || product?.product_name_en || product?.product_name || t('scan.noProductName')}
      </p>
      <Box className="grid grid-cols-2 gap-4 mb-6">
        <Box className="rounded-full w-full h-full items-center">
          {product?.image_url ? (
            (product.image_url as string).includes('drive.google.com') ? (
              <Box className="flex items-center justify-center bg-gray-200 rounded-lg h-full">
                <p>{t('scan.noImage')}</p>
              </Box>
            ) : (
              <Image
                src={product.image_url as string}
                alt={product?.product_name_en || t('scan.noImage')}
                className="w-full h-full object-cover rounded-lg"
                width={500}
                height={500}
              />
            )
          ) : (
            <Box className="flex items-center justify-center bg-gray-200 rounded-lg h-full">
              <p>{t('scan.noImage')}</p>
            </Box>
          )}
        </Box>
        <Box className="flex items-center mb-4 justify-center">
          <p className="text-3xl font-bold ml-4">{greenStarCount * 10} {t('scan.points')}</p>
        </Box>
      </Box>
      {/* Labels for Color Explanation */}
      <IntroductionStatus />
      <Box className="flex flex-col space-y-6 mb-6 w-full max-w-md">
        <IndicatorRow label={t('scan.sugar')} value={sugarValue} thresholds={[2, 7]} />
        <IndicatorRow label={t('scan.sodium')} value={sodiumValue} thresholds={[700, 1050]} />
        <IndicatorRow label={t('scan.fat')} value={fatValue} thresholds={[10, 13]} />
      </Box>

      <Box className="grid grid-cols-2 gap-4 mb-6">
        <Box className="bg-white p-4 rounded-lg shadow w-full text-lg font-bold">
          <p>{t('scan.calories')}: {kcal ?? t('scan.noData')} kcal</p>
        </Box>
        <Box className="bg-white p-4 rounded-lg shadow w-full text-lg font-bold">
          <p>{t('scan.protein')}: {protein ?? t('scan.noData')} {t('scan.grams')}</p>
        </Box>
      </Box>

      <Box className="flex flex-col md:flex-row w-full gap-6">
        <Box className="flex flex-col items-start bg-white p-4 rounded-lg shadow w-full">
          <h2 className="text-lg font-bold mb-2">{t('scan.nutritionalInfo')}</h2>
          <ul className="text-sm space-y-1">
            <li>{t('scan.fat')}: {fatValue} {t('scan.grams')}</li>
            <li>{t('scan.sodium')}: {sodiumValue} {t('scan.milligrams')}</li>
            <li>{t('scan.sugar')}: {sugarValue} {t('scan.grams')}</li>
            <li>{t('scan.carbohydrates')}: {carbValue} {t('scan.grams')}</li>
            <li>{t('scan.vitaminA')}: {product?.nutriments["vitamin-a"] ?? t('scan.noData')} {t('scan.mg')}</li>
            <li>{t('scan.vitaminB1')}: {product?.nutriments["vitamin-b1"] ?? t('scan.noData')} {t('scan.mg')}</li>
            <li>{t('scan.vitaminB2')}: {product?.nutriments["vitamin-b2"] ?? t('scan.noData')} {t('scan.mg')}</li>
            <li>{t('scan.calcium')}: {product?.nutriments.calcium ?? t('scan.noData')} {t('scan.mg')}</li>
            <li>{t('scan.iron')}: {product?.nutriments.iron ?? t('scan.noData')} {t('scan.mg')}</li>
          </ul>
        </Box>

        <Box className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow w-full mb-8">
          <h2 className="text-lg font-bold mb-2">{t('scan.carbAmount')}</h2>
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
            {t('scan.carbOfMax', { 
              percentage: Math.round(carbPercentage), 
              max: maxCarbs 
            })}
          </p>
        </Box>
      </Box>

      <Box className="grid grid-cols-2 grid-flow-col gap-4 mb-6">
        <Box>
          <button
            onClick={handleEat}
            className="px-6 py-3 w-full bg-[#5EC269] text-neutral text-xl font-semibold rounded-lg hover:bg-accent transition">
            {t('scan.ate')}
          </button>
        </Box>
        <Box>
          <button
          onClick={() => router.push("/scan")}
            className="px-6 py-3 w-full bg-[#DD524C] text-neutral text-xl font-semibold rounded-lg hover:bg-accent transition">
            {t('scan.didNotEat')}
          </button>
        </Box>
        <Box>

        </Box>
      </Box>
    </Box>
  );
}
