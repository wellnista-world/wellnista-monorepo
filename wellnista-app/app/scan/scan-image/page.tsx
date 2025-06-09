"use client";

import { useEffect, useRef, useState } from "react";
import { useLiff } from "../../lib/api/use-liff";
import { NutritionalInfo } from "../../lib/api/image-analyze";
import IntroductionStatus from "@/app/components/util/IntroductionStatus";
import IndicatorRow from "@/app/components/util/IndicatorRow";
import Box from '@mui/material/Box';
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/api/supabaseClient";
import { useAuth } from "@/app/lib/context/AuthContext";

export default function ScanImagePage() {
  const router = useRouter();
  const { user } = useAuth();
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

  const handleEat = async () => {
    if (!analysisResult) return;

    // 1. Map product to NutritionData
    const nutritionData = {
      food_name_thai: analysisResult.product_name_th,
      food_name_eng: analysisResult.product_name_en,
      food_image: capturedImage,
      total_calories_kcal: analysisResult.nutriments["energy-kcal_serving"],
      total_sugar: analysisResult.nutriments.sugars_value,
      total_fat_g: analysisResult.nutriments.fat,
      total_sodium_mg: analysisResult.nutriments["sodium_value"],
      food_category: "อาหาร",
      timestamp: new Date().toISOString(),
      carbohydrates_per_serving_g: analysisResult.nutriments.carbohydrates,
    };

    // 2. Insert into nutritional_data
    const { data: inserted, error: insertError } = await supabase
      .from("nutrition_data")
      .insert([nutritionData])
      .select();

    if (insertError) {
      console.error("Failed to save nutritional data:", insertError);
      return;
    }

    const nutritionId = inserted?.[0]?.id;

    // 3. Insert into food_scan_history
    const { error: historyError } = await supabase
      .from("food_scan_history")
      .insert({
        scanned_at: new Date(),
        user_id: user?.id,
        nutrition_id: nutritionId,
      });

    if (historyError) {
      console.error("Failed to save scan history:", historyError);
    } else {
      console.log("Scan history saved!");
      router.push("/scan");
    }
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
        <div className="flex flex-col min-h-screen bg-secondary text-neutral font-garet p-4">
          <p className="text-3xl font-bold mb-4">
            {analysisResult.product_name_th || analysisResult.product_name_en || analysisResult.product_name || "ไม่มีชื่อผลิตภัณฑ์"}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-full w-full h-full items-center">
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt={analysisResult.product_name_en || "รูปภาพของผลิตภัณฑ์"}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center bg-gray-200 rounded-lg h-full">
                  <p>ไม่มีรูปภาพ</p>
                </div>
              )}
            </div>
            <div className="flex items-center mb-4 justify-center">
              <p className="text-3xl font-bold ml-4">0 point</p>
            </div>
          </div>

          <IntroductionStatus />
          <Box className="flex flex-col space-y-6 mb-6 w-full max-w-md">
            <IndicatorRow label="น้ำตาล" value={analysisResult.nutriments.sugars_value || 0} thresholds={[2, 7]} />
            <IndicatorRow label="โซเดียม" value={analysisResult.nutriments["sodium_value"] || 0} thresholds={[700, 1050]} />
            <IndicatorRow label="ไขมัน" value={analysisResult.nutriments.fat || 0} thresholds={[10, 13]} />
          </Box>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow w-full text-lg font-bold">
              <p>แคลอรี่: {analysisResult.nutriments["energy-kcal_serving"] || "ไม่มีข้อมูล"} kcal</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow w-full text-lg font-bold">
              <p>โปรตีน: {analysisResult.nutriments.proteins_serving || "ไม่มีข้อมูล"} กรัม</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full gap-6">
            <div className="flex flex-col items-start bg-white p-4 rounded-lg shadow w-full">
              <h2 className="text-lg font-bold mb-2">ข้อมูลทางโภชนาการ</h2>
              <ul className="text-sm space-y-1">
                <li>ไขมัน: {analysisResult.nutriments.fat || 0} กรัม</li>
                <li>โซเดียม: {analysisResult.nutriments["sodium_value"] || 0} มิลลิกรัม</li>
                <li>น้ำตาล: {analysisResult.nutriments.sugars_value || 0} กรัม</li>
                <li>คาร์โบไฮเดรต: {analysisResult.nutriments.carbohydrates || 0} กรัม</li>
                <li>วิตามินเอ: {analysisResult.nutriments["vitamin-a"] || "ไม่มีข้อมูล"} มก.</li>
                <li>วิตามินบี1: {analysisResult.nutriments["vitamin-b1"] || "ไม่มีข้อมูล"} มก.</li>
                <li>วิตามินบี2: {analysisResult.nutriments["vitamin-b2"] || "ไม่มีข้อมูล"} มก.</li>
                <li>แคลเซียม: {analysisResult.nutriments.calcium || "ไม่มีข้อมูล"} มก.</li>
                <li>ธาตุเหล็ก: {analysisResult.nutriments.iron || "ไม่มีข้อมูล"} มก.</li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow w-full mb-8">
              <h2 className="text-lg font-bold mb-2">ปริมาณคาร์บ</h2>
              <div className="w-24 h-24 mb-4">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    className="circle"
                    strokeDasharray="0, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#9F9260"
                    strokeWidth="3"
                  />
                </svg>
              </div>
              <p className="text-sm text-neutral">
                0 คาร์บ (0% ของ 8 คาร์บสูงสุด)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 grid-flow-col gap-4 mb-6">
            <div>
              <button
                onClick={handleEat}
                className="px-6 py-3 w-full bg-[#5EC269] text-neutral text-xl font-semibold rounded-lg hover:bg-accent transition">
                กินแล้ว
              </button>
            </div>
            <div>
              <button
                onClick={() => router.push("/scan")}
                className="px-6 py-3 w-full bg-[#DD524C] text-neutral text-xl font-semibold rounded-lg hover:bg-accent transition">
                ไม่ได้กิน
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={retakePhoto}
              className="px-6 py-3 bg-primary text-secondary font-semibold rounded-full hover:bg-accent transition"
            >
              ถ่ายรูปใหม่
            </button>
          </div>
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
