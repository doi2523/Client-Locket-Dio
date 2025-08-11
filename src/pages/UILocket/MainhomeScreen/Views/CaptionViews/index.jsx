import React, { useEffect, useRef, useState } from "react";
import { PiClockFill } from "react-icons/pi";
import { useApp } from "@/context/AppContext";
import { StarRating } from "../StarRating/StarRating";

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
      Math.min(finalWidth, maxAllowedWidth)
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
const ImageIconOverlay = ({
  postOverlay,
  setPostOverlay,
  placeholder,
  parentRef,
}) => {
  const textareaRef = useRef(null);
  const { width, shouldWrap } = useTextMeasurement(
    postOverlay.caption,
    textareaRef,
    "image_icon",
    placeholder,
    parentRef
  );

  useAutoResize([textareaRef]);

  return (
    <div
      className="flex items-center bg-white/50 backdrop-blur-2xl py-2 pl-4 rounded-4xl absolute bottom-2 left-1/2 transform -translate-x-1/2"
      style={{
        width: `${width}px`,
        background: `linear-gradient(to bottom, ${postOverlay.color_top}, ${postOverlay.color_bottom})`,
      }}
    >
      <img src={postOverlay.icon} alt="Icon" className="w-6 h-6 object-cover" />
      <textarea
        ref={textareaRef}
        value={postOverlay.caption || ""}
        onChange={(e) =>
          setPostOverlay((prev) => ({
            ...prev,
            caption: e.target.value,
          }))
        }
        placeholder={placeholder}
        rows={1}
        className="font-semibold outline-none flex-1 resize-none overflow-hidden transition-all px-3"
        style={{
          color: postOverlay.text_color,
          whiteSpace: shouldWrap ? "pre-wrap" : "nowrap",
          minWidth: "0",
        }}
      />
    </div>
  );
};

const MusicOverlay = ({ postOverlay }) => {
  return (
    <div className="flex w-auto items-center gap-2 py-2 px-4 rounded-4xl absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white font-semibold bg-white/50 backdrop-blur-2xl max-w-[85%] overflow-hidden">
      <img
        src={postOverlay.music.image}
        alt="Icon"
        className="w-6 h-6 object-cover rounded-sm shrink-0 no-select no-save"
      />

      <div className="relative overflow-hidden whitespace-nowrap flex-1">
        <div
          className="inline-block animate-marquee"
          style={{
            animationDuration:
              postOverlay.caption.length < 30
                ? "9s"
                : postOverlay.caption.length < 60
                ? "15s"
                : "17s",
          }}
        >
          <span className="mr-4">{postOverlay.caption}</span>
          <span className="mr-4 absolute">{postOverlay.caption}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 no-select no-save">
        <div className="border-l border-white h-5"></div>
        <img
          src="./icons/spotify_icon.png"
          alt="Spotify Icon"
          className="w-6 h-6 object-contain"
        />
      </div>
    </div>
  );
};

const WeatherOverlay = ({ postOverlay }) => {
  return (
    <div className="flex items-center bg-white/50 backdrop-blur-2xl gap-1 py-2 px-4 rounded-4xl absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white font-semibold">
      <img
        src={
          postOverlay?.caption?.icon
            ? `https:${postOverlay?.caption?.icon}`
            : "./images/sun_max_indicator.png"
        }
        alt={postOverlay?.caption?.condition || "Thời tiết"}
        className="w-6 h-6"
      />
      <span>
        {postOverlay?.caption?.temp_c_rounded !== undefined
          ? `${postOverlay?.caption?.temp_c_rounded}°C`
          : "Thời tiết"}
      </span>
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
    parentRef
  );

  useAutoResize([textareaRef]);

  return (
    <div
      className="flex items-center bg-white/50 backdrop-blur-2xl gap-1 py-2 px-4 rounded-4xl absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white font-semibold"
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
          setPostOverlay((prev) => ({
            ...prev,
            caption: e.target.value,
          }))
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
    <div className="flex items-center bg-white/50 backdrop-blur-2xl gap-1 py-2 px-4 rounded-4xl absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white font-semibold">
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
    parentRef
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
      className="flex items-center bg-white/50 backdrop-blur-2xl gap-1 py-2 px-4 rounded-4xl absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white font-semibold"
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
    <div className="flex items-center bg-white/50 backdrop-blur-2xl gap-1 py-2 px-4 rounded-4xl absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white font-semibold">
      <PiClockFill className="w-6 h-6 rotate-270" />
      <span>{postOverlay.caption || formattedTime}</span>
    </div>
  );
};

