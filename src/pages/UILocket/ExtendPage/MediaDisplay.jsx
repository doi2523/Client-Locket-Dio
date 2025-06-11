import React, { useContext, useEffect } from "react";
import AutoResizeCaption from "./AutoResizeCaption";
import Hourglass from "../../../components/UI/Loading/hourglass";
import { useApp } from "../../../context/AppContext";
import MediaSizeInfo from "../../../components/UI/MediaSizeInfo";
import BorderProgress from "../../../components/UI/SquareProgress";
import { showInfo } from "../../../components/Toast";
import { AuthContext } from "../../../context/AuthLocket";

const MediaPreview = ({ capturedMedia }) => {
  const { userPlan } = useContext(AuthContext);
  const { post, useloading, camera } = useApp();
  const { selectedFile, preview, isSizeMedia } = post;
  const {
    streamRef,
    videoRef,
    cameraActive,
    setCameraActive,
    cameraMode,
    iscameraHD,
    setIsCameraHD,
  } = camera;
  const { isCaptionLoading, uploadLoading, sendLoading, setSendLoading } =
    useloading;

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
          // console.log("🎥 Gán stream vào videoRef", stream);
        }
      } catch (err) {
        console.error("🚫 Không thể truy cập camera:", err);
        setCameraActive(false);
      }
    };

    if (cameraActive && !streamRef.current) {
      startCamera();
    }
  }, [cameraActive, cameraMode]);

  useEffect(() => {
    if (!preview && !selectedFile && !capturedMedia) {
      // console.log("✅ Không có media -> Bật lại camera");
      setCameraActive(true);
    }
  }, [preview, selectedFile, capturedMedia, setCameraActive]);

  const handleChangeCamera = () => {
    setIsCameraHD((prev) => !prev);
  };

  return (
    <>
      <h1 className="text-3xl mb-1.5 font-semibold font-lovehouse">
        Locket Camera
      </h1>

      <div
        className={`relative w-full max-w-md aspect-square bg-gray-800 rounded-[65px] overflow-hidden transition-transform duration-500 `}
      >
        {/* Hiển thị camera nếu chưa có media */}
        {!preview && !selectedFile && !capturedMedia && cameraActive && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`
              w-full h-full object-cover transition-all duration-200 ease-in-out
              ${cameraMode === "user" ? "scale-x-[-1]" : ""}
              ${cameraActive ? "opacity-100 scale-100" : "opacity-0 scale-95"}
            `}
            />
          </>
        )}
        {!preview && !selectedFile && (
          <div className="absolute inset-0 top-7 px-7 z-50 pointer-events-none flex justify-between text-base-content text-xs font-semibold">
            <button
              onClick={handleChangeCamera}
              className="pointer-events-auto w-6 h-6 rounded-full bg-white/30 backdrop-blur-md p-3.5 flex items-center justify-center"
            >
              {iscameraHD ? "HD" : "SD"}
            </button>

            <button
              onClick={() => showInfo("Chức năng này sẽ sớm có mặt!")}
              className="pointer-events-auto w-6 h-6 rounded-full bg-white/30 backdrop-blur-md p-3.5 flex items-center justify-center"
            >
              1x
            </button>
          </div>
        )}
        {/* Preview media */}
        {preview?.type === "video" && (
          <video
            src={preview.data}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover ${
              preview ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {preview?.type === "image" && (
          <img
            src={preview.data}
            alt="Preview"
            className={`w-full h-full object-cover select-none transition-all duration-300 ${
              preview ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Caption */}
        {preview && selectedFile && (
          <div
            className={`absolute z-10 inset-x-0 bottom-0 px-4 pb-4 transition-all duration-500 ${
              isCaptionLoading ? "opacity-100" : "opacity-0"
            }`}
          >
            <AutoResizeCaption />
          </div>
        )}

        {/* <div className="absolute h-full w-full top-0 left-0 z-50 pointer-events-none">
        <img src="./images/Leaves-Large_Normal.png" alt="" className="h-full w-full"/>
        </div> */}
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
