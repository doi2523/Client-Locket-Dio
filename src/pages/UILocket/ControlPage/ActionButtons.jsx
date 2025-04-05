import { X, Send, Sparkles, ImageUp, RefreshCcw } from "lucide-react";
import * as utils from "../../../utils";
import LoadingRing from "../../../components/UI/Loading/ring";
import { useApp } from "../../../context/AppContext";
import { showToast } from "../../../components/Toast";
import { useCallback } from "react";

const MediaControls = ({
  loading,
}) => {
  const { navigation, post } = useApp();
  const { setIsFilterOpen } = navigation;
  const { caption, setCaption, selectedFile, setSelectedFile, selectedColors } = post;

  const handleDelete = useCallback(() => {
    setSelectedFile(null);
    setCaption("");
    // Thực hiện các thao tác cần thiết khác, ví dụ:
    // setCapturedMedia(null);
    // setCameraActive(true);
    // setIsHolding(false);
    // Các thao tác khác liên quan đến stream có thể để lại nếu cần
  }, [setSelectedFile, setCaption]);
  const handleSubmit = async () => {
    if (!selectedFile) {
      console.error("Không có dữ liệu để tải lên.");
      return;
    }
  
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
      setLoading(false);
      return;
    }
  
    // Duyệt qua các cặp key-value trong FormData và in ra
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  };
  

  return (
    <>
      <button
        className="cursor-pointer"
        onClick={handleDelete}
        disabled={loading}
      >
        <X size={35} />
      </button>
      <button
        onClick={handleSubmit}
        className="rounded-full w-22 h-22 duration-300 outline-base-300 bg-base-300/50 backdrop-blur-4xl mx-4 text-center flex items-center justify-center disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (
          <LoadingRing size={40} stroke={3} />
        ) : (
          <Send size={40} className="mr-1 mt-1" />
        )}
      </button>
      <button className="cursor-pointer"
  onClick={() => {
    setIsFilterOpen(true);
  }}
>
  <Sparkles size={35} />
</button>

    </>
  );
};

const MediaCapture = () => {
  const { post, navigation, camera } = useApp();
  const { selectedFile, setSelectedFile } = post;
  const { rotation,isHolding,  setIsHolding,    permissionChecked, setPermissionChecked,
    holdTime, setHoldTime, } = camera;
  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const fileURL = URL.createObjectURL(file);
  
      if (file.type.startsWith("image/")) {
        setSelectedFile({ type: "image", data: fileURL });
      } else if (file.type.startsWith("video/")) {
        showToast("info", "Đang tải video...");
        setSelectedFile({ type: "video", data: fileURL });
      }
    },
    [setSelectedFile]
  );
  const startHold = () => {
    setIsHolding(true);
    setHoldTime(0);
    // setCountdown(null);

    // intervalRef.current = setInterval(() => {
    //   setHoldTime((prev) => prev + 0.1);
    // }, 100);

    // holdTimeout.current = setTimeout(() => {
    //   if (videoRef.current?.srcObject) {
    //     const stream = videoRef.current.srcObject;
    //     const recorder = new MediaRecorder(stream);
    //     mediaRecorderRef.current = recorder;
    //     const chunks = [];
    //     const startTime = Date.now(); // Lưu thời điểm bắt đầu quay

    //     recorder.ondataavailable = (e) => {
    //       if (e.data.size > 0) {
    //         chunks.push(e.data);
    //       }
    //     };

    //     recorder.onstop = async () => {
    //       setCameraActive(false);
    //       setLoading(true);

    //       // Tính độ dài video
    //       let duration = (Date.now() - startTime) / 1000;
    //       if (cameraMode === "user") {
    //         duration *= 2; // Tăng gấp đôi thời gian đếm ngược nếu là camera trước
    //       }
    //       setCountdown(duration); // Bắt đầu đếm ngược

    //       // Tạo bộ đếm ngược
    //       const countdownRecordvideo = setInterval(() => {
    //         setCountdown((prev) => {
    //           const newValue = (parseFloat(prev) - 0.1).toFixed(1);
    //           return newValue > 0 ? newValue : null;
    //         });
    //       }, 100);

    //       showToast("info", "Đang xử lý video...");
    //       const blob = new Blob(chunks, { type: "video/mp4" });

    //       const videoUrl =
    //         cameraMode === "user"
    //           ? URL.createObjectURL(await correctFrontCameraVideo(blob))
    //           : URL.createObjectURL(await cropVideoToSquareV2(blob));

    //       setSelectedFile({ type: "video", data: videoUrl });

    //       setLoading(false);
    //       clearInterval(countdownRecordvideo); // Dừng đếm ngược
    //       showToast("success", "Xử lý video thành công!");
    //     };

    //     recorder.start();
    //     setIsRecording(true);

    //     setTimeout(() => {
    //       if (mediaRecorderRef.current?.state === "recording") {
    //         mediaRecorderRef.current.stop();
    //         setIsRecording(false);
    //       }
    //     }, MAX_RECORD_TIME * 1000);
    //   }
    // }, 1000);
  };

  const endHold = () => {
    setIsHolding(false);
    // clearTimeout(holdTimeout.current);
    // clearInterval(intervalRef.current);

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
  return (
    <>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <ImageUp size={35} />
      </label>
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

const CameraControls = () => {
  const { post, camera } = useApp();
  const { selectedFile } = post;
  const { capturedMedia } = camera;

  return (
    <div className="flex gap-4 w-full h-40 max-w-md justify-evenly items-center">
      {capturedMedia || selectedFile ? (
        <MediaControls/>
      ) : (
        <MediaCapture/>
      )}
    </div>
  );
};

export default CameraControls;
