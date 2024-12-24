"use client";

import { useLayoutEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";

interface ScannerProps {
  onDetected: (barcode: string) => void;
  facingMode?: string;
}

const Scanner: React.FC<ScannerProps> = ({ onDetected, facingMode = "environment" }) => {
  const scannerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const initScanner = async () => {
      if (!scannerRef.current) {
        console.error("Scanner container not available.");
        return;
      }

      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: {
              facingMode,
              width: 640,
              height: 480,
            },
            target: scannerRef.current, // Ensure this is not null
            willReadFrequently: true,
          },
          locator: {
            patchSize: "medium",
            halfSample: true,
          },
          decoder: {
            readers: ["ean_reader", "ean_8_reader", "code_128_reader"], // Supported barcode formats
          },
          locate: true,
        },
        (err) => {
          if (err) {
            console.error("Quagga initialization failed:", err);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((result) => {
        if (result?.codeResult?.code) {
          const code = result.codeResult.code;
          Quagga.stop();
          onDetected(code);
        }
      });
    };

    initScanner();

    return () => {
      Quagga.stop();
      Quagga.offDetected();
    };
  }, [facingMode, onDetected]);

  return <div ref={scannerRef} style={{ width: "100%", height: "100%" }} />;
};

export default Scanner;
