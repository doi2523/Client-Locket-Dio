import React, { useRef } from "react";
import LocationIcon from "@/assets/icons/LocationIcon";
import { useTextMeasurement } from "../hooks/useTextMeasurement";
import { useAutoResize } from "../hooks/useAutoResize";

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
      <LocationIcon className="w-6 h-6 mr-0.5" />
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

export default LocationOverlay;
