import React, { useEffect, useRef } from "react";
import { useApp } from "../../../../../context/AppContext";
import { RefreshCcw } from "lucide-react";

const MAX_RECORD_TIME = 10; // giây

const CameraButton = () => {
  const { camera, post, useloading } = useApp();
  const {
    videoRef,
    streamRef,
    canvasRef,
    cameraRef,
    rotation,
    isHolding, setIsHolding,
    permissionChecked, setPermissionChecked,
    holdTime, setHoldTime,
    setRotation,
    cameraMode, setCameraMode,
    cameraActive, setCameraActive,
    setLoading
  } = camera;
  const { preview, setPreview, setSelectedFile, setSizeMedia} = post;
  const { setIsCaptionLoading } = useloading;

  const holdStartTimeRef = useRef(null);
  const holdTimeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    console.log("🎬 Trạng thái isHolding thay đổi:", isHolding);
  }, [isHolding]);
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };
  const startHold = () => {
    holdStartTimeRef.current = Date.now();
    holdTimeoutRef.current = setTimeout(() => {
      // Bắt đầu quay video
      console.log("📹 Bắt đầu quay video");
      setIsHolding(true);

      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        const chunks = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          setCameraActive(false);
          setLoading(true);

          const blob = new Blob(chunks, { type: "video/webm" });
          const file = new File([blob], "video.webm", { type: "video/webm" });
          const videoUrl = URL.createObjectURL(file);

          const fileSizeInMB = file.size / (1024 * 1024); // size in MB
          setSizeMedia(fileSizeInMB.toFixed(2));
          
          setPreview({ type: "video", data: videoUrl });

          setSelectedFile(file);
          setCameraActive(false);
          setIsCaptionLoading(true)
          stopCamera()
          setLoading(false);
        };

        recorder.start();
        setTimeout(() => {
          if (recorder.state === "recording") {
            recorder.stop();
            setIsHolding(false);
          }
        }, MAX_RECORD_TIME * 1000);
      }
    }, 300);
  };

  const endHold = () => {
    const heldTime = Date.now() - holdStartTimeRef.current;
    clearTimeout(holdTimeoutRef.current);
    setIsHolding(false);
    clearInterval(intervalRef.current);
    setHoldTime(heldTime);

    if (heldTime < 300) {
      // Chụp ảnh
      console.log("📸 Chụp ảnh");

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (cameraMode === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "photo.png", { type: "image/png" });
          const imgUrl = URL.createObjectURL(file);
          setPreview({ type: "image", data: imgUrl });

          const fileSizeInMB = file.size / (1024 * 1024); // size in MB
          setSizeMedia(fileSizeInMB.toFixed(2));

          setSelectedFile(file);
          setIsCaptionLoading(true)
          setCameraActive(false);
        }
      }, "image/png");
    } else {
      // Kết thúc quay
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }

    // Fix iOS
    setTimeout(() => {
      const videoEl = document.querySelector("video");
      if (videoEl) videoEl.setAttribute("playsinline", "true");
    }, 100);
  };

  const handleRotateCamera = async () => {
    setRotation((prev) => prev + 180);
    const newMode = cameraMode === "user" ? "environment" : "user";
    setCameraMode(newMode);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newMode },
        audio: false
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
      <button
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        className="relative flex items-center justify-center w-22 h-22"
      >
        <div
          className={`absolute w-22 h-22 border-5 border-base-content/50 rounded-full z-10 ${
            isHolding ? "animate-lightPulse" : ""
          }`}
        ></div>
        <div
          className={`absolute rounded-full btn w-18 h-18 outline-accent bg-base-content z-0 ${
            isHolding ? "animate-pulseBeat" : ""
          }`}
        ></div>
      </button>
      <button className="cursor-pointer" onClick={handleRotateCamera}>
        <RefreshCcw
          size={35}
          className="transition-transform duration-500"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </button>
    </>
  );
};

export default CameraButton;
