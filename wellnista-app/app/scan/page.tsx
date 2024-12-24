"use client";
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { useRouter } from "next/navigation";
import { useLiff } from "../lib/api/use-liff";


export default function ScanPage() {
  const { isLiffReady, error: liffError, cameraPermission, requestCameraPermission } = useLiff();
  const [barcode, setBarcode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scannerControls, setScannerControls] = useState<IScannerControls | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLiffReady) return; // Wait until LIFF is ready

    const initCameraAndScanner = async () => {
      try {
        if (!cameraPermission) {
          await requestCameraPermission(); // Request camera permission if not granted
        }

        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });

        if (videoRef.current) {
          // Attach the stream to the video element
          videoRef.current.srcObject = stream;
          await videoRef.current.play(); // Ensure the video starts playing
        }

        // Initialize the barcode scanner
        const codeReader = new BrowserMultiFormatReader();
        const controls = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result, err) => {
            if (result) {
              setBarcode(result.getText());
            } else if (err && !(err instanceof Error)) {
              setError("No barcode detected, please try again.");
            }
          }
        );

        // Save the scanner controls to stop later
        setScannerControls(controls);
      } catch (err) {
        console.error("Camera initialization failed:", err);
        setError("Failed to access the camera. Please check your permissions.");
      }
    };

    initCameraAndScanner();

    return () => {
      // Stop scanner and release camera when component unmounts
      if (scannerControls) {
        scannerControls.stop();
      }

      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isLiffReady, cameraPermission, scannerControls, requestCameraPermission]);

  useEffect(() => {
    if (barcode) {
      router.push(`/scan/result?barcode=${barcode}`);
    }
  }, [barcode, router]);

  if (!isLiffReady) {
    return <p>Loading LIFF...</p>;
  }

  if (liffError) {
    return <p className="text-red-500">{liffError}</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Scan Barcode</h1>
      {cameraPermission === null && <p>Checking camera permission...</p>}
      {cameraPermission === false && (
        <p className="text-red-500">Camera permission denied. Please enable it in your browser settings.</p>
      )}
      {cameraPermission && (
        <video
          ref={videoRef}
          id="video"
          className="w-full max-w-md border"
          playsInline
          muted
        />
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
