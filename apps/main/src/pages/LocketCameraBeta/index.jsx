import React, { lazy, Suspense, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import MainHomeScreen from "./MainHomeScreen";
import { MusicPlayer } from "./Widgets/MusicPlayer";
import { useOverlayEditorStore, useUIStore } from "@/stores";
// import CropVideoStudio from "./ModalViews/CropVideoStudio";
// const Snowfall = lazy(() => import("@/components/Effects/SnowBanner"));
const BgLocketDio = lazy(() => import("@/components/Effects/BgLocketDio"));

const LeftHomeScreen = lazy(() => import("./LeftHomeScreen"));
const RightHomeScreen = lazy(() => import("./RightHomeScreen"));

const FriendsContainer = lazy(() => import("./ModalViews/FriendsContainer"));
const EmojiPicker = lazy(() => import("./ModalViews/EmojiStudio"));
const ScreenCustomeStudio = lazy(() => import("../../features/CustomeStudio"));
const CropImageStudio = lazy(() => import("@/features/EditorStudio/CropImageStudio"));
const OptionMoment = lazy(() => import("./ModalViews/OptionMoment"));

export default function LocketCameraBeta() {
  const { navigation, camera } = useApp();

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

  const overlayData = useOverlayEditorStore((s) => s.overlayData);
  const background = useUIStore((s) => s.background);

  useEffect(() => {
    import("./LeftHomeScreen");
    import("./RightHomeScreen");
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <BgLocketDio bgSrc={background?.url} />
      </Suspense>

      <MainHomeScreen />
      {/* Page Views */}
      <Suspense fallback={null}>
        <LeftHomeScreen setIsProfileOpen={setIsProfileOpen} />
        <RightHomeScreen setIsHomeOpen={setIsHomeOpen} />
      </Suspense>

      {/* Modal Views */}
      <Suspense fallback={null}>
        <FriendsContainer />
        <CropImageStudio />
        <ScreenCustomeStudio />
        {/* <CropVideoStudio /> */}
        <EmojiPicker />
        <OptionMoment
          setOptionModalOpen={setOptionModalOpen}
          isOptionModalOpen={isOptionModalOpen}
        />
      </Suspense>

      {/* Canvas for capturing image/video */}
      <canvas ref={canvasRef} className="hidden" />
      {/* Audio Music */}
      {overlayData.type === "music" && <MusicPlayer music={overlayData.payload} />}
      <span className="fixed pointer-events-none z-60 bottom-3 right-4 text-xs text-gray-400 select-none">
        © Locket Dio
      </span>
    </>
  );
}
