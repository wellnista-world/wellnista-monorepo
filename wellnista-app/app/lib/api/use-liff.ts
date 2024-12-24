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
      try {
        const userAgent = navigator.userAgent.toLowerCase();
        const isLineApp = userAgent.includes("line");

        setIsInLineApp(isLineApp);

        if (isLineApp) {
          // Initialize LIFF only if not already initialized
          if (!isLiffReady) {
            await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || "" });
            setIsLiffReady(true);
          }
        } else {
          // For non-LIFF usage (browser)
          setIsLiffReady(true);
        }

        // Check for camera permission
        if (navigator.permissions) {
          const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName });
          setCameraPermission(permissionStatus.state === "granted");

          // Listen for permission changes
          permissionStatus.onchange = () => {
            setCameraPermission(permissionStatus.state === "granted");
          };
        } else {
          // Permissions API not supported
          console.warn("Permissions API not supported. Defaulting to false.");
          setCameraPermission(false);
        }
      } catch (err) {
        console.error("Error during LIFF initialization or permission check:", err);
        setError("Failed to initialize LIFF or check permissions.");
      }
    };

    initLiff();
  }, [isLiffReady]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);

      // Stop the camera after permission is granted
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.error("Camera permission denied:", err);
      setCameraPermission(false);
      setError("Camera permission denied. Please enable it in your device settings.");
    }
  };

  return { isLiffReady, error, isInLineApp, cameraPermission, requestCameraPermission, liff };
}
