import React from "react";
import { useApp } from "@/context/AppContext";
import { RefreshCcw } from "lucide-react";

const CameraToggle = () => {
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
    setCameraMode(newMode);
    // ✅ Reset deviceId để tránh bị giữ lại cam cũ (zoom cam)
    setZoomLevel("1x");
    setDeviceId(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newMode },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Lỗi khi đổi camera:", error);
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

export default CameraToggle;
