import React, {
  lazy,
  Suspense,
  useEffect,
  useRef,
} from "react";

import MediaSizeInfo from "@/components/ui/MediaSizeInfo";
import BorderProgress from "./SquareProgress";
import { showInfo } from "@/components/Toast";
import { getAvailableCameras } from "@/utils";
const AutoResizeCaption = lazy(() => import("./CaptionViews"));
import { useApp } from "@/context/AppContext";

const MediaPreview = ({ capturedMedia }) => {
  const { post, useloading, camera } = useApp();
  const {
    selectedFile,
    preview,
    isSizeMedia,
  } = post;
  const {
    streamRef,
    videoRef,
    cameraActive,
    setCameraActive,
    cameraMode,
    zoomLevel,
    setZoomLevel,
    deviceId,
    setDeviceId,
  } = camera;
  const { setSendLoading } = useloading;

  const cameraInitialized = useRef(false);
  const lastCameraMode = useRef(cameraMode);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    cameraInitialized.current = false;
  };

  const startCamera = async () => {
    try {
      if (
        cameraInitialized.current &&
        streamRef.current &&
        lastCameraMode.current === cameraMode
      ) {
        if (videoRef.current && !videoRef.current.srcObject) {
          videoRef.current.srcObject = streamRef.current;
        }
        return;
      }

      if (
        streamRef.current &&
        lastCameraMode.current !== cameraMode
      ) {
        stopCamera();
      }

      let videoConstraints = {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        facingMode: cameraMode || "user",
      };

      const isUser = cameraMode === "user";
      const isZoom05 = zoomLevel === "0.5x";

      if (!(isUser && isZoom05)) {
        videoConstraints = {
          ...videoConstraints,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: 1 / 1,
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false,
      });

      streamRef.current = stream;
      cameraInitialized.current = true;
      lastCameraMode.current = cameraMode;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setCameraActive(false);
      cameraInitialized.current = false;
    }
  };

  useEffect(() => {
    if (cameraActive && !preview && !selectedFile && !capturedMedia) {
      startCamera();
    } else if (!cameraActive || preview || selectedFile || capturedMedia) {
      if (streamRef.current && (preview || selectedFile || capturedMedia)) {
        stopCamera();
      }
    }

    return () => {
      if (!preview && !selectedFile && !capturedMedia) {
        stopCamera();
      }
    };
  }, [cameraActive, cameraMode, preview, selectedFile, capturedMedia]);

  useEffect(() => {
    if (!preview && !selectedFile && !capturedMedia && !cameraActive) {
      setCameraActive(true);
    }
  }, [preview, selectedFile, capturedMedia, setCameraActive, cameraActive]);

  const handleCycleZoomCamera = async () => {
    const cameras = await getAvailableCameras();
    const isBackCamera = cameraMode === "environment";
    const isFrontCamera = cameraMode === "user";

    let newZoom = "1x";
    let newDeviceId = null;

    if (isFrontCamera) {
      newZoom = zoomLevel === "1x" ? "0.5x" : "1x";
      newDeviceId = cameras?.frontCameras?.[0]?.deviceId;
    } else if (isBackCamera) {
      if (zoomLevel === "1x") {
        newZoom = "0.5x";
        newDeviceId = cameras?.backUltraWideCamera?.deviceId;
      } else if (zoomLevel === "0.5x") {
        newZoom = "3x";
        newDeviceId = cameras?.backZoomCamera?.deviceId;
      } else if (zoomLevel === "3x") {
        newZoom = "1x";
        newDeviceId = cameras?.backNormalCamera?.deviceId;
      }

      if (!newDeviceId && zoomLevel !== "1x") {
        newZoom = "1x";
        newDeviceId =
          cameras?.backNormalCamera?.deviceId ||
          cameras?.backCameras?.[0]?.deviceId;
      }
    }

    if (newDeviceId) {
      setZoomLevel(newZoom);
      setDeviceId(newDeviceId);
      setCameraActive(false);
      setTimeout(() => setCameraActive(true), 300);
    } else {
      showInfo("Không tìm thấy camera phù hợp để chuyển zoom");
    }
  };

  return (
    <>
      <h1 className="text-3xl mb-1.5 font-semibold font-lovehouse">
        Locket Camera
      </h1>
      <div
        className={`relative w-full max-w-md aspect-square bg-gray-800 rounded-[65px] overflow-hidden transition-transform duration-500 `}
      >
        {!preview && !selectedFile && !capturedMedia && cameraActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`
              w-full h-full object-cover transition-all duration-500 ease-in-out
              ${cameraMode === "user" ? "scale-x-[-1]" : ""}
              ${cameraActive ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
            `}
          />
        )}

        {!preview && !selectedFile && (
          <div className="absolute inset-0 top-7 px-7 z-30 pointer-events-none flex justify-between text-base-content text-xs font-semibold">
            <button
              onClick={() => showInfo("Chức năng này sẽ sớm có mặt!")}
              className="pointer-events-auto w-7 h-7 p-1.5 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center"
            >
              <img src="/icons/bolt.fill.png" alt="" />
            </button>

            <button
              onClick={handleCycleZoomCamera}
              className="pointer-events-auto w-6 h-6 text-primary-content font-semibold rounded-full bg-white/30 backdrop-blur-md p-3.5 flex items-center justify-center"
            >
              {zoomLevel}
            </button>
          </div>
        )}

        {preview?.type === "video" && (
          <video
            src={preview.data}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover ${preview ? "opacity-100" : "opacity-0"}`}
          />
        )}

        {preview?.type === "image" && (
          <img
            src={preview.data}
            alt="Preview"
            className={`w-full h-full object-cover select-none transition-all duration-300 ${preview ? "opacity-100" : "opacity-0"}`}
          />
        )}

        {preview && selectedFile && (
          <div className="absolute z-10 inset-x-0 bottom-0 px-4 pb-4 transition-all duration-500">
            <Suspense fallback={null}>
              <AutoResizeCaption />
            </Suspense>
          </div>
        )}

        <div className="absolute inset-0 z-50 pointer-events-none">
          <BorderProgress />
        </div>
      </div>

      <div className="mt-2 text-sm flex items-center justify-center pl-3">
        <MediaSizeInfo />
      </div>
    </>
  );
};

export default MediaPreview;
