import React from "react";
import Navbar from "./Navbar";
import MediaPreview from "./MediaDisplay";
import { useApp } from "../../../context/AppContext";
import ActionControls from "../ControlPage/ActionControls";

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
        <ActionControls />
        <canvas className="hidden" />
      </div>
    </div>
  );
};
export default MainHomeScreen;
