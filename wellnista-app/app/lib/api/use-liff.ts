"use client"; // Ensures this is a client component
import { useEffect, useState } from "react";
import liff from "@line/liff";

export function useLiff() {
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInLineApp, setIsInLineApp] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isLineApp = userAgent.includes("line");

    setIsInLineApp(isLineApp);

    if (isLineApp) {
      // Initialize LIFF only if in LINE environment
      liff
        .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || "" })
        .then(() => {
          setIsLiffReady(true);
        })
        .catch((err) => {
          console.error("LIFF init failed", err);
          setError("Failed to initialize LIFF");
        });
    } else {
      // For non-LIFF usage
      setIsLiffReady(true); // Mark as ready for standard browsers
    }
  }, []);

  return { isLiffReady, error, isInLineApp, liff };
}
