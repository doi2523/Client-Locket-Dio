import React, { useContext, useEffect, useRef } from "react";
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

  // Ref để theo dõi trạng thái camera
  const cameraInitialized = useRef(false);
  const lastCameraMode = useRef(cameraMode);
  const lastCameraHD = useRef(iscameraHD);

  // Hàm dừng camera được tối ưu
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    cameraInitialized.current = false;
  };

  // Hàm khởi động camera được tối ưu
  const startCamera = async () => {
    try {
      // Nếu camera đã được khởi tạo và chế độ không thay đổi, không cần khởi tạo lại
      if (
        cameraInitialized.current && 
        streamRef.current && 
        lastCameraMode.current === cameraMode &&
        lastCameraHD.current === iscameraHD
      ) {
        // Chỉ cần gán lại stream vào video element
        if (videoRef.current && !videoRef.current.srcObject) {
          videoRef.current.srcObject = streamRef.current;
        }
        return;
      }

      // Dừng camera cũ nếu có thay đổi cấu hình
      if (
        streamRef.current && 
        (lastCameraMode.current !== cameraMode || lastCameraHD.current !== iscameraHD)
      ) {
        stopCamera();
      }

      // Cấu hình video constraints
      const videoConstraints = {
        facingMode: cameraMode || "user",
        width: { ideal: iscameraHD ? 1920 : 1280 },
        height: { ideal: iscameraHD ? 1080 : 720 },
      };

      // Chỉ yêu cầu quyền truy cập khi thực sự cần
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false,
      });

      streamRef.current = stream;
      cameraInitialized.current = true;
      lastCameraMode.current = cameraMode;
      lastCameraHD.current = iscameraHD;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      console.log("🎥 Camera khởi động thành công");
    } catch (err) {
      // console.error("🚫 Không thể truy cập camera:", err);
      setCameraActive(false);
      cameraInitialized.current = false;
    }
  };

  // Effect chính để quản lý camera
  useEffect(() => {
    if (cameraActive && (!preview && !selectedFile && !capturedMedia)) {
      startCamera();
    } else if (!cameraActive || preview || selectedFile || capturedMedia) {
      // Chỉ dừng camera khi thực sự cần thiết
      if (streamRef.current && (preview || selectedFile || capturedMedia)) {
        stopCamera();
      }
    }

    // Cleanup khi component unmount
    return () => {
      if (!preview && !selectedFile && !capturedMedia) {
        // Chỉ cleanup nếu không có media đang hiển thị
        stopCamera();
      }
    };
  }, [cameraActive, cameraMode, iscameraHD, preview, selectedFile, capturedMedia]);

  // Effect để bật lại camera khi không có media
  useEffect(() => {
    if (!preview && !selectedFile && !capturedMedia && !cameraActive) {
      // console.log("✅ Không có media -> Bật lại camera");
      setCameraActive(true);
    }
  }, [preview, selectedFile, capturedMedia, setCameraActive, cameraActive]);

  const handleChangeCamera = () => {
    setIsCameraHD((prev) => !prev);
  };

  // Hàm để chuyển đổi camera mode (front/back)
  const handleSwitchCamera = () => {
    const newMode = cameraMode === "user" ? "environment" : "user";
    // Cập nhật camera mode thông qua context/state management
    // setCameraMode(newMode); // Giả sử bạn có hàm này
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