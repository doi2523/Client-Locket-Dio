import React, { useEffect, useRef } from "react";

const AutoResizeTextarea = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef(null);

  // Điều chỉnh chiều cao tự động
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Tính toán chiều rộng ban đầu
  const getInitialWidth = () => {
    const width = placeholder.length * 10;
    return Math.max(width, 100);
  };

  // Tính chiều rộng dựa trên văn bản
  const getTextWidth = (text) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "16px sans-serif";
    return context.measureText(text).width;
  };

  // Tính chiều rộng textarea
  const getWidth = () => {
    return Math.max(getInitialWidth(), getTextWidth(value) + 20);
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows="1"
      className="absolute text-white px-4 font-semibold bottom-4 left-1/2 transform backdrop-blur-2xl -translate-x-1/2 bg-white/50 rounded-4xl py-2 text-md outline-none max-w-[90%] w-auto resize-none overflow-hidden transition-all"
      style={{
        width: `${getWidth()}px`,
        overflow: "hidden",
        minHeight: "40px",
        whiteSpace: "pre-wrap",
      }}
    />
  );
};

export default AutoResizeTextarea;
