import React, { useRef, useState, useEffect } from "react";
import { RefreshCcw, Send, Sparkles, ImageUp, X } from "lucide-react";
import AutoResizeTextarea from "./AutoResizeTextarea";

const CameraCapture = ({ onCapture }) => {
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
  const [permissionChecked, setPermissionChecked] = useState(false);
  const holdTimeout = useRef(null);
  const intervalRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const MAX_RECORD_TIME = 10;

  useEffect(() => {
    if (!permissionChecked) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
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
  const handleSubmit = () => {
    console.log("File: ", selectedFile || capturedMedia);
    console.log("Caption: ", caption);
  };

  const startHold = () => {
    setIsHolding(true);
    setHoldTime(0);

    intervalRef.current = setInterval(() => {
      setHoldTime((prev) => prev + 0.1);
    }, 100);

    holdTimeout.current = setTimeout(() => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        const chunks = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "video/mp4" });
          // const videoUrl = URL.createObjectURL(blob);
          const videoUrl =
          cameraMode === "user"
            ? URL.createObjectURL(await correctFrontCameraVideo(blob))
            : URL.createObjectURL(blob);

          setSelectedFile({ type: "video", data: videoUrl });
          setCameraActive(false);
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
          ctx.drawImage(video, xOffset, yOffset, size, size, -size / 2, 0, size, size);
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
  
  const cropVideoToSquare = (blob) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous"; 
      video.src = URL.createObjectURL(blob);
      video.onloadedmetadata = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;
  
        video.onplay = () => {
          const stream = canvas.captureStream();
          const recorder = new MediaRecorder(stream, { mimeType: "video/mp4" });
          const chunks = [];
  
          recorder.ondataavailable = (e) => chunks.push(e.data);
          recorder.onstop = () => resolve(new Blob(chunks, { type: "video/mp4" }));
  
          recorder.start();
  
          const drawFrame = () => {
            if (video.ended) {
              recorder.stop();
              return;
            }
            const xOffset = (video.videoWidth - size) / 2;
            const yOffset = (video.videoHeight - size) / 2;
            ctx.drawImage(video, xOffset, yOffset, size, size, 0, 0, size, size);
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
      const videoBlob = new Blob([file], { type: file.type });
  
      cropVideoToSquare(videoBlob).then((croppedBlob) => {
        const videoUrl = URL.createObjectURL(croppedBlob);
        setSelectedFile({ type: "video", data: videoUrl });
        setCameraActive(false);
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
          const recorder = new MediaRecorder(stream, { mimeType: "video/mp4" });
          const chunks = [];

          recorder.ondataavailable = (e) => chunks.push(e.data);
          recorder.onstop = () => resolve(new Blob(chunks, { type: "video/mp4" }));

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
  return (
    <div className="flex select-none flex-col items-center justify-center h-screen min-h-screen bg-locket -z-50">
      <h1 className="text-3xl mb-6 font-semibold">Locket Upload</h1>
      <div className="relative w-full max-w-md aspect-square bg-gray-800 rounded-[60px] overflow-hidden">
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
          <AutoResizeTextarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Nhập tin nhắn..."
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
                isHolding ? "bg-white animate-pulseBeat" : "bg-white"
              }`}
            ></button>
            <button className="cursor-pointer">
              <RefreshCcw
              onClick={handleRotateCamera}
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
