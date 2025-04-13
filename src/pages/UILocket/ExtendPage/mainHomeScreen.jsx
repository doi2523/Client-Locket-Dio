import React from "react";
import Navbar from "./Navbar";
import MediaPreview from "./MediaDisplay";
import { useApp } from "../../../context/AppContext";
import ActionControls from "../ActionControls";

const MainHomeScreen = () => {
  const { navigation, post, camera } = useApp();

  const { isHomeOpen, isProfileOpen } = navigation;
  const { isSizeMedia,setSizeMedia, preview, setPreview } = post;
  const { canvasRef } = camera;

  return (
    <div
      className={`transition-transform duration-500 ${
        isProfileOpen
          ? "translate-x-full"
          : isHomeOpen
          ? "-translate-x-full"
          : "translate-x-0"
      } overflow-hidden`}
    >
      <div className="flex select-none flex-col items-center justify-start overflow-hidden">
        <Navbar />
        <MediaPreview />
        <ActionControls />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
export default MainHomeScreen;
