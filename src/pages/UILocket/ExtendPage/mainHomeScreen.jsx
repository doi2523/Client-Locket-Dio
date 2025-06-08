import React from "react";
import MediaPreview from "./MediaDisplay";
import { useApp } from "../../../context/AppContext";
import ActionControls from "../ActionControls";
import HistoryArrow from "./Button/HistoryButton";
import SelectFiendsList from "./Container/SelectFriendsList";
import HeaderAfterCapture from "./Header/HeaderAfterCapture";
import HeaderBeforeCapture from "./Header/HeaderBeforeCapture";
import { MusicPlayer } from "../../../components/UI/Spotify/MusicPlayer";

const MainHomeScreen = () => {
  const { navigation, camera, useloading, post } = useApp();

  const { isHomeOpen, isProfileOpen, isBottomOpen, isFullview, setIsFullview } = navigation;
  const { sendLoading } = useloading;
  const { canvasRef } = camera;
  const { selectedFile, postOverlay } = post;

  // Hai giao diện tạm giống nhau, bạn có thể sửa ở đây theo isFullview
  const renderFullview = () => (
<div
  className={`flex flex-col h-screen select-none overflow-hidden ${
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
    <HeaderBeforeCapture selectedFile={selectedFile}/>
  )}

  <div className="flex flex-1 flex-col justify-around py-5 items-center w-full">
    <MediaPreview />
    <ActionControls />
    {selectedFile ? <SelectFiendsList /> : <HistoryArrow />}
  </div>

  <canvas ref={canvasRef} className="hidden" />
</div>

  );

  const renderNormalView = () => (
    <div
      className={`flex h-full select-none flex-col items-center justify-start overflow-hidden ${
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
        <HeaderBeforeCapture selectedFile={selectedFile}/>
      )}
      <MediaPreview />
      <ActionControls />
      {selectedFile ? <SelectFiendsList /> : <HistoryArrow />}{" "}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

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
      {isFullview ? renderFullview() : renderNormalView()}
      {postOverlay.music && <MusicPlayer music={postOverlay.music} />}
    </div>
  );
};

export default MainHomeScreen;
