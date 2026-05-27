import "./styles.css";
import React, { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { getVideoRecordLimit } from "@/hooks/useFeature";
import { CAMERA_CONFIG } from "@/config/configAlias";
import { detectAppEnvironment } from "@/utils/logic/checkIfRunningAsPWA";
import { SonnerInfo } from "@/components/ui/SonnerToast";

const CameraButton = () => {
  const { camera, post } = useApp();
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
  const { preview, setPreview, setSelectedFile, setSizeMedia } = post;

  const holdStartTimeRef = useRef(null);
  const holdTimeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const intervalRef = useRef(null);
  const animationFrameRef = useRef(null);
  const autoStopTimeoutRef = useRef(null);
  const isTryingToRecordRef = useRef(false);
  const isRecordingRef = useRef(false);

  const MAX_RECORD_TIME = getVideoRecordLimit();
  const RECORD_FPS = 30;
  const PWA_RECORD_SIZE = 720;

  const cleanupCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const cleanupRecordingResources = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
      autoStopTimeoutRef.current = null;
    }
  };

  const startHold = (e) => {
    // Prevent default để tránh conflict trên iOS
    e.preventDefault();

    isTryingToRecordRef.current = true;
    isRecordingRef.current = false; // Reset recording state
    holdStartTimeRef.current = Date.now();

    holdTimeoutRef.current = setTimeout(() => {
      if (!isTryingToRecordRef.current) return;

      // Đánh dấu đang recording
      isRecordingRef.current = true;
      setIsHolding(true);

      const video = videoRef.current;
      const isPWA = detectAppEnvironment();
      if (!video || video.readyState < 2) {
        SonnerInfo("Camera chưa sẵn sàng, vui lòng chờ giây lát...");
        isTryingToRecordRef.current = false;
        setIsHolding(false);
        return;
      }

      // Tạo canvas vuông
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
      });

      const side = Math.min(video.videoWidth, video.videoHeight);
      const outputSize = isPWA
        ? Math.min(CAMERA_CONFIG.videoResolutionPx, PWA_RECORD_SIZE)
        : CAMERA_CONFIG.videoResolutionPx;
      canvas.width = outputSize;
      canvas.height = outputSize;

      // Điều chỉnh FPS dựa trên môi trường
      const targetFPS = RECORD_FPS;
      const canvasStream = canvas.captureStream(RECORD_FPS);

      console.log(
        `🎥 Recording mode: ${isPWA ? "PWA" : "Web"}, FPS: ${
          targetFPS || "auto"
        }`
      );

      // Thử các MIME type khác nhau cho iOS
      let mimeType = "video/webm";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/mp4";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = ""; // Để MediaRecorder tự chọn
        }
      }

      // Cấu hình recorder options với bitrate phù hợp cho PWA
      const recorderOptions = mimeType ? { mimeType } : {};
      if (isPWA && mimeType) {
        recorderOptions.videoBitsPerSecond = 2500000; // 2.5 Mbps cho 720p/30fps
      } else if (mimeType) {
        recorderOptions.videoBitsPerSecond = 5000000; // 5 Mbps cho 1080p/30fps
      }

      const recorder = new MediaRecorder(canvasStream, recorderOptions);
      mediaRecorderRef.current = recorder;

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        console.log("📹 Video recording stopped, chunks:", chunks.length);
        cleanupRecordingResources();
        canvasStream.getTracks().forEach((track) => track.stop());

        if (chunks.length === 0) {
          console.error("No video data captured");
          isRecordingRef.current = false;
          setIsHolding(false);
          return;
        }

        // Tạo blob với MIME type phù hợp
        const finalMimeType = mimeType || "video/mp4";
        const blob = new Blob(chunks, { type: finalMimeType });

        // Tạo file name với extension phù hợp
        const extension = finalMimeType.includes("webm") ? "webm" : "mp4";
        const file = new File([blob], `locket_dio.${extension}`, {
          type: finalMimeType,
        });

        console.log("📹 Video file created:", {
          size: file.size,
          type: file.type,
          name: file.name,
          environment: isPWA ? "PWA" : "Web",
        });

        const videoUrl = URL.createObjectURL(file);
        const fileSizeInMB = file.size / (1024 * 1024);

        setSizeMedia(fileSizeInMB.toFixed(2));
        setPreview({ type: "video", data: videoUrl });
        setSelectedFile(file);
        setCameraActive(false);
        cleanupCameraStream();
        setLoading(false);

        // Reset states
        isRecordingRef.current = false;
        setIsHolding(false);
      };

      recorder.onerror = (e) => {
        console.error("MediaRecorder error:", e);
        cleanupRecordingResources();
        canvasStream.getTracks().forEach((track) => track.stop());
        isRecordingRef.current = false;
        setIsHolding(false);
      };

      try {
        recorder.start();
        console.log(
          "📹 Started recording with MIME type:",
          mimeType || "default"
        );
      } catch (error) {
        console.error("Failed to start recording:", error);
        isRecordingRef.current = false;
        setIsHolding(false);
        return;
      }

      // Hàm vẽ mỗi frame vào canvas với FPS control cho PWA
      let lastFrameTime = 0;
      const frameInterval = 1000 / RECORD_FPS;

      const drawFrame = (currentTime) => {
        if (video.paused || video.ended || recorder.state !== "recording") {
          return;
        }

        // Kiểm tra frame rate cho PWA
        if (currentTime - lastFrameTime < frameInterval) {
          if (recorder.state === "recording") {
            animationFrameRef.current = requestAnimationFrame(drawFrame);
          }
          return;
        }

        lastFrameTime = currentTime;

        ctx.save();

        if (cameraMode === "user") {
          ctx.translate(outputSize, 0);
          ctx.scale(-1, 1);
        }

        const sx = (video.videoWidth - side) / 2;
        const sy = (video.videoHeight - side) / 2;
        ctx.drawImage(video, sx, sy, side, side, 0, 0, outputSize, outputSize);

        ctx.restore();

        if (recorder.state === "recording") {
          animationFrameRef.current = requestAnimationFrame(drawFrame);
        }
      };

      animationFrameRef.current = requestAnimationFrame(drawFrame);

      // Auto stop sau MAX_RECORD_TIME
      autoStopTimeoutRef.current = setTimeout(() => {
        if (recorder.state === "recording") {
          console.log("📹 Auto stopping recording after max time");
          recorder.stop();
        }
      }, MAX_RECORD_TIME * 1000);
    }, 600);
  };

  const endHold = (e) => {
    // Prevent default để tránh conflict trên iOS
    e.preventDefault();

    const heldTime = Date.now() - (holdStartTimeRef.current || Date.now());

    // Clear timeouts
    clearTimeout(holdTimeoutRef.current);
    clearInterval(intervalRef.current);
    setHoldTime(heldTime);

    // Đánh dấu không còn trying to record
    isTryingToRecordRef.current = false;

    // Nếu đang trong quá trình recording
    if (
      isRecordingRef.current &&
      mediaRecorderRef.current?.state === "recording"
    ) {
      console.log("📹 Stopping video recording manually");
      mediaRecorderRef.current.stop();
      return; // Không chụp ảnh
    }

    // Nếu đã timeout và đang holding nhưng chưa bắt đầu record
    if (isHolding && !isRecordingRef.current) {
      setIsHolding(false);
      return;
    }

    // Nếu không quay video (nhấn giữ < 600ms), tiến hành chụp ảnh
    if (!isRecordingRef.current) {
      captureImage();
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = CAMERA_CONFIG.imageSizePx;
    canvas.height = CAMERA_CONFIG.imageSizePx;

    let sx = 0,
      sy = 0,
      sw = video.videoWidth,
      sh = video.videoHeight;

    if (video.videoWidth > video.videoHeight) {
      const offset = (video.videoWidth - video.videoHeight) / 2;
      sx = offset;
      sw = video.videoHeight;
    } else {
      const offset = (video.videoHeight - video.videoWidth) / 2;
      sy = offset;
      sh = video.videoWidth;
    }

    if (cameraMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "locket_dio.jpg", {
            type: "image/jpeg",
          });
          const imgUrl = URL.createObjectURL(file);
          setPreview({ type: "image", data: imgUrl });

          const fileSizeInMB = file.size / (1024 * 1024);
          setSizeMedia(fileSizeInMB.toFixed(2));

          setSelectedFile(file);
          setCameraActive(false);
        }
      },
      "image/jpeg",
      1.0
    );

    // Fix iOS
    setTimeout(() => {
      const videoEl = document.querySelector("video");
      if (videoEl) videoEl.setAttribute("playsinline", "true");
    }, 100);
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      cleanupRecordingResources();
      clearTimeout(holdTimeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      <button
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        // Thêm các event cho iOS
        onTouchCancel={endHold}
        onContextMenu={(e) => e.preventDefault()} // Prevent long press menu on iOS
        className="relative flex items-center justify-center w-24 h-24 active:scale-97"
        style={{
          touchAction: "manipulation", // Improve touch response on iOS
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <div
          className={`absolute w-20 h-20 border-camera-custome text-primary/80 rounded-full z-10 ${
            isHolding ? "animate-borderExpand" : ""
          }`}
        ></div>
        <div
          className={`absolute rounded-full btn w-19 h-19 camera-inner-circle z-0 transition-all duration-500 ${
            isHolding ? "scale-77 opacity-90" : "scale-100 opacity-100"
          }`}
        ></div>
      </button>
    </>
  );
};

export default CameraButton;
