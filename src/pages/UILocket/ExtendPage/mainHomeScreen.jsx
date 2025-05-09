import React from "react";
import Navbar from "./Navbar";
import MediaPreview from "./MediaDisplay";
import { useApp } from "../../../context/AppContext";
import ActionControls from "../ActionControls";
import HistoryArrow from "./HistoryButton";

const MainHomeScreen = () => {
  const { navigation, post, camera, useloading } = useApp();

  const { isHomeOpen, isProfileOpen } = navigation;
  const { sendLoading, setSendLoading } = useloading;
  const { isSizeMedia, setSizeMedia, preview, setPreview } = post;
  const { canvasRef } = camera;

  return (
    <div
      className={`relative transition-all duration-500 overflow-hidden ${
        isProfileOpen
          ? "translate-x-full"
          : isHomeOpen
          ? "-translate-x-full"
          : "translate-x-0"
      }`}
    >
<div
  className={`flex h-full select-none flex-col items-center duration-500 justify-start overflow-hidden ${
    sendLoading
      ? "transition-all -translate-y-full opacity-0 scale-0"
      : "transition-all opacity-100 scale-100"
  }`}
>
  <Navbar />
  <MediaPreview />
  <ActionControls />
  {/* <HistoryArrow /> */}
  <canvas ref={canvasRef} className="hidden" />
</div>

      
    </div>
  );
};

export default MainHomeScreen;
