import React from "react";

export function StarProgress({ size = 24, fillPercent = 100, className = "" }) {
  const gradientId = `grad-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: "scale(1.2) translate(-1.1px, -1.1px)" }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset={`${fillPercent}%`} stopColor="gold" />
          <stop offset={`${fillPercent}%`} stopColor="lightgray" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 17.27L18.18 21l-1.64-7.03
           L22 9.24l-7.19-.61L12 2 9.19 8.63
           2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  );
}
