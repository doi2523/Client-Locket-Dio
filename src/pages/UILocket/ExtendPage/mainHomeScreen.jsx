import React from "react";
import Navbar from "./Navbar";
import MediaPreview from "./MediaDisplay";
import { useApp } from "../../../context/AppContext";
import ActionControls from "../ControlPage/ActionControls";

const MainHomeScreen = () => {
  const { navigation, post } = useApp();

  const { isHomeOpen, isProfileOpen } = navigation;
  const { isSizeMedia,setSizeMedia, preview, setPreview } = post;

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
        <canvas className="hidden" />
      </div>
    </div>
  );
};
export default MainHomeScreen;
