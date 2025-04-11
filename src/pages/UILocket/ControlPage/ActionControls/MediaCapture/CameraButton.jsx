import React, { useEffect, useRef } from "react";
import { useApp } from "../../../../../context/AppContext";
import { RefreshCcw } from "lucide-react";

const CameraButton = () => {
  const { camera } = useApp();
  const {
    videoRef,
    streamRef,
    cameraRef,
    rotation,
    isHolding, setIsHolding,
    permissionChecked, setPermissionChecked,
    holdTime, setHoldTime,
    setRotation,
    cameraMode, setCameraMode,
    cameraActive, setCameraActive
  } = camera;

  const holdStartTimeRef = useRef(null);
  const holdTimeoutRef = useRef(null);

  // 2. Bắt đầu giữ nút
  const startHold = () => {
    holdStartTimeRef.current = Date.now();
    setIsHolding(true);

    holdTimeoutRef.current = setTimeout(() => {
      // Nếu giữ trên 300ms: quay video
      console.log("📹 Bắt đầu quay video");
      // TODO: Gọi hàm bắt đầu quay video ở đây
    }, 300);
  };

  // 3. Kết thúc giữ nút
  const endHold = () => {
    const heldTime = Date.now() - holdStartTimeRef.current;
    clearTimeout(holdTimeoutRef.current);
    setIsHolding(false);
    setHoldTime(heldTime);

    if (heldTime < 300) {
      // Nếu giữ dưới 300ms: chụp ảnh
      console.log("📸 Chụp ảnh");
      // TODO: Gọi hàm chụp ảnh ở đây
    } else {
      console.log("🛑 Dừng quay video");
      // TODO: Gọi hàm dừng quay video ở đây
    }
  };

  // 4. Xoay camera (chuyển trước/sau)
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
