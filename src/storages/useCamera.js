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

  return {
    videoRef,
    streamRef,
    cameraRef,
    canvasRef,
    capturedMedia,
    setCapturedMedia,
    permissionChecked, setPermissionChecked,
    holdTime, setHoldTime,
    rotation,
    setRotation,
    isHolding, setIsHolding,
    loading,
    setLoading,
    countdown,
    setCountdown,
    cameraActive, setCameraActive,
    cameraMode, setCameraMode
  };
};
