"use client";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export default function Input({ label, hint, error, leftIcon, rightIcon, className, ...rest }: InputProps) {
  return (
    <div className={`w-full ${className ?? ""}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium" style={{ color: "var(--gray-900)", fontFamily: "var(--font-title)" }}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">{leftIcon}</span>}
        <input className="input-ios w-full" style={{ paddingLeft: leftIcon ? 36 : 14, paddingRight: rightIcon ? 36 : 14 }} {...rest} />
        {rightIcon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">{rightIcon}</span>}
      </div>
      {hint && !error && <p className="mt-1 text-xs" style={{ color: "var(--gray-600)" }}>{hint}</p>}
      {error && <p className="mt-1 text-xs" style={{ color: "var(--danger, #E53935)" }}>{error}</p>}
    </div>
  );
}