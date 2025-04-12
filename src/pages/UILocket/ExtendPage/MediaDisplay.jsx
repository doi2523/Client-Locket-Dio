import React, { useEffect } from "react";
import AutoResizeTextarea from "./AutoResizeTextarea";
import Hourglass from "../../../components/UI/Loading/hourglass";
import { useApp } from "../../../context/AppContext";
import MediaSizeInfo from "../../../components/UI/MediaSizeInfo";
import BorderProgress from "../../../components/UI/SquareProgress";

const MediaPreview = ({ loading, countdown, capturedMedia }) => {
  const { post, useloading, camera } = useApp();
  const { selectedFile, preview, isSizeMedia } = post;
  const { streamRef, videoRef, cameraActive, setCameraActive, cameraMode } =
    camera;
  const { isCaptionLoading, uploadLoading } = useloading;

  // Bật camera nếu cần
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: cameraMode || "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
            // iOS không hỗ trợ zoom trực tiếp nhưng vẫn nên thử
            zoom: 1,
          },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current && !videoRef.current.srcObject) {
          videoRef.current.srcObject = stream;
          console.log("🎥 Gán stream vào videoRef", stream);
        }
      } catch (err) {
        console.error("🚫 Không thể truy cập camera:", err);
      }
    };

    if (cameraActive && !streamRef.current) {
      startCamera();
    }
  }, [cameraActive, cameraMode]);

  useEffect(() => {
    console.log("📷 useEffect kiểm tra media", {
      preview,
      selectedFile,
      capturedMedia,
    });
    if (!preview && !selectedFile && !capturedMedia) {
      console.log("✅ Không có media -> Bật lại camera");
      setCameraActive(true);
    }
  }, [preview, selectedFile, capturedMedia, setCameraActive]);

  return (
    <>
      <h1 className="text-3xl mb-1.5 font-semibold font-lovehouse">
        Locket Camera
      </h1>

      <div
        className={`relative w-full max-w-md aspect-square bg-gray-800 rounded-[65px] overflow-hidden ${
          loading ? "border border-red-500" : ""
        }`}
      >
        {/* Overlay loading */}
        {uploadLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 text-white text-lg font-medium">
            <Hourglass
              size={50}
              stroke={2}
              bgOpacity={0.1}
              speed={1.5}
              color="white"
            />
            <div>Đang xử lý tệp...</div>
          </div>
        )}

        {/* Hiển thị camera nếu chưa có media */}
        {!preview && !selectedFile && !capturedMedia && cameraActive && (
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

        {/* Preview media */}
        {preview?.type === "video" && (
          <video
            src={preview.data}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover`}
          />
        )}

        {preview?.type === "image" && (
          <img
            src={preview.data}
            alt="Preview"
            className="w-full h-full object-cover select-none"
          />
        )}

        {/* Caption */}
        {preview && selectedFile && (
          <div
            className={`absolute z-50 inset-x-0 bottom-0 px-4 pb-4 transition-opacity duration-500 ${
              isCaptionLoading ? "opacity-100" : "opacity-0"
            }`}
          >
            <AutoResizeTextarea />
          </div>
        )}

        {/* Viền loading */}
        <div className="absolute inset-0 z-50 pointer-events-none">
          <BorderProgress />
        </div>
      </div>

      {/* Media size info */}
      <div className="mt-2 text-sm flex items-center justify-center pl-3">
        <MediaSizeInfo />
      </div>
    </>
  );
};

export default MediaPreview;
