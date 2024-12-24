"use client";
import { useEffect, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [controls, setControls] = useState<IScannerControls | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkPermissionsAndStartScanner = async () => {
      try {
        // Check camera permission
        const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName });
        setCameraPermission(permissionStatus.state === "granted");

        if (permissionStatus.state !== "granted") {
          // Request permission using getUserMedia
          await navigator.mediaDevices.getUserMedia({ video: true });
          setCameraPermission(true);
        }

        // Start scanning
        const reader = new BrowserMultiFormatReader();
        const scannerControls = await reader.decodeFromVideoDevice(
          undefined,
          "video",
          (result, err) => {
            if (result) {
              setBarcode(result.getText());
            } else if (err && !(err instanceof Error)) {
              setError("No barcode detected, please try again.");
            }
          }
        );

        // Set controls to stop scanner later
        setControls(scannerControls);
      } catch (err) {
        console.error("Camera permission error:", err);
        setError("Failed to access the camera. Please check your permissions.");
        setCameraPermission(false);
      }
    };

    checkPermissionsAndStartScanner();

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
      {cameraPermission === null && <p>Checking camera permission...</p>}
      {cameraPermission === false && (
        <p className="text-red-500">Camera permission denied. Please enable it in your browser settings.</p>
      )}
      {cameraPermission && <video id="video" className="w-full max-w-md border" />}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
