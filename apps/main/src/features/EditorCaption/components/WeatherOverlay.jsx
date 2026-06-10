import React from "react";
import { getCaptionStyle } from "@/helpers/styleHelpers";
import IconRenderer from "@/components/Overlay/icons/IconRenderer";

const WeatherOverlay = ({ postOverlay }) => {
  return (
    <div
      className="relative flex items-center bg-white/50 backdrop-blur-2xl gap-1 py-2 px-4 rounded-4xl text-white font-semibold"
      style={{
        ...getCaptionStyle(postOverlay.background, postOverlay.text_color),
      }}
    >
      <img
        src="./images/cloud_cover.png"
        alt="Cover"
        className="absolute inset-0 w-full h-full object-cover rounded-3xl select-none pointer-events-none"
        style={{
          opacity: postOverlay?.payload?.cloud_cover ?? 0,
        }}
      />
      <IconRenderer icon={postOverlay.icon} />
      <span>{postOverlay?.text || postOverlay?.caption}</span>
    </div>
  );
};

export default WeatherOverlay;
