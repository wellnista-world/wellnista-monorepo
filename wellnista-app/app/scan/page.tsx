"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { useRouter } from "next/navigation";
import { useLiff } from "../lib/api/use-liff";

export default function ScanPage() {
  const {
    isLiffReady,
    error: liffError,
    isInLineApp,
    cameraPermission,
    requestCameraPermission,
  } = useLiff();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [codeReader, setCodeReader] = useState<BrowserMultiFormatReader>();
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLiffReady || !cameraPermission || codeReader) return;

    const initScanner = async () => {
      try {
        const reader = new BrowserMultiFormatReader();
        setCodeReader(reader);

        const videoInputDevices = await reader.listVideoInputDevices();
        setCameras(videoInputDevices);

        const backCamera = videoInputDevices.find((device) =>
          device.label.toLowerCase().includes("back") || device.label.toLowerCase().includes("rear")
        );
        setSelectedCameraId(backCamera?.deviceId || videoInputDevices[0]?.deviceId);
      } catch (err) {
        console.error("Failed to initialize cameras:", err);
        setCameraError("Failed to access the camera.");
      }
    };

    initScanner();
  }, [isLiffReady, cameraPermission, codeReader]);

  useEffect(() => {
    if (!selectedCameraId || !videoRef.current || !codeReader) return;

    const startScanner = async () => {
      try {
        await codeReader.decodeFromVideoDevice(
          selectedCameraId,
          videoRef.current!,
          (result, err) => {
            if (result) {
              const barcode = result.getText();
              codeReader.stopContinuousDecode();
              router.push(`/scan/result?barcode=${barcode}`);
            } else if (err && !(err instanceof NotFoundException)) {
              console.error("Barcode scanning error:", err);
            }
          }
        );
      } catch (err) {
        console.error("Failed to start scanning:", err);
        setCameraError("Failed to start scanning.");
      }
    };

    startScanner();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [selectedCameraId, codeReader, router]);

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
        <>
          <select
            className="mb-4 px-4 py-2 border rounded"
            onChange={(e) => setSelectedCameraId(e.target.value)}
            value={selectedCameraId || ""}
          >
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${camera.deviceId}`}
              </option>
            ))}
          </select>
          <video ref={videoRef} className="w-full max-w-md border" playsInline muted />
        </>
      )}
    </div>
  );
}
