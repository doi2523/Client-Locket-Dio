import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../../../context/AppContext";

const AutoResizeTextarea = () => {
  const textareaRef = useRef(null);
  const parentRef = useRef(null);
  const canvasRef = useRef(document.createElement("canvas"));
  const { post } = useApp();
  const { postOverlay, setPostOverlay } = post;

  const placeholder = "Nhập tin nhắn...";
  const [width, setWidth] = useState(1000);
  const [shouldWrap, setShouldWrap] = useState(false);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const getTextWidth = (text) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context || !textareaRef.current) return 100;

    const style = getComputedStyle(textareaRef.current);
    context.font = `${style.fontSize} ${style.fontFamily}`;

    const emojiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|(\p{Extended_Pictographic})/gu;
    const textOnly = text.replace(emojiRegex, "");
    const emojiMatches = text.match(emojiRegex) || [];

    const baseWidth = context.measureText(textOnly).width;
    const emojiWidth = emojiMatches.length * 24;

    return baseWidth + emojiWidth;
  };

  useEffect(() => {
    adjustHeight();

    const combinedText = `${postOverlay.icon || ""} ${postOverlay.caption || placeholder}`.trim();
    const baseWidth = getTextWidth(combinedText);
    const padding = 32;
    const finalWidth = baseWidth + padding;

    let maxAllowedWidth = window.innerWidth * 0.9;
    if (parentRef.current) {
      maxAllowedWidth = parentRef.current.clientWidth;
    }

    const adjustedWidth = finalWidth > maxAllowedWidth ? maxAllowedWidth : finalWidth;

    setWidth(adjustedWidth);
    setShouldWrap(finalWidth > maxAllowedWidth);
  }, [postOverlay.icon, postOverlay.caption, placeholder]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const icon = postOverlay.icon || "";
    const prefix = icon ? `${icon} ` : "";

    // Xử lý loại 1: Icon + Caption
    if (inputValue.startsWith(prefix)) {
      const newCaption = inputValue.slice(prefix.length);
      setPostOverlay((prev) => ({
        ...prev,
        caption: newCaption,
      }));
    } else {
      // Xử lý loại 2: Chỉ Caption (không có icon)
      setPostOverlay((prev) => ({
        ...prev,
        caption: inputValue,
      }));
    }
  };

  const isEditable = !["decorative", "custome"].includes(postOverlay?.type);

  return (
    <div ref={parentRef} className="relative w-full">
      <textarea
        ref={textareaRef}
        value={
          postOverlay.icon
            ? `${postOverlay.icon} ${postOverlay.caption || ""}`.trim()
            : postOverlay.caption || ""
        }
        onChange={handleChange}
        placeholder={placeholder}
        rows={1}
        className="absolute z-50 text-white px-4 font-semibold bottom-2 left-1/2 transform backdrop-blur-2xl -translate-x-1/2 bg-white/50 rounded-4xl py-2 text-md outline-none max-w-[90%] resize-none overflow-hidden transition-all"
        style={{
          width: `${width}px`,
          color: postOverlay.text_color,
          whiteSpace: shouldWrap ? "pre-wrap" : "nowrap",
          background: `linear-gradient(to bottom, ${postOverlay.color_top}, ${postOverlay.color_bottom})`,
        }}
        disabled={!isEditable}
        wrap={shouldWrap ? "soft" : "off"}
      />
    </div>
  );
};

export default AutoResizeTextarea;