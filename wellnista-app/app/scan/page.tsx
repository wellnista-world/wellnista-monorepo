"use client";

import { useEffect, useRef, useState } from "react";
import { useLiff } from "../lib/api/use-liff";

export default function ScanPage() {
  const { isLiffReady, error: liffError, isInLineApp, cameraPermission, requestCameraPermission } = useLiff();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLiffReady || !cameraPermission) return;

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

    initCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isLiffReady, cameraPermission]);

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
