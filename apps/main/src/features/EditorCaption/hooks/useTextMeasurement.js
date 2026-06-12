import { useState, useEffect, useRef } from "react";

export const useTextMeasurement = (text, ref, type, placeholder, parentRef) => {
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(200);
  const [shouldWrap, setShouldWrap] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    if (!canvasRef.current && typeof document !== "undefined") {
      canvasRef.current = document.createElement("canvas");
    }

    const getTextWidth = (textValue, element) => {
      const canvas = canvasRef.current;
      if (!canvas) return 100;
      const context = canvas.getContext("2d");
      if (!context || !element) return 100;

      const safeText = String(textValue || "");
      const style = window.getComputedStyle(element);
      context.font = `${style.fontSize} ${style.fontFamily}`;

      const emojiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|(\p{Extended_Pictographic})/gu;
      const textOnly = safeText.replace(emojiRegex, "");
      const emojiMatches = safeText.match(emojiRegex) || [];

      const baseWidth = context.measureText(textOnly).width;
      const emojiWidth = emojiMatches.length * 24;

      return baseWidth + emojiWidth;
    };

    const textToMeasure = text || placeholder;
    const baseWidth = getTextWidth(textToMeasure, ref.current);
    const padding = 32; // padding left + right
    const iconWidth =
      type === "image_icon" || type === "location" || type === "battery"
        ? 32
        : 0; // icon width + gap
    const finalWidth = baseWidth + padding + iconWidth;

    // Get max width from parent or window
    let maxAllowedWidth = window.innerWidth * 0.9;
    if (parentRef?.current) {
      maxAllowedWidth = parentRef.current.clientWidth * 0.9;
    }

    const minWidth = type === "image_icon" ? 200 : 120; // Minimum width for different types
    const adjustedWidth = Math.max(
      minWidth,
      Math.min(finalWidth, maxAllowedWidth),
    );

    setWidth(adjustedWidth);
    setShouldWrap(finalWidth > maxAllowedWidth);
  }, [text, type, placeholder, parentRef, ref]);

  return { width, shouldWrap };
};
