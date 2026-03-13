// src/hooks/useCamera.js
import { useState, useRef, useEffect } from "react";

export const useCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const cameraRef = useRef(null);

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

  // ✅ Lấy từ localStorage hoặc mặc định frame đầu tiên
  const [selectedFrame, setSelectedFrame] = useState(() => {
    const saved = localStorage.getItem("selectedFrame");
    return saved ? JSON.parse(saved) : frames[0];
  });

  // ✅ Lưu vào localStorage khi thay đổi
  useEffect(() => {
    if (selectedFrame) {
      localStorage.setItem("selectedFrame", JSON.stringify(selectedFrame));
    }
  }, [selectedFrame]);

  return {
    videoRef,
    streamRef,
    cameraRef,
    canvasRef,
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
    deviceId,
    setDeviceId,
    zoomLevel,
    setZoomLevel,
    selectedFrame,
    setSelectedFrame,
  };
};
