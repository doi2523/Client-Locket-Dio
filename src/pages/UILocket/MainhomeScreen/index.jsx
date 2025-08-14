import React, { lazy, Suspense } from "react";
import { useApp } from "@/context/AppContext";
import ActionControls from "../ActionControls";
import HeaderAfterCapture from "./Layout/HeaderAfterCapture";
import HeaderBeforeCapture from "./Layout/HeaderBeforeCapture";
import HistoryArrow from "./Layout/HistoryButton";
import SelectFriendsList from "./Views/SelectFriends";
import MediaPreview from "./Views/MediaDisplay";
import { MusicPlayer } from "./Views/MusicPlayer";
const ScreenCustomeStudio = lazy(() => import("./Views/CustomeStudio"));
const FriendsContainer = lazy(() => import("./Views/FriendsContainer"));

const MainHomeScreen = () => {
  const { navigation, camera, useloading, post } = useApp();

  const { isHomeOpen, isProfileOpen, isBottomOpen, isFullview } = navigation;
  const { sendLoading } = useloading;
  const { canvasRef } = camera;
  const { selectedFile, postOverlay } = post;

  // Hai giao diện tạm giống nhau, bạn có thể sửa ở đây theo isFullview
  const renderFullview = () => (
    <div
      className={`flex flex-col min-h-[100dvh] select-none overflow-hidden ${
        sendLoading === true
          ? "animate-slide-up"
          : sendLoading === false
          ? "animate-reset"
          : ""
      }`}
    >
      {selectedFile ? (
        <HeaderAfterCapture selectedFile={selectedFile} />
      ) : (
        <HeaderBeforeCapture selectedFile={selectedFile} />
      )}

      <div className="flex flex-1 flex-col justify-around pt-5 pb-8 items-center w-full">
        <MediaPreview />
        <ActionControls />
        {selectedFile ? <SelectFriendsList /> : <HistoryArrow />}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  const renderNormalView = () => (
    <div
      className={`flex min-h-[100dvh] h-full select-none flex-col items-center justify-between overflow-hidden ${
        sendLoading === true
          ? "animate-slide-up"
          : sendLoading === false
          ? "animate-reset"
          : ""
      }`}
    >
      {selectedFile ? (
        <HeaderAfterCapture selectedFile={selectedFile} />
      ) : (
        <HeaderBeforeCapture selectedFile={selectedFile} />
      )}
      <MediaPreview />
      <ActionControls />
      {selectedFile ? <SelectFriendsList /> : <HistoryArrow />}{" "}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  return (
    <>
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
        {isFullview ? renderFullview() : renderNormalView()}
        {postOverlay.music && <MusicPlayer music={postOverlay.music} />}
      </div>
      <Suspense fallback={null}>
        <ScreenCustomeStudio />
        <FriendsContainer />
      </Suspense>
    </>
  );
};

export default MainHomeScreen;
