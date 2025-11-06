"use client";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  leadingIcon,
  trailingIcon,
  className,
  children,
  ...rest
}: ButtonProps) {
  const base = "btn-base inline-flex items-center justify-center gap-2";
  const height = size === "sm" ? "h-9 px-3 text-sm" : size === "lg" ? "h-12 px-5 text-base" : "h-10 px-4 text-sm";
  const width = fullWidth ? "w-full" : "";

  let variantClass = "btn-primary";
  if (variant === "secondary") variantClass = "btn-secondary";
  if (variant === "outline") variantClass = "btn-outline";
  if (variant === "ghost") variantClass = "btn-ghost";
  if (variant === "danger") variantClass = "btn-danger";

  return (
    <button className={`${base} ${height} ${width} ${variantClass} ${className ?? ""}`} {...rest}>
      {leadingIcon && <span className="inline-flex">{leadingIcon}</span>}
      <span>{children}</span>
      {trailingIcon && <span className="inline-flex">{trailingIcon}</span>}
    </button>
  );
}