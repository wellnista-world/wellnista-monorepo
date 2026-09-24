"use client";

import type { ReactNode } from "react";

interface RingGaugeProps {
  /** 0..1 fraction of the ring to fill. */
  value: number;
  size?: number;
  stroke?: number;
  /** Solid colour for the arc; defaults to the lime → mint gradient. */
  color?: string;
  trackColor?: string;
  className?: string;
  children?: ReactNode;
}

// Circular progress ring with content in the middle (kcal, BMI, macros…).
export default function RingGauge({
  value,
  size = 96,
  stroke = 8,
  color,
  trackColor = "rgba(255,255,255,0.08)",
  className = "",
  children,
}: RingGaugeProps) {
  const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const gradientId = `ring-grad-${size}-${stroke}`;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cdf565" />
            <stop offset="100%" stopColor="#7fe7b6" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color || `url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
        {children}
      </div>
    </div>
  );
}
