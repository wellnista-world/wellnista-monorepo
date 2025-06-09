"use client";

import { useEffect, useRef, useState } from "react";
import { useLiff } from "../../lib/api/use-liff";
import { NutritionalInfo } from "../../lib/api/image-analyze";

export default function ScanImagePage() {
  const {
    isLiffReady,
    error: liffError,
    cameraPermission,
    requestCameraPermission,
  } = useLiff();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<NutritionalInfo | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLiffReady || !cameraPermission) return;

    const initCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);

        const backCamera = videoDevices.find((device) =>
          device.label.toLowerCase().includes("back") || device.label.toLowerCase().includes("rear")
        );
        setSelectedCameraId(backCamera?.deviceId || videoDevices[0]?.deviceId);
      } catch (err) {
        console.error("Failed to initialize cameras:", err);
        setCameraError("Failed to access the camera.");
      }
    };

    initCamera();
  }, [isLiffReady, cameraPermission]);

  useEffect(() => {
    if (!selectedCameraId || !videoRef.current) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: selectedCameraId }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Failed to start camera:", err);
        setCameraError("Failed to start camera.");
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [selectedCameraId]);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: capturedImage }),
      });

      const data = await response.json();
      console.log(data);
      if (data === null) {
        setAnalysisError('ไม่พบข้อมูลอาหารในรูปภาพ');
      } else {
        setAnalysisResult(data);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysisError('ไม่สามารถวิเคราะห์รูปภาพได้');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  if (!isLiffReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary text-neutral font-garet">
        <p>Loading LIFF...</p>
      </div>
    );
  }

  if (liffError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary text-red-500 font-garet">
        <p>{liffError}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-secondary text-neutral font-garet">
      <h1 className="mt-6 text-3xl font-magnolia text-primary mb-6">สแกน อาหาร</h1>
      
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
          className="px-6 py-3 bg-primary text-secondary font-semibold rounded-full hover:bg-accent transition mb-4"
        >
          ขออนุญาติเข้าถึงกล้อง
        </button>
      )}

      {cameraError && (
        <p className="text-red-500 text-center mb-4">{cameraError}</p>
      )}

      {cameraPermission && !capturedImage && (
        <>
          <select
            className="mb-8 px-4 py-2 border-2 border-accent rounded-lg bg-muted text-neutral"
            onChange={(e) => setSelectedCameraId(e.target.value)}
            value={selectedCameraId || ""}
          >
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${camera.deviceId}`}
              </option>
            ))}
          </select>
          <video
            ref={videoRef}
            className="w-full max-w-md border-4 border-primary rounded-lg"
            playsInline
            muted
            autoPlay
          />
          <canvas ref={canvasRef} className="hidden" />
          <button
            onClick={captureImage}
            className="mt-4 px-8 py-3 bg-primary text-secondary font-semibold rounded-full hover:bg-accent transition"
          >
            ถ่ายรูป
          </button>
        </>
      )}

      {capturedImage && !analysisResult && (
        <div className="flex flex-col items-center">
          <img
            src={capturedImage}
            alt="Captured food"
            className="w-full max-w-md border-4 border-primary rounded-lg"
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={retakePhoto}
              className="px-6 py-3 bg-muted text-neutral font-semibold rounded-full hover:bg-accent transition"
            >
              ถ่ายใหม่
            </button>
            <button
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="px-6 py-3 bg-primary text-secondary font-semibold rounded-full hover:bg-accent transition"
            >
              {isAnalyzing ? 'กำลังวิเคราะห์...' : 'วิเคราะห์อาหาร'}
            </button>
          </div>
        </div>
      )}

      {analysisResult && (
        <div className="w-full max-w-md p-4 mt-4 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2">ผลการวิเคราะห์</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">ชื่ออาหาร (ไทย):</span> {analysisResult.product_name_th}</p>
            <p><span className="font-semibold">ชื่ออาหาร (อังกฤษ):</span> {analysisResult.product_name_en}</p>
            <p><span className="font-semibold">แบรนด์:</span> {analysisResult.brands}</p>
            {analysisResult.nutriments && (
              <>
                {analysisResult.nutriments["energy-kcal_serving"] && (
                  <p><span className="font-semibold">แคลอรี่:</span> {analysisResult.nutriments["energy-kcal_serving"]} kcal</p>
                )}
                {analysisResult.nutriments.fat && (
                  <p><span className="font-semibold">ไขมัน:</span> {analysisResult.nutriments.fat}g</p>
                )}
                {analysisResult.nutriments.cholesterol && (
                  <p><span className="font-semibold">คอเลสเตอรอล:</span> {analysisResult.nutriments.cholesterol}mg</p>
                )}
                {analysisResult.nutriments.carbohydrates && (
                  <p><span className="font-semibold">คาร์โบไฮเดรต:</span> {analysisResult.nutriments.carbohydrates}g</p>
                )}
                {analysisResult.nutriments["sugars_value"] && (
                  <p><span className="font-semibold">น้ำตาล:</span> {analysisResult.nutriments["sugars_value"]}g</p>
                )}
                {analysisResult.nutriments["proteins_serving"] && (
                  <p><span className="font-semibold">โปรตีน:</span> {analysisResult.nutriments["proteins_serving"]}g</p>
                )}
                {analysisResult.nutriments["sodium_value"] && (
                  <p><span className="font-semibold">โซเดียม:</span> {analysisResult.nutriments["sodium_value"]}mg</p>
                )}
                {analysisResult.nutriments["vitamin-a"] && (
                  <p><span className="font-semibold">วิตามิน A:</span> {analysisResult.nutriments["vitamin-a"]}mcg</p>
                )}
                {analysisResult.nutriments["vitamin-b1"] && (
                  <p><span className="font-semibold">วิตามิน B1:</span> {analysisResult.nutriments["vitamin-b1"]}mg</p>
                )}
                {analysisResult.nutriments["vitamin-b2"] && (
                  <p><span className="font-semibold">วิตามิน B2:</span> {analysisResult.nutriments["vitamin-b2"]}mg</p>
                )}
                {analysisResult.nutriments.calcium && (
                  <p><span className="font-semibold">แคลเซียม:</span> {analysisResult.nutriments.calcium}mg</p>
                )}
                {analysisResult.nutriments.iron && (
                  <p><span className="font-semibold">ธาตุเหล็ก:</span> {analysisResult.nutriments.iron}mg</p>
                )}
              </>
            )}
          </div>
          <button
            onClick={retakePhoto}
            className="mt-4 px-6 py-3 bg-primary text-secondary font-semibold rounded-full hover:bg-accent transition w-full"
          >
            ถ่ายรูปใหม่
          </button>
        </div>
      )}

      {analysisError && (
        <div className="w-full max-w-md p-4 mt-4 bg-muted rounded-lg">
          <p className="text-red-500 text-center">{analysisError}</p>
          <button
            onClick={retakePhoto}
            className="mt-4 px-6 py-3 bg-primary text-secondary font-semibold rounded-full hover:bg-accent transition w-full"
          >
            ถ่ายรูปใหม่
          </button>
        </div>
      )}
    </div>
  );
}
