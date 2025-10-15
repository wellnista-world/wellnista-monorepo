"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MarketPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the existing product page
    router.replace("/product");
  }, [router]);

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet flex items-center justify-center">
      <div className="text-center">
        <div className="loading primary mb-4" />
        <p>Redirecting to market...</p>
      </div>
    </div>
  );
} 