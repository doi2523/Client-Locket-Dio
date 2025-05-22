import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../../../context/AppContext";

const AutoResizeCaption = () => {
  const textareaRef = useRef(null);
  const imageIconRef = useRef(null);
  const parentRef = useRef(null);
  const canvasRef = useRef(document.createElement("canvas"));
  const { post } = useApp();
  const { postOverlay, setPostOverlay } = post;

  const placeholder = "Nhập tin nhắn...";
  const defaultImageIconWidth = 200; // Thêm width mặc định cho image_icon
  const [width, setWidth] = useState(defaultImageIconWidth);
  const [shouldWrap, setShouldWrap] = useState(false);

  const adjustHeight = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  const getTextWidth = (text, ref) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context || !ref.current) return 100;

    const style = getComputedStyle(ref.current);
    context.font = `${style.fontSize} ${style.fontFamily}`;

    const emojiRegex =
      /([\uD800-\uDBFF][\uDC00-\uDFFF])|(\p{Extended_Pictographic})/gu;
    const textOnly = text.replace(emojiRegex, "");
    const emojiMatches = text.match(emojiRegex) || [];

    const baseWidth = context.measureText(textOnly).width;
    const emojiWidth = emojiMatches.length * 24;

    return baseWidth + emojiWidth;
  };

  useEffect(() => {
    adjustHeight(textareaRef);
    adjustHeight(imageIconRef);

    const combinedText =
      postOverlay.type === "image_icon"
        ? postOverlay.caption || placeholder
        : `${postOverlay.icon || ""} ${
            postOverlay.caption || placeholder
          }`.trim();
    const baseWidth = getTextWidth(
      combinedText,
      postOverlay.type === "image_icon" ? imageIconRef : textareaRef
    );
    const padding = 32;
    const finalWidth = baseWidth + padding;

    let maxAllowedWidth = window.innerWidth * 0.9;
    if (parentRef.current) {
      maxAllowedWidth = parentRef.current.clientWidth;
    }

    const adjustedWidth =
      finalWidth > maxAllowedWidth ? maxAllowedWidth : finalWidth;

    setWidth(
      postOverlay.type === "image_icon" && finalWidth < defaultImageIconWidth
        ? defaultImageIconWidth
        : adjustedWidth
    );
    setShouldWrap(finalWidth > maxAllowedWidth);
  }, [postOverlay.icon, postOverlay.caption, postOverlay.type, placeholder]);

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

  const isEditable = !["decorative", "custome"].includes(postOverlay?.type);

  return (
    <div ref={parentRef} className="relative w-full">
      {postOverlay.type === "image_icon" ? (
        <div
          className="flex items-center bg-white/50 backdrop-blur-2xl gap-2 py-2 px-4 rounded-4xl absolute bottom-2 left-1/2 transform -translate-x-1/2"
          style={{
            width: `${width}px`,
            background: `linear-gradient(to bottom, ${postOverlay.color_top}, ${postOverlay.color_bottom})`,
          }}
        >
          <img
            src={postOverlay.icon}
            alt="Icon"
            className="w-6 h-6 object-cover"
          />
          <textarea
            ref={imageIconRef}
            value={postOverlay.caption || ""}
            onChange={(e) =>
              setPostOverlay((prev) => ({
                ...prev,
                caption: e.target.value,
              }))
            }
            placeholder={placeholder}
            rows={1}
            className="font-semibold outline-none w-auto resize-none overflow-hidden transition-all"
            style={{
              width: `${width}px`,
              color: postOverlay.text_color,
              whiteSpace: shouldWrap ? "pre-wrap" : "nowrap",
            }}
          />
        </div>
      ) : (
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
          className="absolute z-10 text-white px-4 font-semibold bottom-2 left-1/2 transform backdrop-blur-2xl -translate-x-1/2 bg-white/50 rounded-4xl py-2 text-md outline-none max-w-[90%] resize-none overflow-hidden transition-all"
          style={{
            width: `${width}px`,
            color: postOverlay.text_color,
            whiteSpace: shouldWrap ? "pre-wrap" : "nowrap",
            background: `linear-gradient(to bottom, ${postOverlay.color_top}, ${postOverlay.color_bottom})`,
          }}
          disabled={!isEditable}
          wrap={shouldWrap ? "soft" : "off"}
        />
      )}
    </div>
  );
};

export default AutoResizeCaption;
