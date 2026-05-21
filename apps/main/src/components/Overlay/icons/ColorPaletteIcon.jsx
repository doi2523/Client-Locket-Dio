import React from "react";

export function ColorPaletteIcon({ color = "#ffffff", size = 24 }) {
  return (
    <div
      className="rounded-full shadow-md"
      style={{
        backgroundColor: color,
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
}
