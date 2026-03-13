import React from "react";

export default function FeatureGate({
  canUse,
  children,
  message = "Tính năng yêu cầu nâng cấp gói",
}) {
  return (
    <div className={`relative ${canUse ? "" : "pointer-events-none"}`}>
      {children}

      {!canUse && (
        <div className="absolute inset-0 z-10 bg-base-100/20 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
          <div className="text-center text-sm font-semibold text-error px-4">
            🚫 {message}
          </div>
        </div>
      )}
    </div>
  );
}
