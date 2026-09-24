"use client";

import { useEffect, useRef, useState } from "react";
import { useLiff } from "../../lib/api/use-liff";
import { NutritionalInfo } from "../../lib/api/image-analyze";
import IntroductionStatus from "@/app/components/util/IntroductionStatus";
import IndicatorRow from "@/app/components/util/IndicatorRow";
import RingGauge from '@/app/components/ui/RingGauge';
import { Camera, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/api/supabaseClient";
import { useAuth } from "@/app/lib/context/AuthContext";
import { useI18n } from "../../../i18n";
import Image from 'next/image';
import { UserData } from "@/app/lib/types/user";
import { calculateNutrition, getActivityLevelFromDescription } from "../../lib/utils/nutritionCalculator";

const activitiveLevel: string[] = [
  "ไม่ออกกำลังกาย/นั่งทำงานอยู่กับที่",
  "ออกกำลังกายเล็กน้อย 1-3วัน/สัปดาห์",
  "ออกกำลังกายปานกลาง 3-5วัน/สัปดาห์",
  "ออกกำลังกายหนัก 6-7วัน/สัปดาห์",
  "ออกกำลังกายหนักมาก 2 ครั้ง/วัน เป็นนักกีฬา",
];

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

  // Calculate nutrition using the centralized utility
  const nutritionResult = userData
    ? calculateNutrition({
        gender: (userData.gender || 'ชาย') as 'male' | 'female' | 'ชาย' | 'หญิง',
        age: userData.age || 30,
        weight: userData.weight || 70,
        height: userData.height || 170,
        activityLevel: getActivityLevelFromDescription(userData.activitylevel || activitiveLevel[0]),
      })
    : null;

  const carbGoal = nutritionResult?.carbServings ?? 0;

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

    // Downscale before upload: a full-resolution phone frame as base64 can
    // exceed the 4.5 MB request limit on Vercel, and the model does not need
    // more than ~1280px to identify a dish.
    const MAX_SIDE = 1280;
    const scale = Math.min(1, MAX_SIDE / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg', 0.85);
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

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // The API failed (no credits, no key, model error). Say so instead of
        // pretending the picture had no food in it.
        const code = data?.code as string | undefined;
        const detail = String(data?.error || '');
        let reason = t('scan.errAnalyzer');
        if (code === 'not_configured') reason = t('scan.errNotConfigured');
        else if (/insufficient_quota|credit_balance|billing/i.test(detail)) reason = t('scan.errQuota');
        else if (code === 'bad_response') reason = t('scan.errBadResponse');
        console.error('Food analysis failed:', response.status, code, detail);
        setAnalysisError(`${t('scan.cannotAnalyzeImage')}: ${reason}`);
        return;
      }

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
      <div className="flex min-h-[60vh] items-center justify-center text-ink-muted">
        <p>{t('scan.loadingLiff')}</p>
      </div>
    );
  }

  if (liffError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-danger">
        <p>{liffError}</p>
      </div>
    );
  }

  const n = analysisResult?.nutriments;
  const kcal = n?.["energy-kcal_serving"] ?? 0;
  const protein = n?.proteins_serving ?? 0;
  const carbs = n?.carbohydrates ?? 0;
  const fat = n?.fat ?? 0;
  const sugar = n?.sugars_value ?? 0;
  const sodium = n?.["sodium_value"] ?? 0;
  const score = ((sugar <= 2 ? 1 : 0) + (fat <= 10 ? 1 : 0) + (sodium <= 700 ? 1 : 0)) * 10;
  const carbServings = Math.round(carbs / 15);
  const productName =
    analysisResult?.product_name || analysisResult?.product_name_en || analysisResult?.product_name_th || t('scan.noProductName');

  const macros = [
    { label: t('scan.calories'), value: kcal, max: 700, color: '#cdf565' },
    { label: t('scan.protein'), value: protein, max: 50, color: '#7fe7b6' },
    { label: t('scan.carbohydrates'), value: carbs, max: 75, color: '#a78bfa' },
    { label: t('scan.fat'), value: fat, max: 30, color: '#ffc857' },
  ];

  const details: [string, number | undefined, string][] = [
    [t('scan.fat'), n?.fat, t('scan.grams')],
    [t('scan.sodium'), n?.["sodium_value"], t('scan.milligrams')],
    [t('scan.sugar'), n?.sugars_value, t('scan.grams')],
    [t('scan.carbohydrates'), n?.carbohydrates, t('scan.grams')],
    [t('scan.vitaminA'), n?.["vitamin-a"], t('scan.mg')],
    [t('scan.vitaminB1'), n?.["vitamin-b1"], t('scan.mg')],
    [t('scan.vitaminB2'), n?.["vitamin-b2"], t('scan.mg')],
    [t('scan.calcium'), n?.calcium, t('scan.mg')],
    [t('scan.iron'), n?.iron, t('scan.mg')],
  ];

  return (
    <div className="mx-auto max-w-md pb-6">
      {!analysisResult && (
        <div className="mb-5">
          <p className="wa-eyebrow">{t('navigation.scan')}</p>
          <h1 className="text-2xl font-semibold text-ink">{t('scan.scanFood')}</h1>
        </div>
      )}

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
          className="wa-btn wa-gradient mb-4"
        >
          <Camera size={18} />
          {t('scan.requestCameraPermission')}
        </button>
      )}

      {cameraError && <p className="mb-4 text-center text-sm text-danger">{cameraError}</p>}

      {cameraPermission && !capturedImage && (
        <div className="wa-card overflow-hidden">
          <div className="relative aspect-[3/4] bg-black">
            <video ref={videoRef} className="h-full w-full object-cover" playsInline muted autoPlay />
            <div className="pointer-events-none absolute inset-6 rounded-3xl border-2 border-white/30" />
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex items-center gap-3 p-4">
            {cameras.length > 1 && (
              <select
                className="wa-chip flex-1 appearance-none py-2"
                onChange={(e) => setSelectedCameraId(e.target.value)}
                value={selectedCameraId || ""}
              >
                {cameras.map((camera) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${camera.deviceId}`}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={captureImage}
              className="wa-gradient ml-auto flex h-16 w-16 items-center justify-center rounded-full shadow-[0_10px_24px_rgba(205,245,101,0.35)] ring-4 ring-bg"
              aria-label={t('scan.capturePhoto')}
            >
              <Camera size={26} />
            </button>
          </div>
        </div>
      )}

      {capturedImage && !analysisResult && (
        <div className="wa-card overflow-hidden">
          <Image
            src={capturedImage}
            alt="Captured food"
            width={800}
            height={1000}
            unoptimized
            className="aspect-[3/4] w-full object-cover"
          />
          <div className="flex gap-3 p-4">
            <button onClick={retakePhoto} className="wa-btn wa-btn--ghost">
              {t('scan.retakePhoto')}
            </button>
            <button onClick={analyzeImage} disabled={isAnalyzing} className="wa-btn wa-gradient">
              {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {isAnalyzing ? t('scan.analyzing') : t('scan.analyzeFood')}
            </button>
          </div>
        </div>
      )}

      {analysisResult && (
        <div>
          {/* Hero photo with health score */}
          <div className="wa-card relative mb-4 overflow-hidden">
            {capturedImage ? (
              <Image
                src={capturedImage}
                alt={productName}
                width={800}
                height={800}
                unoptimized
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center text-ink-muted">{t('scan.noImage')}</div>
            )}
            <span className="wa-chip wa-chip--active absolute left-4 top-4">
              <Sparkles size={12} />
              {score} {t('scan.points')}
            </span>
          </div>

          {/* Macro rings */}
          <div className="mb-4 grid grid-cols-4 gap-2">
            {macros.map((m) => (
              <div key={m.label} className="wa-card flex flex-col items-center gap-1 px-1 py-3">
                <RingGauge value={m.value / m.max} size={56} stroke={6} color={m.color}>
                  <span className="text-xs font-bold text-ink">{Math.round(m.value)}</span>
                </RingGauge>
                <span className="text-[10px] text-ink-muted">{m.label}</span>
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-semibold text-ink">{productName}</h1>
          <p className="mb-4 text-sm text-ink-muted">
            {kcal} kcal · {carbServings}/{Math.round(carbGoal)} {t('profile.carb')}
          </p>

          {/* AI analysis: traffic lights */}
          <div className="wa-card mb-4 p-4">
            <p className="wa-eyebrow mb-3">{t('scan.aiAnalysis')}</p>
            <IntroductionStatus />
            <div className="space-y-3">
              <IndicatorRow label={t('scan.sugar')} value={sugar} unit={t('scan.grams')} thresholds={[2, 7]} />
              <IndicatorRow label={t('scan.sodium')} value={sodium} unit={t('scan.milligrams')} thresholds={[700, 1050]} />
              <IndicatorRow label={t('scan.fat')} value={fat} unit={t('scan.grams')} thresholds={[10, 13]} />
            </div>
          </div>

          {/* Carb servings against the personal goal */}
          <div className="wa-card mb-4 flex items-center gap-4 p-4">
            <RingGauge value={carbGoal ? carbServings / carbGoal : 0} size={72} stroke={7}>
              <span className="text-sm font-bold text-ink">{carbServings}</span>
            </RingGauge>
            <div>
              <p className="font-semibold text-ink">{t('scan.carbAmount')}</p>
              <p className="text-xs text-ink-muted">
                {carbServings}/{Math.round(carbGoal)} {t('profile.carb')}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="wa-card mb-4 p-4">
            <p className="mb-2 font-semibold text-ink">{t('scan.nutritionalInfo')}</p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              {details.map(([label, value, unit]) => (
                <div key={label} className="flex justify-between gap-2">
                  <dt className="text-ink-muted">{label}</dt>
                  <dd className="text-ink">
                    {value ?? t('scan.noData')} {value !== undefined ? unit : ''}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <button onClick={handleEat} className="wa-btn wa-gradient">
              {t('scan.ate')}
            </button>
            <button onClick={() => router.push("/scan")} className="wa-btn wa-btn--danger">
              {t('scan.didNotEat')}
            </button>
          </div>
          <button onClick={retakePhoto} className="wa-btn wa-btn--ghost">
            {t('scan.takeNewPhoto')}
          </button>
        </div>
      )}

      {analysisError && (
        <div className="wa-card mt-4 p-4">
          <p className="text-center text-sm text-danger">{analysisError}</p>
          <button onClick={retakePhoto} className="wa-btn wa-btn--ghost mt-4">
            {t('scan.retakePhoto')}
          </button>
        </div>
      )}
    </div>
  );
}
