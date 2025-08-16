import React, { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { RefreshCcw } from "lucide-react";
import UploadFile from "./UploadFile";
import { showError } from "@/components/Toast";
import { getVideoRecordLimit } from "@/hooks/useFeature";

const CameraButton = () => {
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
    IMAGE_SIZE_PX,
    VIDEO_RESOLUTION_PX,
    setDeviceId,
    setZoomLevel,
  } = camera;
  const { preview, setPreview, setSelectedFile, setSizeMedia } = post;
  const { setIsCaptionLoading, uploadLoading, setUploadLoading } = useloading;

  const holdStartTimeRef = useRef(null);
  const holdTimeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const intervalRef = useRef(null);
  const isTryingToRecordRef = useRef(false);
  const isRecordingRef = useRef(false);

  const MAX_RECORD_TIME = getVideoRecordLimit();

  // Function để kiểm tra môi trường PWA
  const isPWA = () => {
    // Kiểm tra display mode
    if (
      window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      return true;
    }

    // Kiểm tra navigator.standalone cho iOS
    if (window.navigator.standalone === true) {
      return true;
    }

    // Kiểm tra document.referrer cho Android
    if (document.referrer.includes("android-app://")) {
      return true;
    }

    // Kiểm tra user agent cho các trường hợp khác
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("wv") || userAgent.includes("webview")) {
      return true;
    }

    return false;
  };

  const stopCamera = () => {
    console.log("Hello đang test camera à babi");
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
      if (!video || video.readyState < 2) {
        showError("Camera chưa sẵn sàng, vui lòng chờ giây lát...");
        isTryingToRecordRef.current = false;
        return;
      }

      // Tạo canvas vuông
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const side = Math.min(video.videoWidth, video.videoHeight);
      const outputSize = VIDEO_RESOLUTION_PX;
      canvas.width = outputSize;
      canvas.height = outputSize;

      // Điều chỉnh FPS dựa trên môi trường
      const targetFPS = isPWA() ? 30 : undefined; // PWA: 30fps, Web: tự động
      const canvasStream = targetFPS
        ? canvas.captureStream(targetFPS)
        : canvas.captureStream();

      console.log(
        `🎥 Recording mode: ${isPWA() ? "PWA" : "Web"}, FPS: ${
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
      if (isPWA() && mimeType) {
        // Giảm bitrate cho PWA để tối ưu hiệu suất
        recorderOptions.videoBitsPerSecond = 2500000; // 2.5 Mbps cho PWA
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

        if (chunks.length === 0) {
          console.error("No video data captured");
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
          environment: isPWA() ? "PWA" : "Web",
        });

        const videoUrl = URL.createObjectURL(file);
        const fileSizeInMB = file.size / (1024 * 1024);

        setSizeMedia(fileSizeInMB.toFixed(2));
        setPreview({ type: "video", data: videoUrl });
        setSelectedFile(file);
        setCameraActive(false);
        setIsCaptionLoading(true);
        stopCamera();
        setLoading(false);

        // Reset states
        isRecordingRef.current = false;
        setIsHolding(false);
      };

      recorder.onerror = (e) => {
        console.error("MediaRecorder error:", e);
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
      const frameInterval = isPWA() ? 1000 / 45 : 0; // 45fps cho PWA, unlimited cho web

      const drawFrame = (currentTime) => {
        if (video.paused || video.ended || recorder.state !== "recording") {
          return;
        }

        // Kiểm tra frame rate cho PWA
        if (isPWA() && currentTime - lastFrameTime < frameInterval) {
          if (recorder.state === "recording") {
            requestAnimationFrame(drawFrame);
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
          requestAnimationFrame(drawFrame);
        }
      };

      requestAnimationFrame(drawFrame);

      // Auto stop sau MAX_RECORD_TIME
      setTimeout(() => {
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
    canvas.width = IMAGE_SIZE_PX;
    canvas.height = IMAGE_SIZE_PX;

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
          setIsCaptionLoading(true);
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

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      clearTimeout(holdTimeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  // Log môi trường khi component mount
  useEffect(() => {
    console.log(`🚀 App running in: ${isPWA() ? "PWA" : "Web"} mode`);
  }, []);

  return (
    <>
      <div className="flex gap-4 w-full h-25 max-w-md justify-evenly items-center">
        <UploadFile />
        <button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          // Thêm các event cho iOS
          onTouchCancel={endHold}
          onContextMenu={(e) => e.preventDefault()} // Prevent long press menu on iOS
          className="relative flex items-center justify-center w-22 h-22"
          style={{
            touchAction: "manipulation", // Improve touch response on iOS
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
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
      </div>
    </>
  );
};

export default CameraButton;