const ReviewOverlay = ({ postOverlay }) => {
  return (
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/50 backdrop-blur-2xl rounded-4xl px-6 pt-2 flex flex-col items-center font-semibold max-w-[90vw] w-max">
      <div className="flex gap-2 mb-1">
        <StarRating rating={postOverlay.icon || 0} />
      </div>

      <div className="relative text-center text-sm leading-tight max-w-full px-4">
        <span
          className="absolute -top-2 left-0 text-xl select-none"
          aria-hidden="true"
        >
          &ldquo;
        </span>

        <span
          className="absolute -top-2 right-0 text-xl select-none"
          aria-hidden="true"
        >
          &rdquo;
        </span>

        <span className="inline-block text-lg font-semibold text-white max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {postOverlay.caption}
        </span>
      </div>
    </div>
  );
};

const DefaultOverlay = ({
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
    parentRef
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
    <textarea
      ref={textareaRef}
      value={combinedText}
      onChange={handleChange}
      placeholder={placeholder}
      rows={1}
      className="absolute z-10 text-white px-4 font-semibold duration-300 opacity-100 bottom-2 left-1/2 transform backdrop-blur-2xl -translate-x-1/2 bg-white/50 rounded-4xl py-2 text-md outline-none resize-none overflow-hidden transition-all"
      style={{
        width: `${width}px`,
        maxWidth: "90%",
        whiteSpace: shouldWrap ? "pre-wrap" : "nowrap",
        background: `linear-gradient(to bottom, ${postOverlay.color_top}, ${postOverlay.color_bottom})`,
      }}
      disabled={!isEditable}
      wrap={shouldWrap ? "soft" : "off"}
    />
  );
};

// Main Component
const AutoResizeCaption = () => {
  const parentRef = useRef(null);
  const { post } = useApp();
  const { postOverlay, setPostOverlay } = post;
  const placeholder = "Nhập tin nhắn...";
  const isEditable = !["decorative", "custome"].includes(postOverlay?.type);

  // Get formatted time (assuming it exists in the original context)
  const formattedTime = new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const renderOverlay = () => {
    const commonProps = {
      postOverlay,
      setPostOverlay,
      placeholder,
      parentRef,
    };

    switch (postOverlay.type) {
      case "image_icon":
      case "image_gif":
        return <ImageIconOverlay {...commonProps} />;

      case "music":
        return <MusicOverlay postOverlay={postOverlay} />;

      case "weather":
        return <WeatherOverlay postOverlay={postOverlay} />;

      case "location":
        return <LocationOverlay {...commonProps} />;

      case "heart":
        return <HeartOverlay postOverlay={postOverlay} />;

      case "battery":
        return (
          <BatteryOverlay
            postOverlay={postOverlay}
            setPostOverlay={setPostOverlay}
            parentRef={parentRef}
          />
        );

      case "time":
        return (
          <TimeOverlay
            postOverlay={postOverlay}
            formattedTime={formattedTime}
          />
        );

      case "review":
        return <ReviewOverlay postOverlay={postOverlay} />;

      default:
        return <DefaultOverlay {...commonProps} isEditable={isEditable} />;
    }
  };

  return (
    <div ref={parentRef} className="relative w-full">
      {renderOverlay()}
    </div>
  );
};

export default AutoResizeCaption;
