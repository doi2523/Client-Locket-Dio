import React, { useRef } from "react";
import { useTextMeasurement } from "../hooks/useTextMeasurement";
import { useAutoResize } from "../hooks/useAutoResize";

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

export default BatteryOverlay;
