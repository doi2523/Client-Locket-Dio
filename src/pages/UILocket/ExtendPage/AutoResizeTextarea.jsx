import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../../../context/AppContext";

const AutoResizeTextarea = () => {
  const textareaRef = useRef(null);
  const canvasRef = useRef(document.createElement("canvas"));
  const { post } = useApp();
  const { caption, setCaption, selectedColors } = post;

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
    const textOnly = text.replace(emojiRegex, '');
    const emojiMatches = text.match(emojiRegex) || [];

    const baseWidth = context.measureText(textOnly).width;
    const emojiWidth = emojiMatches.length * 24;

    return baseWidth + emojiWidth;
  };

  useEffect(() => {
    adjustHeight();

    const baseText = caption || placeholder;
    const baseWidth = getTextWidth(baseText);
    const padding = 32; // px-4 (left + right)
    const finalWidth = baseWidth + padding;

    setWidth(finalWidth);

    const maxAllowedWidth = window.innerWidth * 0.9;
    setShouldWrap(finalWidth > maxAllowedWidth);
  }, [caption, placeholder, selectedColors]);

  const handleChange = (e) => {
    setCaption(e.target.value);
  };

  return (
    <textarea
      ref={textareaRef}
      value={caption}
      onChange={handleChange}
      placeholder={placeholder}
      rows={1}
      className="absolute z-50 text-white px-4 font-semibold bottom-4 left-1/2 transform backdrop-blur-2xl -translate-x-1/2 bg-white/50 rounded-4xl py-2 text-md outline-none max-w-[90%] w-auto resize-none overflow-hidden transition-all"
      style={{
        width: `${width}px`,
        color: selectedColors.text_color,
        height: "40px",
        whiteSpace: shouldWrap ? "pre-wrap" : "nowrap",
        overflow: "hidden",
        background: `linear-gradient(to bottom, ${selectedColors.top}, ${selectedColors.bottom})`,
      }}
    />
  );
};

export default AutoResizeTextarea;
