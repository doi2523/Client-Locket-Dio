import React from "react";
import IconRenderer from "../icons/IconRenderer";

function BaseOverlay({ currentMoment }) {
  const overlay = currentMoment?.overlays;

  const backgroundStyle = overlay?.background?.colors?.length
    ? `linear-gradient(to bottom, ${overlay.background.colors.join(", ")})`
    : "rgba(0,0,0,0.6)";

  return (
    <div
      className="absolute max-w-[80%] bottom-4 w-fit backdrop-blur-sm rounded-3xl px-2.5 py-2"
      style={{
        background: backgroundStyle,
        color: overlay?.textColor || "#fff",
      }}
    >
      <div className="flex items-center justify-center gap-1.5 flex-row text-md font-bold">
        <IconRenderer icon={overlay?.icon} />
        <span>{overlay?.text}</span>
      </div>
    </div>
  );
}

export default BaseOverlay;
