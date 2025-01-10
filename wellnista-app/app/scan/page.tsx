"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { useRouter } from "next/navigation";
import { useLiff } from "../lib/api/use-liff";

export default function ScanPage() {
  const { isLiffReady, error: liffError, isInLineApp, cameraPermission, requestCameraPermission } = useLiff();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scannerControls, setScannerControls] = useState<BrowserMultiFormatReader | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLiffReady || !cameraPermission) return;

    const initScanner = async () => {
      try {
        const codeReader = new BrowserMultiFormatReader();
        setScannerControls(codeReader);

        const videoInputDevices = await codeReader.listVideoInputDevices();
        const selectedDeviceId = videoInputDevices[0]?.deviceId;

        if (!selectedDeviceId) {
          throw new Error("No video input devices found.");
        }

        await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          (result, err) => {
            if (result) {
              const barcode = result.getText();
              codeReader.reset(); // Stop scanning once a barcode is found
              router.push(`/scan/result?barcode=${barcode}`); // Navigate to result page
            } else if (err && !(err instanceof NotFoundException)) {
              console.error("Barcode scanning error:", err);
            }
          }
        );

        console.log(`Started continuous decode from camera with device id: ${selectedDeviceId}`);
      } catch (err) {
        console.error("Failed to initialize barcode scanner:", err);
        setCameraError("Failed to access the camera or start scanning.");
      }
    };

    initScanner();

    return () => {
      // Stop scanner and release camera when unmounting
      if (scannerControls) {
        scannerControls.reset();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isLiffReady, cameraPermission, scannerControls, router]);

  if (!isLiffReady) {
    return <p>Loading LIFF...</p>;
  }

  if (liffError) {
    return <p className="text-red-500">{liffError}</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Scan Barcode</h1>
      {isInLineApp && <p className="text-sm text-gray-600">Running in LINE App</p>}
      {!isInLineApp && <p className="text-sm text-gray-600">Running in Browser</p>}
      {cameraPermission === false && (
        <button
          onClick={async () => {
            try {
              await requestCameraPermission();
            } catch (err) {
              console.error("Failed to request camera permission:", err);
              setCameraError("Unable to access the camera. Please check settings.");
            }
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Request Camera Permission
        </button>
      )}
      {cameraError && <p className="text-red-500 mt-4">{cameraError}</p>}
      {cameraPermission && (
        <video ref={videoRef} className="w-full max-w-md border" playsInline muted />
      )}
    </div>
  );
}
