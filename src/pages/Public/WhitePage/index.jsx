import SnowButton from "@/pages/LocketCamera/MainhomeScreen/Views/CustomeStudio/CaptionItems/SnowCaption";
import React from "react";

export default function WhitePage() {
  return (
    <div className="relative flex justify-center items-center w-full h-[20vh] bg-white">
      <SnowButton />

      {/* Dòng chữ nhỏ ở góc dưới phải */}
      <span className="absolute bottom-3 right-4 text-xs text-gray-400 select-none">
        © Dio
      </span>
    </div>
  );
}
