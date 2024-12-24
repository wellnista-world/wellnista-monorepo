"use client";
import { useEffect, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [controls, setControls] = useState<IScannerControls | null>(null);
  const router = useRouter();

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();

    // Start video scanning
    reader
      .decodeFromVideoDevice(undefined, "video", (result, err) => {
        if (result) {
          setBarcode(result.getText());
        } else if (err && !(err instanceof Error)) {
          setError("No barcode detected, please try again.");
        }
      })
      .then((scannerControls) => {
        // Capture scanner controls to stop it later
        setControls(scannerControls);
      })
      .catch((err) => setError(`Error starting video: ${err.message}`));

    return () => {
      // Stop the scanner on component unmount
      if (controls) {
        controls.stop();
      }
    };
  }, [controls]);

  useEffect(() => {
    if (barcode) {
      router.push(`/scan/result?barcode=${barcode}`);
    }
  }, [barcode, router]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Scan Barcode</h1>
      <video id="video" className="w-full max-w-md border" />
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
