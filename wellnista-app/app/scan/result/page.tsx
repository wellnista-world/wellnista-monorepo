"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface NutritionalInfo {
  product_name: string;
  brands: string;
  nutriments: {
    energy?: number;
    fat?: number;
    carbohydrates?: number;
    proteins?: number;
  };
}

export default function ResultPage() {
  const searchParams = useSearchParams();
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
        const response = await fetch(`/api/get-product?barcode=${barcode}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }

        const data = await response.json();
        if (!data.product_name || !data.nutriments) {
          throw new Error("Incomplete product data");
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
          <p className="text-sm text-gray-600">{product.brands}</p>
          <ul className="mt-4">
            <li>Energy: {product.nutriments.energy ?? "N/A"} kcal</li>
            <li>Fat: {product.nutriments.fat ?? "N/A"} g</li>
            <li>Carbohydrates: {product.nutriments.carbohydrates ?? "N/A"} g</li>
            <li>Proteins: {product.nutriments.proteins ?? "N/A"} g</li>
          </ul>
        </div>
      ) : (
        <p>No product information available.</p>
      )}
    </div>
  );
}
