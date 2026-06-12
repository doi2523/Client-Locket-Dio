import React from "react";

const HeartOverlay = ({ postOverlay }) => {
  return (
    <div className="flex items-center bg-white/50 backdrop-blur-2xl gap-1 py-2 px-4 rounded-4xl text-white font-semibold">
      <img src="./svg/heart-icon.svg" alt="" className="w-6 h-6" />
      <span>{postOverlay.caption}</span>
    </div>
  );
};

export default HeartOverlay;
