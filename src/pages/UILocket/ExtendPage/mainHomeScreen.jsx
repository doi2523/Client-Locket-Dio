import React from "react";
import Navbar from "./Navbar";
import MediaPreview from "./MediaDisplay";
import { useApp } from "../../../context/AppContext";
import ActionControls from "../ActionControls";
import HistoryArrow from "./HistoryButton";

const MainHomeScreen = () => {
  const { navigation, post, camera, useloading } = useApp();

  const { isHomeOpen, isProfileOpen, isBottomOpen } = navigation;
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
          : isBottomOpen
          ? "-translate-y-full"
          : "translate-x-0"
      }`}
    >
      <div
        className={`flex h-full select-none flex-col items-center justify-start overflow-hidden ${
          sendLoading === true
            ? "animate-slide-up"
            : sendLoading === false
            ? "animate-reset"
            : ""
        }`}
      >
        <Navbar />
        <MediaPreview />
        <ActionControls />
        <HistoryArrow/>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default MainHomeScreen;
