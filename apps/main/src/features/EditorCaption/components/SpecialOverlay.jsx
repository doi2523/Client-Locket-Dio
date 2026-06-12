import React, { useRef } from "react";
import SnowEffect from "@/components/Effects/SnowEffect";
import { useTextMeasurement } from "../hooks/useTextMeasurement";
import { useAutoResize } from "../hooks/useAutoResize";

const SpecialOverlay = ({
  postOverlay,
  setPostOverlay,
  placeholder,
  isEditable,
  parentRef,
}) => {
  const textareaRef = useRef(null);
  const combinedText = postOverlay.icon
    ? `${postOverlay.icon} ${postOverlay.caption || ""}`.trim()
    : postOverlay.caption || "";

  const { width, shouldWrap } = useTextMeasurement(
    combinedText,
    textareaRef,
    "default",
    placeholder,
    parentRef,
  );

  useAutoResize([textareaRef]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const icon = postOverlay.icon || "";
    const prefix = icon ? `${icon} ` : "";

    if (inputValue.startsWith(prefix)) {
      const newCaption = inputValue.slice(prefix.length);
      setPostOverlay((prev) => ({
        ...prev,
        caption: newCaption,
      }));
    } else {
      setPostOverlay((prev) => ({
        ...prev,
        caption: inputValue,
      }));
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-4xl flex justify-center opacity-100 z-10"
      style={{
        color: postOverlay.text_color,
        width: `${width}px`,
      }}
    >
      <textarea
        ref={textareaRef}
        value={combinedText}
        onChange={handleChange}
        placeholder={placeholder}
        rows={1}
        className="px-4 font-semibold duration-300 rounded-4xl backdrop-blur-2xl bg-white/50 py-2 text-md outline-none resize-none overflow-hidden transition-all"
        style={{
          width: `${width}px`,
          maxWidth: "90%",
          whiteSpace: shouldWrap ? "pre-wrap" : "nowrap",
          background: `linear-gradient(to bottom, ${postOverlay.color_top}, ${postOverlay.color_bottom})`,
        }}
        disabled={!isEditable}
        wrap={shouldWrap ? "soft" : "off"}
      />

      <div className="absolute inset-0 pointer-events-none z-0">
        <SnowEffect snowflakeCount={50} />
      </div>
    </div>
  );
};

export default SpecialOverlay;
