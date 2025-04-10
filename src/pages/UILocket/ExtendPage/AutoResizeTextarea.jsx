import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../../../context/AppContext";

const AutoResizeTextarea = () => {
  const textareaRef = useRef(null);
  const { post } = useApp();
  const { caption, setCaption, selectedColors } = post;

  const placeholder = "Nhập tin nhắn...";
  const [width, setWidth] = useState(1000);

  // Điều chỉnh chiều cao tự động
  const adjustHeight = () => {
    if (textareaRef.current) {
      // Reset height to auto to allow calculation based on content
      textareaRef.current.style.height = "auto";
      // Set the height to scrollHeight after resetting it
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Tính chiều rộng dựa trên văn bản
  const getTextWidth = (text) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return 100; // Trả về giá trị mặc định nếu context null
    context.font = "16px sans-serif";
    return context.measureText(text).width;
  };

  // UseEffect to adjust height and width only when necessary
  useEffect(() => {
    // Adjust the height when the caption changes
    adjustHeight();
    // Calculate the width based on the text and placeholder length
    setWidth(Math.max(placeholder.length * 10, getTextWidth(caption) + 20));
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
      rows="1"
      className="absolute text-white px-4 font-semibold bottom-4 left-1/2 transform backdrop-blur-2xl -translate-x-1/2 bg-white/50 rounded-4xl py-2 text-md outline-none max-w-[90%] w-auto resize-none overflow-hidden transition-all"
      style={{
        width: `${width}px`,
        color: `${selectedColors.text}`,
        height : "40px",
        whiteSpace: "pre-wrap",
        overflow: "hidden",
        background: `linear-gradient(to top, ${selectedColors.top}, ${selectedColors.bottom})`,
      }}
    />
  );
};

export default AutoResizeTextarea;
