import React, { useRef, useState, useEffect } from "react";
import { RefreshCcw, Send, Sparkles, ImageUp, X } from "lucide-react";
import HoldButton from "../../../components/UI/Button";

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [cameraMode, setCameraMode] = useState("front");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [cameraActive, setCameraActive] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const pressTimer = useRef(null);
  const pressStartTime = useRef(null);
  const pressTimeoutRef = useRef(null);
const recordingStartedRef = useRef(false); // Để kiểm soát trạng thái bắt đầu quay

  const textareaRef = useRef(null);

  // Hàm để điều chỉnh chiều cao của textarea tự động
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Đặt lại chiều cao về auto để tính toán lại
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Đặt chiều cao dựa trên chiều cao cuộn
    }
  };

  // Tính toán chiều rộng ban đầu cho textarea, đủ để chứa placeholder "Nhập tin nhắn..."
  const getInitialWidth = () => {
    const placeholder = "Nhập tin nhắn..."; // Văn bản placeholder
    const width = placeholder.length * 10; // Mỗi ký tự có chiều rộng khoảng 10px (có thể điều chỉnh nếu cần)
    return Math.max(width, 100); // Đảm bảo chiều rộng tối thiểu là 100px
  };

  // Hàm để tính toán chiều rộng của textarea dựa trên độ dài của văn bản nhập vào
  const getTextWidth = (text) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "16px sans-serif"; // Font giống với font của textarea
    return context.measureText(text).width; // Đo chiều rộng của văn bản
  };

  // Tính toán chiều rộng dựa trên nội dung nhập vào
  const getWidth = () => {
    // Nếu có văn bản, tính chiều rộng dựa trên độ dài của văn bản nhập vào
    return Math.max(getInitialWidth(), getTextWidth(caption) + 20); // +20 để thêm một chút không gian cho padding
  };

  useEffect(() => {
    adjustHeight(); // Gọi hàm điều chỉnh khi nội dung thay đổi
  }, [caption]);

  useEffect(() => {
    if (cameraActive) checkCameraPermission();
    return () => {
      stopCamera();
      clearTimeout(pressTimer.current);
    };
  }, [cameraMode, cameraActive]);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: "camera" });
      if (result.state === "granted") {
        setHasPermission(true);
        startCamera();
      } else if (result.state === "denied") {
        setHasPermission(false);
        setPermissionDenied(true);
      }
    } catch (error) {
      setPermissionDenied(true);
    }
  };

  const startCamera = async () => {
    if (permissionDenied || hasPermission === false || !cameraActive) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraMode === "front" ? "user" : "environment",
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setPermissionDenied(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || isRecording) return;
    const context = canvasRef.current.getContext("2d");
    const video = videoRef.current;

    const size = Math.min(video.videoWidth, video.videoHeight);
    canvasRef.current.width = size;
    canvasRef.current.height = size;

    if (cameraMode === "front") {
      context.translate(size, 0);
      context.scale(-1, 1);
    }

    const xOffset = (video.videoWidth - size) / 2;
    const yOffset = (video.videoHeight - size) / 2;
    context.drawImage(video, xOffset, yOffset, size, size, 0, 0, size, size);

    setCapturedMedia({
      type: "image",
      data: canvasRef.current.toDataURL("image/png"),
    });
    setCameraActive(false);
  };

  const startRecording = async () => {
    if (!videoRef.current || isRecording) return;

    const stream = videoRef.current.srcObject;
    recordedChunksRef.current = [];
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url =
        cameraMode === "front"
          ? URL.createObjectURL(await correctFrontCameraVideo(blob))
          : URL.createObjectURL(blob);

      setCapturedMedia({ type: "video", data: url });
      setCameraActive(false);
      setIsRecording(false);
    };

    setIsRecording(true);
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };
  const handlePressStart = () => {
    if (!videoRef.current || isRecording) return;
  
    pressTimeoutRef.current = setTimeout(() => {
      recordingStartedRef.current = true;
      startRecording(); // Bắt đầu quay video sau 500ms
    }, 500);
  };
  

  const handlePressEnd = () => {
    if (pressTimeoutRef.current) {
      clearTimeout(pressTimeoutRef.current);
    }
  
    if (recordingStartedRef.current) {
      stopRecording(); // Nếu đang quay thì dừng quay
      recordingStartedRef.current = false;
    } else {
      handleCapturePhoto(); // Nếu chưa quay thì chụp ảnh
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định khi di chuyển ngón tay
  };

  const handleTouchCancel = (e) => {
    e.preventDefault();
    clearTimeout(pressTimer.current);
    if (isRecording) stopRecording();
  };

  const [isHolding, setIsHolding] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  const holdTimeout = useRef(null);
  const intervalRef = useRef(null);

  const startHold = () => {
    setIsHolding(true);
    setHoldTime(0);

    intervalRef.current = setInterval(() => {
      setHoldTime((prev) => prev + 0.1);
    }, 100);

    holdTimeout.current = setTimeout(() => {
      console.log("Button held down!");
    }, 1000); // 1s giữ
    handlePressStart();
  };

  const endHold = () => {
    setIsHolding(false);
    clearTimeout(holdTimeout.current);
    clearInterval(intervalRef.current);
    handlePressEnd();
  };


  const handleSwitchCamera = () => {
    setCameraMode(cameraMode === "front" ? "back" : "front");
    setRotation(rotation - 360);
  };

  const correctFrontCameraVideo = (blob) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(blob);
      video.onloadedmetadata = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;

        video.onplay = () => {
          const stream = canvas.captureStream();
          const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
          const chunks = [];

          recorder.ondataavailable = (e) => chunks.push(e.data);
          recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));

          recorder.start();

          const drawFrame = () => {
            if (video.ended) {
              recorder.stop();
              return;
            }
            ctx.save();
            ctx.translate(size, 0);
            ctx.scale(-1, 1);
            const xOffset = (video.videoWidth - size) / 2;
            const yOffset = (video.videoHeight - size) / 2;
            ctx.drawImage(video, xOffset, yOffset, size, size, 0, 0, size, size);
            ctx.restore();
            requestAnimationFrame(drawFrame);
          };

          requestAnimationFrame(drawFrame);
        };
        video.play();
      };
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          const size = Math.min(img.width, img.height);
          canvas.width = size;
          canvas.height = size;
          const xOffset = (img.width - size) / 2;
          const yOffset = (img.height - size) / 2;
          ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, size, size);
          setSelectedFile({
            type: "image",
            data: canvas.toDataURL("image/png"),
          });
          setCameraActive(false);
        };
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedFile({ type: "video", data: videoUrl });
      setCameraActive(false);
    }
  };

  const handleDelete = () => {
    setCapturedMedia(null);
    setSelectedFile(null);
    setCaption("");
    setCameraActive(true);
  };

  const handleSubmit = () => {
    console.log("File: ", selectedFile || capturedMedia);
    console.log("Caption: ", caption);
  };

  return (
    <div className="flex select-none flex-col items-center justify-center h-screen min-h-screen bg-locket -z-50">
      <h1 className="text-3xl mb-6 font-semibold">Locket Upload</h1>
      <div className="relative w-full max-w-md aspect-square bg-gray-800 rounded-[60px] overflow-hidden">
        {!selectedFile && cameraActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${cameraMode === "front" ? "scale-x-[-1]" : ""}`}
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
          />
        )}
        {selectedFile && selectedFile.type === "image" && (
          <img
            src={selectedFile.data}
            alt="Selected File"
            className="w-full h-full object-cover select-none"
          />
        )}
        {capturedMedia && capturedMedia.type === "image" && (
          <img
            src={capturedMedia.data}
            alt="Captured"
            className="w-full h-full object-cover select-none"
          />
        )}
        {capturedMedia && capturedMedia.type === "video" && (
          <video
            src={capturedMedia.data}
            autoPlay
            loop
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {(capturedMedia || selectedFile) && (
    <textarea
    ref={textareaRef}
    value={caption}
    onChange={(e) => setCaption(e.target.value)}
    placeholder="Nhập tin nhắn..."
    rows="1"
    className="absolute text-white px-4 font-semibold bottom-4 left-1/2 transform backdrop-blur-2xl -translate-x-1/2 bg-white/50 rounded-4xl py-2 text-md outline-none max-w-[90%] w-auto resize-none overflow-hidden transition-all"
    style={{
      width: `${getWidth()}px`, // Chiều rộng thay đổi tùy theo độ dài văn bản
      overflow: 'hidden', // Ẩn thanh cuộn
      minHeight: '40px', // Chiều cao tối thiểu
      whiteSpace: 'pre-wrap', // Đảm bảo văn bản xuống dòng khi hết chiều rộng
    }}
  />
        )}
      </div>

      <div className="flex gap-4 w-full h-40 max-w-md justify-evenly items-center">
        {capturedMedia || selectedFile ? (
          <>
            <button className="cursor-pointer" onClick={handleDelete}>
              <X size={35} />
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-full w-22 h-22 duration-300 outline-base-300 bg-white/10 backdrop-blur-4xl mx-4 text-center flex items-center justify-center"
            >
              <Send size={40} className="mr-1 mt-1" />
            </button>
            <button>
              <Sparkles size={35} />
            </button>
          </>
        ) : (
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
  className={`rounded-full w-18 h-18 mx-4 outline-5 outline-offset-3 outline-accent ${
    isRecording ? "bg-red-500 animate-pulseBeat" : "bg-base-300"
  }`}
></button>

            <button className="cursor-pointer" onClick={handleSwitchCamera}>
              <RefreshCcw
                size={35}
                className="transition-transform duration-500"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            </button>
          </>
        )}
      </div>
      <HoldButton/>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;