import React, { useRef } from "react";
import { useTextMeasurement } from "../hooks/useTextMeasurement";
import { useAutoResize } from "../hooks/useAutoResize";

const DefaultOverlay = ({
  postOverlay,
  setPostOverlay,
  placeholder,
  parentRef,
}) => {
  const textareaRef = useRef(null);
  const combinedText = postOverlay.text || postOverlay.caption || "";

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
      setPostOverlay({
        caption: newCaption,
        text: newCaption,
      });
    } else {
      setPostOverlay({
        caption: inputValue,
        text: inputValue,
      });
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={combinedText}
      onChange={handleChange}
      placeholder={placeholder}
      rows={1}
      className="text-white px-4 font-semibold duration-300 opacity-100 backdrop-blur-2xl bg-white/50 rounded-4xl py-2 text-md outline-none resize-none overflow-hidden transition-all"
      style={{
        width: `${width}px`,
        maxWidth: "90%",
        whiteSpace: shouldWrap ? "pre-wrap" : "nowrap",
      }}
      wrap={shouldWrap ? "soft" : "off"}
    />
  );
};

export default DefaultOverlay;
