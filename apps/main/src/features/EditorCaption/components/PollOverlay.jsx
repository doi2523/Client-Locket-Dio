import React, { useRef, useState } from "react";
import { getCaptionStyle } from "@/helpers/styleHelpers";
import EmojiModal from "../Modal/EmojiPollModal";
import { useTextMeasurement } from "../hooks/useTextMeasurement";
import { useAutoResize } from "../hooks/useAutoResize";

function PollOverlay({
  postOverlay,
  setPostOverlay,
  placeholder,
  isEditable,
  parentRef,
}) {
  const textareaRef = useRef(null);

  const [emojiModalOpen, setEmojiModalOpen] = useState(false);
  const [activeSide, setActiveSide] = useState(null);

  const pollData = postOverlay?.payload || postOverlay?.overlays?.payload || {};

  const backgroundColors = postOverlay?.background?.colors || [
    "#685AF7",
    "#685AF7",
  ];

  const rightEmoji = pollData.right_emoji || "👍";
  const leftEmoji = pollData.left_emoji || "👎";

  const pollText = postOverlay?.text || "";
  const textColor = postOverlay?.text_color || "#FFFFFF";

  const { width, shouldWrap } = useTextMeasurement(
    pollText,
    textareaRef,
    "default",
    placeholder,
    parentRef,
  );

  useAutoResize([textareaRef]);

  const handleChange = (e) => {
    setPostOverlay({
      text: e.target.value,
    });
  };

  return (
    <div
      className="rounded-3xl p-2 flex flex-col items-center font-semibold w-max max-w-[80vw]"
      style={{
        width: `${width}px`,
        maxWidth: "90%",
        minWidth: `${Math.max(width, 180)}px`,
        ...getCaptionStyle(backgroundColors, textColor),
      }}
    >
      <textarea
        ref={textareaRef}
        value={pollText}
        onChange={handleChange}
        placeholder="Ask a question..."
        rows={1}
        className="bg-transparent text-center outline-none resize-none overflow-hidden w-full mb-3 px-2"
        style={{
          color: textColor,
          whiteSpace: shouldWrap ? "pre-wrap" : "nowrap",
        }}
      />

      <div className="flex items-center gap-2 w-full">
        <div
          onClick={() => {
            setActiveSide("left");
            setEmojiModalOpen(true);
          }}
          className="flex-1 flex items-center justify-center py-1 px-5 rounded-3xl bg-white/10 backdrop-blur-md shadow-md text-xl"
        >
          {leftEmoji}
        </div>

        <div
          onClick={() => {
            setActiveSide("right");
            setEmojiModalOpen(true);
          }}
          className="flex-1 flex items-center justify-center py-1 px-5 rounded-3xl bg-white/10 backdrop-blur-md shadow-md text-xl"
        >
          {rightEmoji}
        </div>
      </div>

      <EmojiModal
        open={emojiModalOpen}
        onClose={() => setEmojiModalOpen(false)}
        setPostOverlay={setPostOverlay}
        activeSide={activeSide}
        title="Chọn emoji"
      />
    </div>
  );
}

export default PollOverlay;
