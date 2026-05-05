import React, { useEffect, useRef, useState } from "react";
import { PiClockFill } from "react-icons/pi";
import SnowEffect from "@/components/Effects/SnowEffect";
import ReviewOverlay from "./components/ReviewOverlay";
import { useOverlayEditorStore } from "@/stores";
import DecorativeOverlay from "./components/DecorativeOverlay";
import { getCaptionStyle } from "@/helpers/styleHelpers";
import IconRenderer from "../OverlayRender/iconRenders";
import StreakOverlay from "./components/StreakOverlay";
import MusicOverlay from "./components/MusicOverlay";

// Custom Hooks
const useTextMeasurement = (text, ref, type, placeholder, parentRef) => {
  const canvasRef = useRef(document.createElement("canvas"));
  const [width, setWidth] = useState(200);
  const [shouldWrap, setShouldWrap] = useState(false);

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
    if (!ref.current) return;

    const textToMeasure = text || placeholder;
    const baseWidth = getTextWidth(textToMeasure, ref);
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
  }, [text, type, placeholder, parentRef]);

  return { width, shouldWrap };
};

const useAutoResize = (refs) => {
  const adjustHeight = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    refs.forEach((ref) => adjustHeight(ref));
  });

  return adjustHeight;
};

// Overlay Components
const CaptionIconOverlay = ({
  postOverlay,
  setPostOverlay,
  placeholder,
  parentRef,
  isEditable,
}) => {
  const textareaRef = useRef(null);
  const { width, shouldWrap } = useTextMeasurement(
    postOverlay.text,
    textareaRef,
    "image_icon",
    placeholder,
    parentRef,
  );

  useAutoResize([textareaRef]);

  if (!isEditable) return <DecorativeOverlay overlayData={postOverlay} />;

  return (
    <div
      className="flex items-center bg-white/50 backdrop-blur-2xl py-2 pl-4 rounded-4xl"
      style={{
        width: `${width}px`,
        ...getCaptionStyle(postOverlay.background, postOverlay.text_color),
      }}
    >
      <IconRenderer icon={postOverlay.icon} />
      <textarea
        ref={textareaRef}
        value={postOverlay.text || ""}
        onChange={(e) =>
          setPostOverlay({
            text: e.target.value,
          })
        }
        placeholder={placeholder}
        rows={1}
        disabled={!isEditable}
        className="font-semibold outline-none flex-1 resize-none overflow-hidden transition-all px-3"
        style={{
          whiteSpace: shouldWrap ? "pre-wrap" : "nowrap",
          minWidth: "0",
        }}
      />
    </div>
  );
};

const WeatherOverlay = ({ postOverlay }) => {
  return (
    <div
      className="flex items-center bg-white/50 backdrop-blur-2xl gap-1 py-2 px-4 rounded-4xl text-white font-semibold"
      style={{
        ...getCaptionStyle(postOverlay.background, postOverlay.text_color),
      }}
    >
      <IconRenderer icon={postOverlay.icon} />
      <span>{postOverlay?.text || postOverlay?.caption}</span>
    </div>
  );
};

const LocationOverlay = ({
  postOverlay,
  setPostOverlay,
  placeholder,
  parentRef,
}) => {
  const textareaRef = useRef(null);
  const { width, shouldWrap } = useTextMeasurement(
    postOverlay.caption,
    textareaRef,
    "location",
    placeholder,
    parentRef,
  );

  useAutoResize([textareaRef]);

  return (
    <div
      className="flex items-center bg-white/50 backdrop-blur-2xl gap-1 py-2 px-4 rounded-4xl text-white font-semibold"
      style={{ width: `${width}px` }}
    >
      <img
        src="https://img.icons8.com/?size=100&id=NEiCAz3KRY7l&format=png&color=000000"
        alt=""
        className="w-6 h-6"
      />
      <textarea
        ref={textareaRef}
        value={postOverlay.caption || ""}
        onChange={(e) =>
          setPostOverlay({
            ...postOverlay,
            text: e.target.value,
            caption: e.target.value,
          })
        }
        placeholder={placeholder}
        rows={1}
        className="font-semibold outline-none flex-1 resize-none overflow-hidden transition-all"
        style={{
          whiteSpace: shouldWrap ? "pre-wrap" : "nowrap",
          minWidth: "0",
        }}
      />
    </div>
  );
};

const HeartOverlay = ({ postOverlay }) => {
  return (
    <div className="flex items-center bg-white/50 backdrop-blur-2xl gap-1 py-2 px-4 rounded-4xl text-white font-semibold">
      <img src="./svg/heart-icon.svg" alt="" className="w-6 h-6" />
      <span>{postOverlay.caption}</span>
    </div>
  );
};

