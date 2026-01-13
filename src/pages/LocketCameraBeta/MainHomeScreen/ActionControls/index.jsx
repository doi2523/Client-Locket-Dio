import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import MediaControls from "./MediaControls";
import CameraControls from "./CameraControls";

const ActionControls = () => {
  const { post } = useApp();
  const { selectedFile } = post;

  const targetView = selectedFile ? "controls" : "capture";

  // view hiện tại đang mount trong DOM
  const [view, setView] = useState(targetView);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (targetView === view) return;

    // bắt đầu animation out
    setIsAnimating(true);

    // sau 300ms (animation-duration-300), swap component
    const timer = setTimeout(() => {
      setView(targetView);
      setIsAnimating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [targetView, view]);

  const animationClass = isAnimating ? "opacity-0" : "opacity-100";

  return (
    <div className="relative flex flex-row max-w-md justify-center items-center w-full overflow-hidden">
      <div
        className={`w-full flex flex-row max-w-md justify-evenly items-center gap-4
          transition-all duration-300 
          ${animationClass}
        `}
      >
        {view === "controls" ? <MediaControls /> : <CameraControls />}
      </div>
    </div>
  );
};

export default ActionControls;
