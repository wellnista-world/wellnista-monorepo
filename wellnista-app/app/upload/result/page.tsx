"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProductByBarcode } from "@/app/lib/api/image-analyze";


export default function ResultPage() {
  const searchParams = useSearchParams();
  const barcode = searchParams.get("barcode");
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (barcode) {
      fetchProductByBarcode(barcode)
        .then((data) => {
          if (data) {
            setProduct(data);
          } else {
            setError("Product not found.");
          }
        })
        .catch(() => setError("Failed to fetch product data."))
        .finally(() => setLoading(false));
    }
  }, [barcode]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Product Information</h1>
      {product ? (
        <div className="w-full max-w-md p-4 border rounded bg-white shadow">
          <h2 className="text-lg font-bold">{product.product_name}</h2>
          <p className="text-sm text-gray-600">{product.brands}</p>
          <ul className="mt-4">
            {product.nutriments && (
              <>
                <li>Energy: {product.nutriments["energy-kcal"]} kcal</li>
                <li>Fat: {product.nutriments.fat} g</li>
                <li>Carbohydrates: {product.nutriments.carbohydrates} g</li>
                <li>Protein: {product.nutriments.proteins} g</li>
              </>
            )}
          </ul>
        </div>
      ) : (
        <p>No product information available.</p>
      )}
    </div>
  );
}
