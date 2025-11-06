"use client";
import React from "react";

type Props = { value: number; trackColor?: string; fillColor?: string };

export default function ProgressBar({ value, trackColor, fillColor }: Props) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="progress-track w-full" style={trackColor ? { background: trackColor } : undefined}>
      <div className="progress-fill" style={{ width: `${clamped}%`, ...(fillColor ? { background: fillColor } : {}) }} />
    </div>
  );
}