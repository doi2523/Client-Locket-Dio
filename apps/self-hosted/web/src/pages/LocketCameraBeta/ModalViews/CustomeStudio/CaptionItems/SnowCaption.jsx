import SnowEffect from "@/components/Effects/SnowEffect";
import React from "react";

export default function SnowButton() {
  return (
    <button
      className="relative overflow-hidden py-2 px-4 h-auto w-auto rounded-3xl font-semibold shadow-xl transition-all duration-300"
      style={{
        background: "linear-gradient(to bottom, #A22821 0%, #D1332D 100%)",
      }}
    >
      {/* Hiệu ứng tuyết rơi */}
      <div className="absolute inset-0 z-0">
        <SnowEffect snowflakeCount={50} />
      </div>

      {/* Nội dung button */}
      <span className="relative z-10 flex items-center gap-1 text-base drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
        <span>❄️</span>
        <span
          style={{
            color: "#FFFFFFDB",
          }}
        >
          New Caption
        </span>
      </span>
    </button>
  );
}
