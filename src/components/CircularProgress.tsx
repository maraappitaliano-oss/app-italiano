"use client";
import React from "react";

type Props = {
  value: number; // 0-100
  size?: number; // px
  strokeWidth?: number; // px
  label?: string;
  color?: string; // CSS color or var(--...)
};

export default function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  color = "var(--primary)",
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label={label}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--blue-100)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-bold text-lg" style={{ color: "var(--color-navy-italy)" }}>
          {Math.round(clamped)}%
        </div>
        {label && (
          <div className="text-xs opacity-70" style={{ color: "var(--color-navy-italy)" }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
}