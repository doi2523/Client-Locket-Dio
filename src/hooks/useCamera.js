// src/hooks/useCamera.js
import { useState, useRef } from "react";

export const useCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [rotation, setRotation] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);

  return {
    videoRef,
    canvasRef,
    capturedMedia,
    setCapturedMedia,
    selectedFile,
    setSelectedFile,
    caption,
    setCaption,
    rotation,
    setRotation,
    isHolding,
    setIsHolding,
    loading,
    setLoading,
    countdown,
    setCountdown,
  };
};
