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
          // Try to initialize LIFF, but don't block the app if it fails
          try {
            await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || "" });
          } catch (liffErr) {
            console.warn("LIFF init failed, continuing without LIFF:", liffErr);
          }
        }

        // Always set ready to true so app doesn't get stuck
        setIsLiffReady(true);

        // Check for camera permission
        if (navigator.permissions) {
          try {
            const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName });
            setCameraPermission(permissionStatus.state === "granted");

            // Listen for permission changes
            permissionStatus.onchange = () => {
              setCameraPermission(permissionStatus.state === "granted");
            };
          } catch {
            // Some browsers don't support camera permission query
            setCameraPermission(false);
          }
        } else {
          // Permissions API not supported
          console.warn("Permissions API not supported. Defaulting to false.");
          setCameraPermission(false);
        }
      } catch (err) {
        console.error("Error during initialization:", err);
        setError("Failed to initialize.");
        // Still set ready to true so app doesn't get stuck on loading
        setIsLiffReady(true);
      }
    };

    initLiff();
  }, []);

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
