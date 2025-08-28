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
import { useI18n } from "../../../i18n";
import Image from 'next/image';
import { UserData } from "@/app/lib/types/user";

const activitiveLevel: string[] = [
  "ไม่ออกกำลังกาย/นั่งทำงานอยู่กับที่",
  "ออกกำลังกายเล็กน้อย 1-3วัน/สัปดาห์",
  "ออกกำลังกายปานกลาง 4-5วัน/สัปดาห์",
  "ออกกำลังกายหนัก 6-7วัน/สัปดาห์",
  "ออกกำลังกายหนักมาก 2 ครั้ง/วัน เป็นนักกีฬา",
];

const activitiveLevelValue: number[] = [1.2, 1.375, 1.55, 1.725, 1.9];

export default function ScanImagePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, locale } = useI18n();
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

  const [userData, setUserData] = useState<UserData | null>(null);
  useEffect(() => {
    if (!user?.id || userData) return;
    const fetchUserData = async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setUserData(data);
    };
    fetchUserData();
  }, [user, userData]);

  // TEDD calculation for carb goal (same as profile page)
  const teddMan =
    (66 + 13.7 * (userData?.weight ?? 0) + 5 * (userData?.height ?? 0) - 6.8) *
    activitiveLevelValue[
      activitiveLevel.indexOf(userData?.activitylevel ?? "")
    ];

  const teddWoman =
    (655 +
      9.6 * (userData?.weight ?? 0) +
      1.8 * (userData?.height ?? 0) -
      4.7) *
    activitiveLevelValue[
      activitiveLevel.indexOf(userData?.activitylevel ?? "")
    ];

  // carbGoal calculation (same as profile page)
  const carbGoalWithTedd = userData?.gender === "ชาย" ? teddMan : teddWoman;
  const carbGoal = ((carbGoalWithTedd * 0.2) / 4) / 15;

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
        setCameraError(t('scan.failedToAccessCamera'));
      }
    };

    initCamera();
  }, [isLiffReady, cameraPermission, t]);

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
        setCameraError(t('scan.failedToStartScanning'));
      }
    };

    startCamera();

    return () => {
      const videoElement = videoRef.current;
      if (videoElement && videoElement.srcObject) {
        const tracks = (videoElement.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [selectedCameraId, t]);

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
        body: JSON.stringify({ 
          image: capturedImage,
          language: locale 
        }),
      });

      const data = await response.json();
      console.log(data);
      if (data === null) {
        setAnalysisError(t('scan.noFoodDataInImage'));
      } else {
        setAnalysisResult(data);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysisError(t('scan.cannotAnalyzeImage'));
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
      protein_per_serving_g: analysisResult.nutriments.proteins_serving,
      total_carbohydrates_per_serving_g: analysisResult.nutriments.carbohydrates,
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
    console.log(nutritionId);

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
      router.push("/profile");
    }
  };

  if (!isLiffReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary text-neutral font-garet">
        <p>{t('scan.loadingLiff')}</p>
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
      <h1 className="mt-6 text-3xl font-magnolia text-primary mb-6">{t('scan.scanFood')}</h1>
      
      {cameraPermission === false && (
        <button
          onClick={async () => {
            try {
              await requestCameraPermission();
            } catch (err) {
              console.error("Failed to request camera permission:", err);
              setCameraError(t('scan.cameraError'));
            }
          }}
          className="px-6 py-3 bg-primary text-secondary font-semibold rounded-full hover:bg-accent transition mb-4"
        >
          {t('scan.requestCameraPermission')}
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
            {t('scan.capturePhoto')}
          </button>
        </>
      )}

      {capturedImage && !analysisResult && (
        <div className="flex flex-col items-center">
          <Image
            src={capturedImage}
            alt="Captured food"
            width={400}
            height={300}
            className="w-full max-w-md border-4 border-primary rounded-lg"
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={retakePhoto}
              className="px-6 py-3 bg-muted text-neutral font-semibold rounded-full hover:bg-accent transition"
            >
              {t('scan.retakePhoto')}
            </button>
            <button
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="px-6 py-3 bg-primary text-secondary font-semibold rounded-full hover:bg-accent transition"
            >
              {isAnalyzing ? t('scan.analyzing') : t('scan.analyzeFood')}
            </button>
          </div>
        </div>
      )}

      {analysisResult && (
        <div className="flex flex-col min-h-screen bg-secondary text-neutral font-garet p-4">
          <p className="text-3xl font-bold mb-4">
            {analysisResult.product_name || analysisResult.product_name_en || analysisResult.product_name_th || t('scan.noProductName')}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-full w-full h-full items-center">
              {capturedImage ? (
                <Image
                  src={capturedImage}
                  alt={analysisResult.product_name || analysisResult.product_name_en || t('scan.noImage')}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center bg-gray-200 rounded-lg h-full">
                  <p>{t('scan.noImage')}</p>
                </div>
              )}
            </div>
            <div className="flex items-center mb-4 justify-center">
              <p className="text-3xl font-bold ml-4">
                {(() => {
                  const sugarValue = analysisResult.nutriments.sugars_value ?? 0;
                  const fatValue = analysisResult.nutriments.fat ?? 0;
                  const sodiumValue = analysisResult.nutriments["sodium_value"] ?? 0;
                  let greenStarCount = 0;
                  if (sugarValue >= 0 && sugarValue <= 2) greenStarCount++;
                  if (fatValue >= 0 && fatValue <= 10) greenStarCount++;
                  if (sodiumValue >= 0 && sodiumValue <= 700) greenStarCount++;
                  return `${greenStarCount * 10} ${t('scan.points')}`;
                })()}
              </p>
            </div>
          </div>

          <IntroductionStatus />
          <Box className="flex flex-col space-y-6 mb-6 w-full max-w-md">
            <IndicatorRow label={t('scan.sugar')} value={analysisResult.nutriments.sugars_value || 0} thresholds={[2, 7]} />
            <IndicatorRow label={t('scan.sodium')} value={analysisResult.nutriments["sodium_value"] || 0} thresholds={[700, 1050]} />
            <IndicatorRow label={t('scan.fat')} value={analysisResult.nutriments.fat || 0} thresholds={[10, 13]} />
          </Box>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow w-full text-lg font-bold">
              <p>{t('scan.calories')}: {analysisResult.nutriments["energy-kcal_serving"] || t('scan.noData')} kcal</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow w-full text-lg font-bold">
              <p>{t('scan.protein')}: {analysisResult.nutriments.proteins_serving || t('scan.noData')} {t('scan.grams')}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full gap-6">
            <div className="flex flex-col items-start bg-white p-4 rounded-lg shadow w-full">
              <h2 className="text-lg font-bold mb-2">{t('scan.nutritionalInfo')}</h2>
              <ul className="text-sm space-y-1">
                <li>{t('scan.fat')}: {analysisResult.nutriments.fat || 0} {t('scan.grams')}</li>
                <li>{t('scan.sodium')}: {analysisResult.nutriments["sodium_value"] || 0} {t('scan.milligrams')}</li>
                <li>{t('scan.sugar')}: {analysisResult.nutriments.sugars_value || 0} {t('scan.grams')}</li>
                <li>{t('scan.carbohydrates')}: {analysisResult.nutriments.carbohydrates || 0} {t('scan.grams')}</li>
                <li>{t('scan.vitaminA')}: {analysisResult.nutriments["vitamin-a"] || t('scan.noData')} {t('scan.mg')}</li>
                <li>{t('scan.vitaminB1')}: {analysisResult.nutriments["vitamin-b1"] || t('scan.noData')} {t('scan.mg')}</li>
                <li>{t('scan.vitaminB2')}: {analysisResult.nutriments["vitamin-b2"] || t('scan.noData')} {t('scan.mg')}</li>
                <li>{t('scan.calcium')}: {analysisResult.nutriments.calcium || t('scan.noData')} {t('scan.mg')}</li>
                <li>{t('scan.iron')}: {analysisResult.nutriments.iron || t('scan.noData')} {t('scan.mg')}</li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow w-full mb-8">
              <h2 className="text-lg font-bold mb-2">{t('scan.carbAmount')}</h2>
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
                    strokeDasharray={`${Math.min(((analysisResult.nutriments.carbohydrates ?? 0) / 15) / carbGoal * 100, 100)}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#9F9260"
                    strokeWidth="3"
                  />
                </svg>
              </div>
              <p className="text-sm text-neutral">
                {Math.round((analysisResult.nutriments.carbohydrates ?? 0) / 15)}/{Math.round(carbGoal)} {t('profile.carb')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 grid-flow-col gap-4 mb-6">
            <div>
              <button
                onClick={handleEat}
                className="px-6 py-3 w-full bg-[#5EC269] text-neutral text-xl font-semibold rounded-lg hover:bg-accent transition">
                {t('scan.ate')}
              </button>
            </div>
            <div>
              <button
                onClick={() => router.push("/scan")}
                className="px-6 py-3 w-full bg-[#DD524C] text-neutral text-xl font-semibold rounded-lg hover:bg-accent transition">
                {t('scan.didNotEat')}
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={retakePhoto}
              className="px-6 py-3 bg-primary text-secondary font-semibold rounded-full hover:bg-accent transition"
            >
              {t('scan.takeNewPhoto')}
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
            {t('scan.retakePhoto')}
          </button>
        </div>
      )}
    </div>
  );
}
