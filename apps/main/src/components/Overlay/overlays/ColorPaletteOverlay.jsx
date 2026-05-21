import React from "react";
import { ColorPaletteIcon } from "../icons/ColorPaletteIcon";

// kiểm tra màu sáng/tối
function isLightColor(hex) {
  if (!hex) return false;

  const color = hex.replace("#", "");

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // độ sáng perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 155;
}

export const ColorPaletteOverlay = ({ overlayData }) => {
  const palettes = overlayData?.payload?.colors || [];
  const icon = overlayData?.icon || {};
  const text = overlayData?.text || "";

  // lấy màu đầu tiên để detect theme
  const primaryColor = palettes?.[0];

  const isLight = isLightColor(primaryColor);

  return (
    <div
      className={`absolute bottom-4 left-1/2 -translate-x-1/2 rounded-3xl px-3 flex flex-col items-center backdrop-blur-xl
        ${isLight ? "bg-black/10" : "bg-white/30"}
      `}
    >
      {/* palette */}
      <div className="flex py-2">
        {palettes.length > 0 ? (
          <div className="flex space-x-1">
            {palettes.map((color, index) => (
              <ColorPaletteIcon key={`${color}-${index}`} color={color} />
            ))}
          </div>
        ) : (
          <ColorPaletteIcon />
        )}
      </div>
    </div>
  );
};
