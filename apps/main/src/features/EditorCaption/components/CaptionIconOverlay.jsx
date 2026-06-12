import React, { useRef } from "react";
import { getCaptionStyle } from "@/helpers/styleHelpers";
import IconRenderer from "@/components/Overlay/icons/IconRenderer";
import DecorativeOverlay from "./DecorativeOverlay";
import { useTextMeasurement } from "../hooks/useTextMeasurement";
import { useAutoResize } from "../hooks/useAutoResize";

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

export default CaptionIconOverlay;
