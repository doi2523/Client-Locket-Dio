import React from "react";
import { PiClockFill } from "react-icons/pi";

const TimeOverlay = ({ postOverlay, formattedTime }) => {
  return (
    <div className="flex items-center bg-white/50 backdrop-blur-2xl gap-1 py-2 px-4 rounded-4xl text-white font-semibold">
      <PiClockFill className="w-6 h-6 rotate-270" />
      <span>{postOverlay.caption || formattedTime}</span>
    </div>
  );
};

export default TimeOverlay;
