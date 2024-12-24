"use client";
import { useEffect, useState } from "react";
import liff from "@line/liff";

export function useLiff() {
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize LIFF
    liff
      .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || "" })
      .then(() => {
        setIsLiffReady(true);
      })
      .catch((err) => {
        console.error("LIFF init failed", err);
        setError("Failed to initialize LIFF");
      });
  }, []);

  return { isLiffReady, error, liff };
}
