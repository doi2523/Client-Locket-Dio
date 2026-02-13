import React, { lazy, Suspense, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import MainHomeScreen from "./MainHomeScreen";
import { MusicPlayer } from "./Widgets/MusicPlayer";
import { useUIStore } from "@/stores/useUIStore";
// const Snowfall = lazy(() => import("@/components/Effects/SnowBanner"));
const BgLocketDio = lazy(() => import("@/components/Effects/BgLocketDio"));

const LeftHomeScreen = lazy(() => import("./LeftHomeScreen"));
const RightHomeScreen = lazy(() => import("./RightHomeScreen"));

const FriendsContainer = lazy(() => import("./ModalViews/FriendsContainer"));
const EmojiPicker = lazy(() => import("./ModalViews/EmojiStudio"));
const ScreenCustomeStudio = lazy(() => import("./ModalViews/CustomeStudio"));
const CropImageStudio = lazy(() => import("./ModalViews/CropImageStudio"));
const OptionMoment = lazy(() => import("./ModalViews/OptionMoment"));

export default function LocketCameraBeta() {
  const { navigation, camera, post } = useApp();

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
  const background = useUIStore((s) => s.background);

  useEffect(() => {
    import("./LeftHomeScreen");
    import("./RightHomeScreen");
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <BgLocketDio bgSrc={background?.url}/>
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
        <EmojiPicker />
        <OptionMoment
          setOptionModalOpen={setOptionModalOpen}
          isOptionModalOpen={isOptionModalOpen}
        />
      </Suspense>

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
