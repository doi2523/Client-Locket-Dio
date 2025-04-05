import React from "react";
import AutoResizeTextarea from "./AutoResizeTextarea";
import Hourglass from "../../../components/UI/Loading/hourglass";
import { useApp } from "../../../context/AppContext";

const MediaPreview = ({
  loading,
  countdown,
  cameraActive,
  videoRef,
  cameraMode,
  capturedMedia,
  caption,
  setCaption,
  selectedColors
}) => {
    const {post} = useApp();
    const { selectedFile } = post;

    const startHold = () => {
      setIsHolding(true);
      setHoldTime(0);
      setCountdown(null);
  
      intervalRef.current = setInterval(() => {
        setHoldTime((prev) => prev + 0.1);
      }, 100);
  
      holdTimeout.current = setTimeout(() => {
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject;
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;
          const chunks = [];
          const startTime = Date.now(); // Lưu thời điểm bắt đầu quay
  
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunks.push(e.data);
            }
          };
  
          recorder.onstop = async () => {
            setCameraActive(false);
            setLoading(true);
  
            // Tính độ dài video
            let duration = (Date.now() - startTime) / 1000;
            if (cameraMode === "user") {
              duration *= 2; // Tăng gấp đôi thời gian đếm ngược nếu là camera trước
            }
            setCountdown(duration); // Bắt đầu đếm ngược
  
            // Tạo bộ đếm ngược
            const countdownRecordvideo = setInterval(() => {
              setCountdown((prev) => {
                const newValue = (parseFloat(prev) - 0.1).toFixed(1);
                return newValue > 0 ? newValue : null;
              });
            }, 100);
  
            showToast("info", "Đang xử lý video...");
            const blob = new Blob(chunks, { type: "video/mp4" });
  
            const videoUrl =
              cameraMode === "user"
                ? URL.createObjectURL(await correctFrontCameraVideo(blob))
                : URL.createObjectURL(await cropVideoToSquareV2(blob));
  
            setSelectedFile({ type: "video", data: videoUrl });
  
            setLoading(false);
            clearInterval(countdownRecordvideo); // Dừng đếm ngược
            showToast("success", "Xử lý video thành công!");
          };
  
          recorder.start();
          setIsRecording(true);
  
          setTimeout(() => {
            if (mediaRecorderRef.current?.state === "recording") {
              mediaRecorderRef.current.stop();
              setIsRecording(false);
            }
          }, MAX_RECORD_TIME * 1000);
        }
      }, 1000);
    };
  
    const endHold = () => {
      setIsHolding(false);
      clearTimeout(holdTimeout.current);
      clearInterval(intervalRef.current);
  
      if (holdTime < 1) {
        if (videoRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          const size = Math.min(video.videoWidth, video.videoHeight);
  
          canvas.width = size;
          canvas.height = size;
  
          const xOffset = (video.videoWidth - size) / 2;
          const yOffset = (video.videoHeight - size) / 2;
  
          if (cameraMode === "user") {
            ctx.translate(size / 2, 0); // Dịch chuyển đúng tâm
            ctx.scale(-1, 1); // Lật ảnh
            ctx.drawImage(
              video,
              xOffset,
              yOffset,
              size,
              size,
              -size / 2,
              0,
              size,
              size
            );
          } else {
            ctx.drawImage(video, xOffset, yOffset, size, size, 0, 0, size, size);
          }
  
          setSelectedFile({ type: "image", data: canvas.toDataURL("image/png") });
          setCameraActive(false);
        }
      } else {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }
      // Chắc chắn video không mở toàn màn hình trên iOS
      setTimeout(() => {
        const videoEl = document.querySelector("video");
        if (videoEl) {
          videoEl.setAttribute("playsinline", "true");
        }
      }, 100);
    };
  return (
    <>
      <h1 className="text-3xl mb-1.5 font-semibold font-lovehouse">
        Locket Camera
      </h1>
      <div
        className={`relative w-full max-w-md aspect-square transform bg-gray-800 rounded-[65px] overflow-hidden ${
          loading ? "border border-red-500" : ""
        }`}
      >
        {/* Viền động chạy vòng tròn */}
        <div className="absolute inset-0 rounded-[60px]"></div>

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 bg-opacity-50 z-50 gap-3 text-white text-lg font-medium">
            <Hourglass
              size={50}
              stroke={2}
              bgOpacity={0.1}
              speed={1.5}
              color="white"
            />
            <div>Đang xử lý video...</div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <p> {countdown}s⏳</p>
            </div>
          </div>
        )}

        {!selectedFile && cameraActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${
              cameraMode === "user" ? "scale-x-[-1]" : ""
            }`}
          />
        )}

        {selectedFile && selectedFile.type === "video" && (
          <video
            src={selectedFile.data}
            autoPlay
            loop
            playsInline
            muted
            className="w-full h-full object-cover"
            onClick={(e) => e.preventDefault()}
          />
        )}

        {selectedFile && selectedFile.type === "image" && (
          <img
            src={selectedFile.data}
            alt="Selected File"
            className="w-full h-full object-cover select-none"
          />
        )}

        {(capturedMedia || selectedFile) && (
          <AutoResizeTextarea/>
        )}
      </div>
    </>
  );
};

export default MediaPreview;
