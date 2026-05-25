import React from "react";
import IconRenderer from "../icons/IconRenderer";
import { getCaptionStyle } from "@/helpers/styleHelpers";

function BaseOverlay({ overlayData }) {
  const textColor = overlayData?.textColor || overlayData?.text_color || "#ffffff";
  const background = overlayData?.background || {};
  const Icon = IconRenderer({ icon: overlayData?.icon });
  const text = overlayData?.text || "";

  if (!text) return null;

  return (
    <div
      className="absolute max-w-[80%] bottom-4 w-fit backdrop-blur-sm rounded-3xl px-2.5 py-2"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        ...getCaptionStyle(background, textColor),
      }}
    >
      <div className="flex items-center justify-center gap-1.5 flex-row text-md font-bold">
        {Icon}
        <span>{text}</span>
      </div>
    </div>
  );
}

export default BaseOverlay;
