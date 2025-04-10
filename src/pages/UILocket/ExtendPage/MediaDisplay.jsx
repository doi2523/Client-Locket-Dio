import React, { useEffect } from "react";
import AutoResizeTextarea from "./AutoResizeTextarea";
import Hourglass from "../../../components/UI/Loading/hourglass";
import { useApp } from "../../../context/AppContext";
import MediaSizeInfo from "../../../components/UI/MediaSizeInfo";

const MediaPreview = ({
  loading,
  countdown,
  cameraActive,
  videoRef,
  cameraMode,
  capturedMedia,
}) => {
  const { post, useloading } = useApp();
  const { selectedFile, preview, setPreview, isSizeMedia } = post;
  const { isCaptionLoading, setIsCaptionLoading, uploadLoading } = useloading;

  useEffect(() => {
    setIsCaptionLoading(!!(capturedMedia || selectedFile));
  }, [capturedMedia, selectedFile]);

  const renderMedia = () => {
    if (!selectedFile && cameraActive) {
      return (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${
            cameraMode === "user" ? "scale-x-[-1]" : ""
          }`}
        />
      );
    }

    if (preview?.type === "video") {
      return (
        <video
          src={preview.data}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          onClick={(e) => e.preventDefault()}
        />
      );
    }

    if (preview?.type === "image") {
      return (
        <img
          src={preview.data}
          alt="Selected File"
          className="w-full h-full object-cover"
        />
      );
    }

    return null;
  };

  return (
    <>
      <h1 className="text-3xl mb-1.5 font-semibold font-lovehouse">
        Locket Camera
      </h1>

      {/* Wrapper Media */}
      <div
        className={`relative w-full max-w-md aspect-square transform bg-gray-700 rounded-[65px] overflow-hidden ${
          loading ? "border border-red-500" : ""
        }`}
      >
        {uploadLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 z-50 gap-3 text-white text-lg font-medium">
            <Hourglass size={50} stroke={2} bgOpacity={0.1} speed={1.5} color="white" />
            <div>Đang xử lý tệp...</div>
          </div>
        )}

        {/* Hiển thị media (ảnh/video hoặc camera) */}
        {renderMedia()}

        {/* Caption textarea */}
        {(capturedMedia || preview) && (
          <div
            className={`absolute inset-x-0 bottom-0 px-4 pb-4 transition-opacity duration-500 ${
              isCaptionLoading ? "opacity-100" : "opacity-0"
            }`}
          >
            <AutoResizeTextarea />
          </div>
        )}
      </div>

      {/* Hiển thị thông tin dung lượng file ngay dưới khung */}
      <div className="mt-2 text-sm flex items-center justify-center pl-3">
        <MediaSizeInfo/>
      </div>
    </>
  );
};

export default MediaPreview;
