"use client";
import React from "react";

type Props = {
  children: React.ReactElement;
  size?: number;
  color?: string;
};

export default function Icon({ children, size = 20, color = "var(--gray-900)" }: Props) {
  return (
    <span className="inline-flex items-center justify-center" style={{ width: size, height: size, color }}>
      {React.cloneElement(children, { size, color })}
    </span>
  );
}