import React from "react";
import AutoResizeTextarea from "./AutoResizeTextarea";
import Hourglass from "../../../components/UI/Loading/hourglass";
import { useApp } from "../../../context/AppContext";

const MediaPreview = ({
  loading,
  countdown,
  cameraActive,
  videoRef,
  cameraMode,
  capturedMedia,
  caption,
  setCaption,
  selectedColors
}) => {
    const {post} = useApp();
    const { selectedFile } = post;
  return (
    <>
      <h1 className="text-3xl mb-1.5 font-semibold font-lovehouse">
        Locket Camera
      </h1>
      <div
        className={`relative w-full max-w-md aspect-square transform bg-gray-800 rounded-[65px] overflow-hidden ${
          loading ? "border border-red-500" : ""
        }`}
      >
        {/* Viền động chạy vòng tròn */}
        <div className="absolute inset-0 rounded-[60px]"></div>

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 bg-opacity-50 z-50 gap-3 text-white text-lg font-medium">
            <Hourglass
              size={50}
              stroke={2}
              bgOpacity={0.1}
              speed={1.5}
              color="white"
            />
            <div>Đang xử lý video...</div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <p> {countdown}s⏳</p>
            </div>
          </div>
        )}

        {!selectedFile && cameraActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${
              cameraMode === "user" ? "scale-x-[-1]" : ""
            }`}
          />
        )}

        {selectedFile && selectedFile.type === "video" && (
          <video
            src={selectedFile.data}
            autoPlay
            loop
            playsInline
            muted
            className="w-full h-full object-cover"
            onClick={(e) => e.preventDefault()}
          />
        )}

        {selectedFile && selectedFile.type === "image" && (
          <img
            src={selectedFile.data}
            alt="Selected File"
            className="w-full h-full object-cover select-none"
          />
        )}

        {(capturedMedia || selectedFile) && (
          <AutoResizeTextarea/>
        )}
      </div>
    </>
  );
};

export default MediaPreview;
