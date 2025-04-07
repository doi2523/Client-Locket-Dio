import React, { useEffect, useState } from "react";
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
}) => {
  const { post, useloading } = useApp();
  const { selectedFile, preview, setPreview } = post;
  const {
    isCaptionLoading,
    setIsCaptionLoading,
    uploadLoading,
    setUploadLoading,
  } = useloading;
  // Use effect to trigger the visibility change when capturedMedia or selectedFile is present
  useEffect(() => {
    if (capturedMedia || selectedFile) {
      setIsCaptionLoading(true);
    } else {
      setIsCaptionLoading(false);
    }
  }, [capturedMedia, selectedFile]);
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

        {uploadLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 bg-opacity-50 z-50 gap-3 text-white text-lg font-medium">
            <Hourglass
              size={50}
              stroke={2}
              bgOpacity={0.1}
              speed={1.5}
              color="white"
            />
            <div>Đang xử lý tệp...</div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              {/* <p> {countdown}s⏳</p> */}
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

        {preview && preview.type === "video" && (
          <video
            src={preview.data}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onClick={(e) => e.preventDefault()}
          />
        )}

        {preview && preview.type === "image" && (
          <img
            src={preview.data}
            alt="Selected File"
            className="w-full h-full object-cover"
          />
        )}

        <div
          className={`transition-opacity duration-500 ${
            isCaptionLoading ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transition: "opacity 0.5s linear",
          }}
        >
          {(capturedMedia || preview) && <AutoResizeTextarea />}
        </div>
      </div>
    </>
  );
};

export default MediaPreview;
