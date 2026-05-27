import React from "react";
import { useApp } from "@/context/AppContext";
import { getAvailableCameras } from "@/utils";
import { RefreshCcw } from "lucide-react";

const CameraToggleAndroid = () => {
  const { camera, post, useloading } = useApp();
  const {
    videoRef,
    streamRef,
    canvasRef,
    cameraRef,
    rotation,
    isHolding,
    setIsHolding,
    permissionChecked,
    setPermissionChecked,
    holdTime,
    setHoldTime,
    setRotation,
    cameraMode,
    setCameraMode,
    cameraActive,
    setCameraActive,
    setLoading,
    setDeviceId,
    setZoomLevel,
  } = camera;

  const handleRotateCamera = async () => {
    setRotation((prev) => prev - 180);
    const newMode = cameraMode === "user" ? "environment" : "user";
    let nextDeviceId = null;

    try {
      const cameras = await getAvailableCameras();
      const currentTrack = streamRef.current?.getVideoTracks?.()?.[0] || null;
      const currentDeviceId = currentTrack?.getSettings?.()?.deviceId;
      const fallbackDevice = cameras?.allCameras?.find(
        (device) => device.deviceId !== currentDeviceId
      );

      nextDeviceId =
        newMode === "environment"
          ? cameras?.backNormalCamera?.deviceId ||
            cameras?.backCameras?.[0]?.deviceId ||
            fallbackDevice?.deviceId ||
            null
          : cameras?.frontCameras?.[0]?.deviceId ||
            fallbackDevice?.deviceId ||
            null;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách camera:", error);
    }

    setCameraMode(newMode);
    setZoomLevel("1x");
    setDeviceId(nextDeviceId);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <>
      <button className="cursor-pointer" onClick={handleRotateCamera}>
        <RefreshCcw
          size={35}
          className="transition-transform duration-500 active:scale-95"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </button>
    </>
  );
};

export default CameraToggleAndroid;
