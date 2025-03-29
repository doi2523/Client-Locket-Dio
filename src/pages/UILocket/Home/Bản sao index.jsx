import React, { useRef, useState, useEffect } from "react";
import { RefreshCcw, Send, Sparkles, ImageUp, X } from "lucide-react";

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
  const [recordingProgress, setRecordingProgress] = useState(0);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const pressTimer = useRef(null);
  const pressStartTime = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    if (cameraActive) checkCameraPermission();
    return () => {
      stopCamera();
      clearTimeout(pressTimer.current);
      clearInterval(progressIntervalRef.current);
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

  const handleSwitchCamera = () => {
    setCameraMode(cameraMode === "front" ? "back" : "front");
    setRotation(rotation - 360);
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
      mimeType: "video/webm"
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      
      if (cameraMode === "front") {
        const correctedBlob = await correctFrontCameraVideo(blob);
        const url = URL.createObjectURL(correctedBlob);
        setCapturedMedia({
          type: "video",
          data: url,
        });
      } else {
        const url = URL.createObjectURL(blob);
        setCapturedMedia({
          type: "video",
          data: url,
        });
      }
      
      setCameraActive(false);
      setIsRecording(false);
      setRecordingProgress(0);
      clearInterval(progressIntervalRef.current);
    };

    setIsRecording(true);
    setRecordingProgress(0);
    mediaRecorderRef.current.start();

    // Cập nhật tiến trình
    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 10000) * 100, 100);
      setRecordingProgress(progress);
    }, 100);

    setTimeout(() => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    }, 10000);
  };

  const correctFrontCameraVideo = (blob) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(blob);
      video.onloadedmetadata = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        // Đảm bảo video vuông
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;

        video.onplay = () => {
          const stream = canvas.captureStream();
          const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
          const chunks = [];

          recorder.ondataavailable = (e) => chunks.push(e.data);
          recorder.onstop = () => {
            const correctedBlob = new Blob(chunks, { type: "video/webm" });
            resolve(correctedBlob);
          };

          recorder.start();

          const drawFrame = () => {
            if (video.ended) {
              recorder.stop();
              return;
            }
            ctx.save();
            if (cameraMode === "front") {
              ctx.translate(size, 0);
              ctx.scale(-1, 1);
            }
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

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleMouseDown = () => {
    pressStartTime.current = Date.now();
    pressTimer.current = setTimeout(() => {
      startRecording();
    }, 200);
  };

  const handleMouseUp = () => {
    const pressDuration = Date.now() - pressStartTime.current;
    clearTimeout(pressTimer.current);
    
    if (pressDuration < 200 && !isRecording) {
      handleCapturePhoto();
    } else if (isRecording) {
      stopRecording();
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    pressStartTime.current = Date.now();
    pressTimer.current = setTimeout(() => {
      startRecording();
    }, 200);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    const pressDuration = Date.now() - pressStartTime.current;
    clearTimeout(pressTimer.current);
    
    if (pressDuration < 200 && !isRecording) {
      handleCapturePhoto();
    } else if (isRecording) {
      stopRecording();
    }
  };

  const handleDelete = () => {
    setCapturedMedia(null);
    setSelectedFile(null);
    setCaption("");
    setCameraActive(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({ type: "image", data: reader.result });
        setCameraActive(false);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedFile({ type: "video", data: videoUrl });
      setCameraActive(false);
    }
  };

  const handleSubmit = () => {
    console.log("File: ", selectedFile || capturedMedia);
    console.log("Caption: ", caption);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen min-h-screen inset-0 bg-locket -z-50">
      <h1 className="text-3xl mb-6 font-semibold">Locket Upload</h1>
      <div className="relative w-full max-w-md aspect-square bg-gray-800 rounded-[60px] overflow-hidden">
        {/* Vòng tiến trình khi quay */}
        {isRecording && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="#ef4444"
              strokeWidth="8"
              strokeDasharray="301.6"
              strokeDashoffset={301.6 * (1 - recordingProgress / 100)}
              className="transition-all duration-100"
            />
          </svg>
        )}

        {!selectedFile && cameraActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${
              cameraMode === "front" ? "scale-x-[-1]" : ""
            }`}
          />
        )}
        {selectedFile && selectedFile.type === "video" && (
          <div className="relative w-full h-full overflow-hidden">
            <video
              src={selectedFile.data}
              autoPlay
              loop
              playsInline
              controls
              muted
              className="w-full h-full object-contain bg-black"
            />
          </div>
        )}
        {selectedFile && selectedFile.type === "image" && (
          <img
            src={selectedFile.data}
            alt="Selected File"
            className="w-full h-full object-contain bg-black select-none no-save"
          />
        )}
        {capturedMedia && capturedMedia.type === "image" && (
          <img
            src={capturedMedia.data}
            alt="Captured"
            className="w-full h-full object-contain bg-black select-none no-save"
          />
        )}
        {capturedMedia && capturedMedia.type === "video" && (
          <video
            src={capturedMedia.data}
            autoPlay
            loop
            playsInline
            controls
            muted
            className="w-full h-full object-contain bg-black"
          />
        )}

        {(capturedMedia || selectedFile) && (
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Nhập tin nhắn..."
            rows="1"
            className="absolute text-white font-semibold bottom-4 left-1/2 transform backdrop-blur-2xl -translate-x-1/2 bg-white/50 rounded-4xl p-2 text-md outline-none max-w-[90%] w-auto resize-none overflow-hidden transition-all"
            style={{ width: `${Math.max(100, caption.length * 10)}px` }}
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
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className={`rounded-full w-18 h-18 mx-4 outline-5 outline-offset-3 outline-accent ${
                isRecording ? "bg-red-500" : "bg-base-300"
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
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;