const BatteryOverlay = ({ postOverlay, setPostOverlay, parentRef }) => {
  const textareaRef = useRef(null);
  const displayValue =
    postOverlay.caption !== null && postOverlay.caption !== undefined
      ? `${postOverlay.caption}%`
      : "";

  const { width, shouldWrap } = useTextMeasurement(
    displayValue,
    textareaRef,
    "battery",
    "0–100%",
    parentRef,
  );

  useAutoResize([textareaRef]);

  const handleBatteryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, "");
    let number = Math.min(parseInt(raw || "0", 10), 100);
    setPostOverlay((prev) => ({
      ...prev,
      caption: number.toString(),
    }));
  };

  return (
    <div
      className="flex items-center bg-white/50 backdrop-blur-2xl gap-1 py-2 px-4 rounded-4xl text-white font-semibold"
      style={{ width: `${Math.max(width, 150)}px` }}
    >
      <img
        src="https://img.icons8.com/?size=100&id=WDlpopZDVw4P&format=png&color=000000"
        alt=""
        className="w-6 h-6"
      />
      <textarea
        ref={textareaRef}
        value={
          postOverlay.caption !== null && postOverlay.caption !== undefined
            ? `${postOverlay.caption}%`
            : ""
        }
        onChange={handleBatteryChange}
        placeholder="0–100%"
        rows={1}
        className="font-semibold outline-none flex-1 resize-none overflow-hidden transition-all"
        style={{
          whiteSpace: shouldWrap ? "pre-wrap" : "nowrap",
          minWidth: "0",
        }}
      />
    </div>
  );
};

const TimeOverlay = ({ postOverlay, formattedTime }) => {
  return (
    <div className="flex items-center bg-white/50 backdrop-blur-2xl gap-1 py-2 px-4 rounded-4xl text-white font-semibold">
      <PiClockFill className="w-6 h-6 rotate-270" />
      <span>{postOverlay.caption || formattedTime}</span>
    </div>
  );
};

const CustomeOverlay = ({
  postOverlay,
  setPostOverlay,
  placeholder,
  isEditable,
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
        text: newCaption,
        caption: newCaption,
      });
    } else {
      setPostOverlay({
        text: inputValue,
        caption: inputValue,
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
      className="text-white px-4 font-semibold duration-300 opacity-100 transform backdrop-blur-2xl bg-white/50 rounded-4xl py-2 text-md outline-none resize-none overflow-hidden transition-all"
      style={{
        width: `${width}px`,
        maxWidth: "90%",
        whiteSpace: shouldWrap ? "pre-wrap" : "nowrap",
        ...getCaptionStyle(postOverlay.background, postOverlay.text_color),
      }}
      disabled={!isEditable}
      wrap={shouldWrap ? "soft" : "off"}
    />
  );
};

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
        // background: `linear-gradient(to bottom, ${postOverlay.color_top}, ${postOverlay.color_bottom})`,
      }}
    >
      {/* Textarea (caption) */}
      <textarea
        ref={textareaRef}
        value={combinedText}
        onChange={handleChange}
        placeholder={placeholder}
        rows={1}
        className="px-4 font-semibold duration-300 rounded-4xl backdrop-blur-2xl bg-white/50 py-2 text-md outline-none resize-none overflow-hidden transition-all"
        style={{
          // color: postOverlay.text_color,
          width: `${width}px`,
          maxWidth: "90%",
          whiteSpace: shouldWrap ? "pre-wrap" : "nowrap",
          background: `linear-gradient(to bottom, ${postOverlay.color_top}, ${postOverlay.color_bottom})`,
        }}
        disabled={!isEditable}
        wrap={shouldWrap ? "soft" : "off"}
      />

      {/* Hiệu ứng tuyết phủ trên caption */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <SnowEffect snowflakeCount={50} />
      </div>
    </div>
  );
};

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

// Main Component
const EditorCaption = () => {
  const parentRef = useRef(null);
  const overlayData = useOverlayEditorStore((s) => s.overlayData);

  const updateOverlayEditor = useOverlayEditorStore(
    (s) => s.updateOverlayEditor,
  );
  const placeholder = "Nhập tin nhắn...";
  const isEditable = overlayData?.is_editable;

  // Get formatted time (assuming it exists in the original context)
  const formattedTime = new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const renderOverlay = () => {
    const commonProps = {
      postOverlay: overlayData,
      setPostOverlay: updateOverlayEditor,
      placeholder,
      parentRef,
    };

    switch (overlayData.type) {
      case "image_icon":
      case "image_gif":
      case "caption_gif":
      case "caption_image":
      case "star_sign":
        return <CaptionIconOverlay {...commonProps} isEditable={isEditable} />;

      case "decorative":
      case "template":
        return <DecorativeOverlay overlayData={overlayData} />;

      case "music":
        return <MusicOverlay postOverlay={overlayData} />;

      case "weather":
        return <WeatherOverlay postOverlay={overlayData} />;

      case "location":
        return <LocationOverlay {...commonProps} />;

      case "heart":
        return <HeartOverlay postOverlay={overlayData} />;
      case "streak":
        return <StreakOverlay postOverlay={overlayData} />;

      case "battery":
        return <BatteryOverlay {...commonProps} />;

      case "time":
        return (
          <TimeOverlay
            postOverlay={overlayData}
            formattedTime={formattedTime}
          />
        );

      case "review":
        return <ReviewOverlay payload={overlayData?.payload} />;

      case "special":
        return <SpecialOverlay {...commonProps} isEditable={isEditable} />;

      case "default":
        return <DefaultOverlay {...commonProps} />;

      default:
        return <CustomeOverlay {...commonProps} isEditable={isEditable} />;
    }
  };

  return (
    <div
      ref={parentRef}
      className="relative w-full bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center"
    >
      {renderOverlay()}
    </div>
  );
};

export default EditorCaption;
