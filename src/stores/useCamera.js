// src/hooks/useCamera.js
import { useState, useRef } from "react";

export const useCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const cameraRef = useRef(null);

  const [capturedMedia, setCapturedMedia] = useState(null);
  const [permissionChecked, setPermissionChecked] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [cameraMode, setCameraMode] = useState("user");
  const [zoomLevel, setZoomLevel] = useState("1x"); // "0.5x" | "1x" | "3x"
  const [deviceId, setDeviceId] = useState(null); // deviceId của camera hiện tại

  const IMAGE_SIZE_PX = 1920;
  const VIDEO_RESOLUTION_PX = 1080;
  const MAX_RECORD_TIME = 10;

  return {
    videoRef,
    streamRef,
    cameraRef,
    canvasRef,
    capturedMedia,
    setCapturedMedia,
    permissionChecked,
    setPermissionChecked,
    holdTime,
    setHoldTime,
    rotation,
    setRotation,
    isHolding,
    setIsHolding,
    loading,
    setLoading,
    countdown,
    setCountdown,
    cameraActive,
    setCameraActive,
    cameraMode,
    setCameraMode,
    IMAGE_SIZE_PX,
    VIDEO_RESOLUTION_PX,
    MAX_RECORD_TIME,
    deviceId, setDeviceId,
    zoomLevel, setZoomLevel
  };
};
