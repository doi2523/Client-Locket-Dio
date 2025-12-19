import React, { lazy } from "react";
import { useApp } from "@/context/AppContext";
import MainHomeScreen from "./MainHomeScreen";
import { MusicPlayer } from "./Widgets/MusicPlayer";

const LeftHomeScreen = lazy(() => import("./LeftHomeScreen"));
const RightHomeScreen = lazy(() => import("./RightHomeScreen"));

const FriendsContainer = lazy(() => import("./ModalViews/FriendsContainer"));
const EmojiPicker = lazy(() => import("./ModalViews/EmojiStudio"));
const ScreenCustomeStudio = lazy(() => import("./ModalViews/CustomeStudio"));
const CropImageStudio = lazy(() => import("./ModalViews/CropImageStudio"));
const OptionMoment = lazy(() => import("./ModalViews/OptionMoment"));

export default function LocketCameraBeta() {
  const { navigation, camera, useloading, post } = useApp();

  const {
    isHomeOpen,
    isProfileOpen,
    isBottomOpen,
    isFullview,
    setIsHomeOpen,
    setIsProfileOpen,
    setIsBottomOpen,
    setFriendsTabOpen,
    setIsSidebarOpen,
    isOptionModalOpen,
    setOptionModalOpen,
  } = navigation;
  const { canvasRef } = camera;
  const { postOverlay } = post;

  return (
    <>
      <MainHomeScreen />
      {/* Page Views */}
      <LeftHomeScreen setIsProfileOpen={setIsProfileOpen} />
      <RightHomeScreen setIsHomeOpen={setIsHomeOpen} />
      {/* Modal Views */}
      <FriendsContainer />
      <CropImageStudio />
      <ScreenCustomeStudio />
      <EmojiPicker />
      <OptionMoment
        setOptionModalOpen={setOptionModalOpen}
        isOptionModalOpen={isOptionModalOpen}
      />
      {/* Canvas for capturing image/video */}
      <canvas ref={canvasRef} className="hidden" />
      {/* Audio Music */}
      {postOverlay.music && <MusicPlayer music={postOverlay.music} />}
      <span className="fixed pointer-events-none z-60 bottom-3 right-4 text-xs text-gray-400 select-none">
        © Locket Dio
      </span>
    </>
  );
}
