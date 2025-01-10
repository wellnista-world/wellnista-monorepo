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
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Product Information</h2>
      {product ? (
        <div className="w-full max-w-md p-4 border rounded bg-white shadow">
          <h2 className="text-lg font-bold">{product.product_name}</h2>
          <p className="text-sm text-gray-600">Brand: {product.brands ?? "Unknown"}</p>
          <ul className="mt-4">
            <li>Energy: {product.nutriments.energy ?? "N/A"} kcal</li>
            <li>Fat: {product.nutriments.fat ?? "N/A"} g</li>
            <li>Cholesterol: {product.nutriments.cholesterol ?? "N/A"} mg</li>
            <li>Proteins: {product.nutriments.proteins ?? "N/A"} g</li>
            <li>Carbohydrates: {product.nutriments.carbohydrates ?? "N/A"} g</li>
            <li>Sodium: {product.nutriments.sodium ?? "N/A"} mg</li>
            <li>Vitamin A: {product.nutriments["vitamin-a"] ?? "N/A"} µg</li>
            <li>Vitamin B1: {product.nutriments["vitamin-b1"] ?? "N/A"} mg</li>
            <li>Vitamin B2: {product.nutriments["vitamin-b2"] ?? "N/A"} mg</li>
            <li>Calcium: {product.nutriments.calcium ?? "N/A"} mg</li>
            <li>Iron: {product.nutriments.iron ?? "N/A"} mg</li>
          </ul>
        </div>
      ) : (
        <p>No product information available.</p>
      )}
      <button
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => router.push("/scan")}
      >
        Back
      </button>
    </div>
  );
}
