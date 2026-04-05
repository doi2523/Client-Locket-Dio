import React from "react";
import { getCaptionStyle } from "@/helpers/styleHelpers";
import IconRenderer from "@/features/OverlayRender/iconRenders";

function DecorativeOverlay({ overlayData }) {

  return (
    <div
      className="max-w-[80%] w-fit backdrop-blur-sm rounded-3xl px-3 py-2"
      style={{
        ...getCaptionStyle(overlayData.background, overlayData.text_color),
      }}
    >
      <div className="flex items-center justify-center gap-1.5 flex-row text-md font-bold">
        <IconRenderer icon={overlayData.icon} />
        <span>{overlayData.text}</span>
      </div>
    </div>
  );
}

export default DecorativeOverlay;
