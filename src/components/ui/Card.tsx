"use client";
import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  clickable?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "soft";
};

export default function Card({ clickable, header, footer, variant = "default", className, children, ...rest }: CardProps) {
  return (
    <div
      className={`${variant === "soft" ? "card-soft" : "card-ios"} ${clickable ? "card-clickable cursor-pointer transition-transform hover:-translate-y-0.5" : ""} ${className ?? ""}`}
      style={{}}
      {...rest}
    >
      {header && <div className="px-4 pt-4">{header}</div>}
      <div className="p-4">{children}</div>
      {footer && <div className="px-4 pb-4">{footer}</div>}
    </div>
  );
}