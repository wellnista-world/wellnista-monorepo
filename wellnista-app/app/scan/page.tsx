"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Scanner from "../component/scaner";


export default function ScanPage() {
  const [scanning, setScanning] = useState(true);
  const router = useRouter();

  const handleDetected = (barcode: string) => {
    console.log("Detected barcode:", barcode);
    setScanning(false); // Stop scanning
    router.push(`/scan/result?barcode=${barcode}`);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Scan Barcode</h1>
      {scanning ? (
        <div className="w-full max-w-md border" style={{ height: "400px" }}>
          <Scanner onDetected={handleDetected} />
        </div>
      ) : (
        <p>Redirecting to result page...</p>
      )}
    </div>
  );
}
