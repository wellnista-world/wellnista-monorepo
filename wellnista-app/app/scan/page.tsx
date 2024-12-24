"use client";
import { useEffect, useRef, useState } from "react";
import { useLiff } from "../lib/api/use-liff";

export default function ScanPage() {
  const { isLiffReady, error, isInLineApp, cameraPermission, requestCameraPermission } = useLiff();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLiffReady) return;

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera access failed:", err);
        setCameraError("Failed to access the camera. Please check permissions.");
      }
    };

    if (cameraPermission) {
      initCamera();
    }
  }, [isLiffReady, cameraPermission]);

  if (!isLiffReady) {
    return <p>Loading LIFF...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Scan Barcode</h1>
      {isInLineApp && <p className="text-sm text-gray-600">Running in LINE App</p>}
      {!isInLineApp && <p className="text-sm text-gray-600">Running in Browser</p>}
      {cameraPermission === false && (
        <button
          onClick={requestCameraPermission}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Request Camera Permission
        </button>
      )}
      {cameraError && <p className="text-red-500">{cameraError}</p>}
      <video ref={videoRef} className="w-full max-w-md border" playsInline muted />
    </div>
  );
}
