import React from "react";
import Navbar from "./Navbar";
import MediaPreview from "./MediaDisplay";
import CameraControls from "../ControlPage/ActionButtons";
import { useApp } from "../../../context/AppContext";

const MainHomeScreen = () => {
  const { navigation } = useApp();

  const { isHomeOpen, isProfileOpen } = navigation;

  return (
    <div
      className={`transition-transform duration-500 ${
        isProfileOpen
          ? "translate-x-full"
          : isHomeOpen
          ? "-translate-x-full"
          : "translate-x-0"
      }`}
    >
      <div className="flex select-none flex-col items-center justify-start">
        <Navbar />
        <MediaPreview />
        <CameraControls />
        <canvas className="hidden" />
      </div>
    </div>
  );
};
export default MainHomeScreen;
