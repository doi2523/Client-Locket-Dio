import { SonnerInfo } from "@/components/ui/SonnerToast";
import { getCaptionStyle } from "@/helpers/styleHelpers";
import React from "react";

function PollOverlay({ overlayData, onVote }) {
  const pollData = overlayData?.payload || overlayData?.overlays?.payload || {};

  const backgroundColors = overlayData.background.colors || [
    "#685AF7",
    "#685AF7",
  ];

  const rightEmoji = pollData.right_emoji || "👍";
  const leftEmoji = pollData.left_emoji || "👎";

  const pollText = overlayData?.text;
  const textColor = overlayData?.text_color || "#FFFFFF";

  const handleVote = (selectedEmoji) => {
    // console.log("Selected:", selectedEmoji);
    SonnerInfo("Tính năng đang được phát triển, cảm ơn bạn đã thử!");
    // callback ra ngoài
    // onVote?.(selectedEmoji);
  };

  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/50 backdrop-blur-2xl rounded-3xl p-2 flex flex-col items-center font-semibold w-max max-w-[80%]"
      style={{
        ...getCaptionStyle(backgroundColors, textColor),
      }}
    >
      {/* Poll text */}
      {pollText && (
        <div className="text-center mb-3" style={{ color: textColor }}>
          {pollText}
        </div>
      )}

      {/* Poll actions */}
      <div className="flex items-center gap-2 w-full">
        <button
          onClick={() => handleVote(leftEmoji)}
          className="flex-1 flex items-center justify-center py-1 px-5 rounded-3xl bg-white/10 backdrop-blur-md shadow-md text-xl active:scale-95 transition"
        >
          {leftEmoji}
        </button>

        <button
          onClick={() => handleVote(rightEmoji)}
          className="flex-1 flex items-center justify-center py-1 px-5 rounded-3xl bg-white/10 backdrop-blur-md shadow-md text-xl active:scale-95 transition"
        >
          {rightEmoji}
        </button>
      </div>
    </div>
  );
}

export default PollOverlay;
