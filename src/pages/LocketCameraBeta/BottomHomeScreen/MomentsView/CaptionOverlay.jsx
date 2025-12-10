import React from "react";

function CaptionOverlay({ currentMoment }) {
  return (
    <div
      className="absolute max-w-[80%] bottom-4 w-fit backdrop-blur-sm rounded-3xl px-2.5 py-2"
      style={{
        background: currentMoment?.overlays?.background?.colors?.length
          ? `linear-gradient(to bottom, ${currentMoment.overlays.background.colors.join(
              ", "
            )})`
          : "rgba(0,0,0,0.6)", // fallback khi không có màu
        color: currentMoment?.overlays?.textColor || "#fff",
      }}
    >
      <div className="flex items-center gap-2 flex-row text-md font-bold">
        {/* Icon overlay nếu có */}
        {currentMoment?.overlays?.icon &&
          (currentMoment.overlays.icon.type === "emoji" ? (
            <span className="text-lg">{currentMoment.overlays.icon.data}</span>
          ) : (
            <img
              src={currentMoment.overlays.icon.data}
              alt="icon"
              className="w-6 h-6 object-contain"
            />
          ))}
        <span>{currentMoment.caption}</span>
      </div>
    </div>
  );
}
export default CaptionOverlay;
