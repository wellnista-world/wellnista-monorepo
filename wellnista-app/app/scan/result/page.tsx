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
  const maxCarbs = 7; // Maximum carb reference value

  useEffect(() => {
    if (!barcode) {
      setError("No barcode found in the URL.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const data = await fetchProductByBarcode(barcode);

        if (!data) {
          throw new Error("Product not found or incomplete data");
        }

        setProduct(data);
      } catch (err) {
        setError((err as Error).message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [barcode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary text-neutral font-garet">
        <p>Loading...</p>
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

  // Calculate carb percentage for the graph
  const carbValue = product?.nutriments.carbohydrates ?? 0;
  const sodiumValue = product?.nutriments.sodium ?? 0;
  const fatValue = product?.nutriments.fat ?? 0;

  const carbPercentage = Math.min(((carbValue / 15) / maxCarbs) * 100, 100); // Cap at 100%

  // Star rating logic
  let greenStarCount = 0;
  if (carbValue >= 0 && carbValue <= 2) greenStarCount++;
  if (fatValue >= 0 && fatValue <= 10) greenStarCount++;
  if (sodiumValue >= 0 && sodiumValue <= 700) greenStarCount++;

  // Determine prominent color and label
  let prominentColor = "red";
  let prominentLabel = "C";
  let prominentSize = "w-12 h-12";

  if (greenStarCount >= 2) {
    prominentColor = "green";
    prominentLabel = "A";
    prominentSize = "w-14 h-14"; // Larger size for prominence
  } else if (greenStarCount === 1) {
    prominentColor = "yellow";
    prominentLabel = "B";
    prominentSize = "w-12 h-12"; // Medium size
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-secondary text-neutral font-garet p-4">
      {/* Header Image */}
      <div className="w-full max-w-md h-32 bg-muted rounded-lg mb-4">
        {product?.image_url ? (
          <img
            src={(product?.image_url as string) || "/placeholder-image.jpg"}
            alt={product?.product_name || "Product image"}
            className="w-full h-full object-cover rounded-lg"
          />

        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
            <p>No image available</p>
          </div>
        )}
      </div>

      {/* Color Indicators */}
      <div className="flex items-center justify-center mb-6 space-x-4">
        {/* Green Indicator */}
        <div
          className={`flex items-center justify-center rounded-full bg-green-500 ${prominentColor === "green" ? prominentSize : "w-8 h-8"
            } text-white font-bold`}
        >
          {prominentColor === "green" && prominentLabel}
        </div>

        {/* Yellow Indicator */}
        <div
          className={`flex items-center justify-center rounded-full bg-yellow-400 ${prominentColor === "yellow" ? prominentSize : "w-8 h-8"
            } text-white font-bold`}
        >
          {prominentColor === "yellow" && prominentLabel}
        </div>

        {/* Red Indicator */}
        <div
          className={`flex items-center justify-center rounded-full bg-red-500 ${prominentColor === "red" ? prominentSize : "w-8 h-8"
            } text-white font-bold`}
        >
          {prominentColor === "red" && prominentLabel}
        </div>
      </div>

      {/* Star Rating */}
      <div className="flex items-center mb-4">
        <div className="flex space-x-1 text-primary">
          {[...Array(greenStarCount)].map((_, index) => (
            <span key={index} className="text-2xl">★</span>
          ))}
        </div>
        <p className="text-2xl font-bold ml-4">{greenStarCount * 10} points</p>
      </div>

      {/* Nutritional and Carb Information Side-by-Side */}
      <div className="flex flex-col md:flex-row w-full max-w-md gap-6">
        {/* Nutritional Details */}
        <div className="flex flex-col items-start bg-white p-4 rounded-lg shadow w-full">
          <h2 className="text-lg font-bold mb-2">Nutritional Information</h2>
          <ul className="text-sm space-y-1">
            <li>Calories: {product?.nutriments.energy ?? "N/A"} kcal</li>
            <li>Fat: {fatValue} g</li>
            <li>Sodium: {sodiumValue} mg</li>
            <li>Carbohydrates: {carbValue} g</li>
            <li>Vitamin A: {product?.nutriments["vitamin-a"] ?? "N/A"} µg</li>
            <li>Vitamin B1: {product?.nutriments["vitamin-b1"] ?? "N/A"} mg</li>
            <li>Vitamin B2: {product?.nutriments["vitamin-b2"] ?? "N/A"} mg</li>
            <li>Calcium: {product?.nutriments.calcium ?? "N/A"} mg</li>
            <li>Iron: {product?.nutriments.iron ?? "N/A"} mg</li>
          </ul>
        </div>

        {/* Carb Intake Section */}
        <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow w-full">
          <h2 className="text-lg font-bold mb-2">Carb Intake</h2>
          <div className="w-24 h-24 mb-4">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              <path
                className="circle"
                strokeDasharray={`${carbPercentage}, 100`}
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#9F9260"
                strokeWidth="3"
              />
            </svg>
          </div>
          <p className="text-sm text-neutral">
            {Math.round(carbValue / 15)} carb ({Math.round(carbPercentage)}% of max {maxCarbs} carb)
          </p>
        </div>
      </div>

      {/* Centered Back Button */}
      <div className="flex justify-center mt-6">
        <button
          className="px-6 py-3 bg-primary text-secondary font-semibold rounded-full hover:bg-accent transition"
          onClick={() => router.push("/scan")}
        >
          Back
        </button>
      </div>
    </div>
  );
}
