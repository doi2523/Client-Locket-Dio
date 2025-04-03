import React, { useRef, useState, useEffect, useContext } from "react";
import {
  RefreshCcw,
  Send,
  Sparkles,
  ImageUp,
  X,
  Menu,
  MenuIcon,
} from "lucide-react";
import AutoResizeTextarea from "./ExtendPage/AutoResizeTextarea.jsx";
import { showToast } from "../../components/Toast/index.jsx";
import Hourglass from "../../components/UI/Loading/hourglass.jsx";
import {
  cropVideoToSquare,
  cropVideoToSquareV2,
} from "../../helpers/Media/cropMedia.js";
import { correctFrontCameraVideo } from "../../helpers/Media/flipVideoHorizontal.js";
import ThemeSelector from "../../components/Theme/ThemeSelector.jsx";
import Sidebar from "../../components/Sidebar/index.jsx";
import * as utils from "../../utils/index.js";
import * as lockerService from "../../services/locketService.js";
import LeftHomeScreen from "./ExtendPage/leftHomeScreen.jsx";
import { AuthContext } from "../../context/AuthLocket.jsx";

import RightHomeScreen from "./ExtendPage/rightHomeScreen.jsx";
import FiltersSelector from "./ControlPage/filtersSelector.jsx";
import Navbar from "./ExtendPage/\bNavbar.jsx";
import CameraControls from "./ControlPage/ActionButtons.jsx";
import MediaPreview from "./ExtendPage/MediaDisplay.jsx";

const CameraCapture = ({ onCapture }) => {
  const { user, setUser } = useContext(AuthContext);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraMode, setCameraMode] = useState("user");
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [cameraActive, setCameraActive] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  const [permissionChecked, setPermissionChecked] = useState(true); //Đổi false để hỏi xin camera
  const holdTimeout = useRef(null);
  const intervalRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const MAX_RECORD_TIME = 10;
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState({
    top: "transparent", // Màu nền mặc định là trong suốt
    bottom: "transparent"
  });
  

  useEffect(() => {
    if (!permissionChecked) {
      navigator.mediaDevices
        .getUserMedia({ video: true, muted: true })
        .then((stream) => {
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        })
        .catch(() => setHasPermission(false))
        .finally(() => setPermissionChecked(true));
    }
  }, [permissionChecked]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleDelete = () => {
    setCapturedMedia(null);
    setSelectedFile(null);
    setCaption("");
    setCameraActive(true);
    setIsHolding(false);
    clearTimeout(holdTimeout.current);
    clearInterval(intervalRef.current);

    if (!streamRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasPermission(true);
        })
        .catch(() => setHasPermission(false));
    } else {
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }
      }, 100);
    }
  };
  const handleSubmit = async () => {
    if (!selectedFile) {
      console.error("Không có dữ liệu để tải lên.");
      return;
    }

    try {
      // Tải nội dung Blob từ URL
      const response = await fetch(selectedFile.data);
      const blob = await response.blob();

      // Chuyển Blob thành File
      const file = new File(
        [blob],
        blob.type.includes("video")
          ? "captured_video.mp4"
          : "captured_image.jpg",
        { type: blob.type }
      );

      // Tạo FormData để gửi lên server
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("text_color", "#FFFFFF");
      formData.append("colorTop", selectedColors.top);
      formData.append("colorBottom", selectedColors.bottom);
      formData.append("idToken", utils.getAuthCookies().idToken);
      formData.append("localId", utils.getAuthCookies().localId);

      // Xác định loại file và append đúng key
      if (file.type.includes("image")) {
        formData.append("images", file); // key phải đúng với backend
      } else if (file.type.includes("video")) {
        formData.append("videos", file); // key phải đúng với backend
      } else {
        showToast("warning", "File không hợp lệ!");
        return;
      }

      try {
        await lockerService.uploadMedia(formData);
        showToast(
          "success",
          `${
            file.type.includes("video") ? "Video" : "Hình ảnh"
          } đã được tải lên!`
        );
      } catch (error) {
        showToast("error", "Lỗi khi tải lên!");
        console.error(error);
      }
    } catch (error) {
      console.error("Lỗi khi tải lên:", error);
    }
  };

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setCameraActive(false);
    setLoading(true);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          // Lấy kích thước nhỏ nhất giữa width và height để tạo hình vuông
          const size = Math.min(img.width, img.height);
          const offsetX = (img.width - size) / 2; // Cắt từ giữa ảnh
          const offsetY = (img.height - size) / 2;

          canvas.width = size;
          canvas.height = size;

          // Cắt và vẽ hình vuông đúng tỷ lệ
          ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

          setSelectedFile({
            type: "image",
            data: canvas.toDataURL("image/png"),
          });
          setLoading(false);
        };
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      setLoading(true);
      showToast("info", "Đang tải video...");
      const videoBlob = new Blob([file], { type: file.type });

      cropVideoToSquare(videoBlob, setCountdown).then((croppedBlob) => {
        const videoUrl = URL.createObjectURL(croppedBlob);
        setSelectedFile({ type: "video", data: videoUrl });
        setCameraActive(false);
        setLoading(false);
        showToast("success", "Tải video thành công!");
      });
    }
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
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Lỗi khi đổi camera:", error);
    }
  };

  const handleSelectFilter = (filter) => {
    console.log("Selected Filter:", filter);
    setSelectedColors(filter)
    setIsFilterOpen(false); // Close the filter selector after selection
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false); // Close the filter selector
  };
  return (
    <>
      <div
        className={`transition-transform duration-500 ${
          isProfileOpen
            ? "translate-x-full"
            : isHomeOpen
            ? "-translate-x-full"
            : "translate-x-0"
        }`}
      >
        <div className="flex select-none flex-col items-center justify-start -z-50">
          <Navbar
            setIsProfileOpen={setIsProfileOpen}
            setIsHomeOpen={setIsHomeOpen}
          />
          <MediaPreview
            loading={loading}
            countdown={countdown}
            selectedFile={selectedFile}
            cameraActive={cameraActive}
            videoRef={videoRef}
            cameraMode={cameraMode}
            capturedMedia={capturedMedia}
            caption={caption}
            setCaption={setCaption}
            selectedColors={selectedColors}
          />
          <CameraControls
            capturedMedia={capturedMedia}
            selectedFile={selectedFile}
            handleDelete={handleDelete}
            handleSubmit={handleSubmit}
            setIsFilterOpen={setIsFilterOpen}
            handleFileChange={handleFileChange}
            startHold={startHold}
            endHold={endHold}
            handleRotateCamera={handleRotateCamera}
            rotation={rotation}
            isHolding={isHolding}
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
      {/* left */}
      <LeftHomeScreen
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      {/* right */}
      <RightHomeScreen
        isOpen={isHomeOpen}
        onClose={() => setIsHomeOpen(false)}
      />
      <FiltersSelector
        isOpen={isFilterOpen}
        onClose={handleCloseFilter}
        onSelect={handleSelectFilter}
        className={`fixed bottom-0 left-0 right-0 transform transition-transform duration-500 ${
          isFilterOpen ? "translate-y-0" : "translate-y-full"
        }`}
      />
    </>
  );
};

export default CameraCapture;
