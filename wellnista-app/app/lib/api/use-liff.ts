"use client";
import { useEffect, useState } from "react";
import liff from "@line/liff";

export function useLiff() {
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInLineApp, setIsInLineApp] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const initLiff = async () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isLineApp = userAgent.includes("line");

      setIsInLineApp(isLineApp);

      if (isLineApp) {
        try {
          // Initialize LIFF only if not already ready
          if (!isLiffReady) {
            await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || "" });
            setIsLiffReady(true);
          }

          // Check for camera permission
          try {
            const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName });
            setCameraPermission(permissionStatus.state === "granted");
            permissionStatus.onchange = () => {
              setCameraPermission(permissionStatus.state === "granted");
            };
          } catch {
            setCameraPermission(false); // If permissions API not supported
          }
        } catch (err) {
          console.error("LIFF init failed", err);
          setError("Failed to initialize LIFF");
        }
      } else {
        // For non-LIFF usage
        setIsLiffReady(true); // Mark as ready for standard browsers
      }
    };

    initLiff();
  }, [isLiffReady]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
      stream.getTracks().forEach((track) => track.stop()); // Stop the camera after permission is granted
    } catch (err) {
      console.error("Camera permission denied", err);
      setCameraPermission(false);
    }
  };

  return { isLiffReady, error, isInLineApp, cameraPermission, requestCameraPermission, liff };
}
