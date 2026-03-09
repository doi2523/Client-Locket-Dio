import React, { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { useApp } from "@/context/AppContext";
import { Scissors, X } from "lucide-react";

const CropVideoStudio = () => {
  const { preview, setPreview, videoCrop, setVideoCrop, videoCropArea, setVideoCropArea } =
    useApp().post;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const handleConfirm = () => {
    if (!croppedAreaPixels) return;
    console.log(croppedAreaPixels);
    setPreview({ type: "video", data: videoCrop });
    setVideoCropArea(croppedAreaPixels); // ✅ lưu tọa độ
    setVideoCrop(null);
  };

  // Mỗi khi videoCrop thay đổi, xử lý hiệu ứng mở/đóng
  useEffect(() => {
    if (videoCrop) {
      setShowCropper(true); // Mở cropper
    } else {
      // Đóng cropper sau hiệu ứng (300ms)
      const timer = setTimeout(() => setShowCropper(false), 300);
      return () => clearTimeout(timer);
    }
  }, [videoCrop]);

  return (
    <>
      {showCropper && (
        <div
          className={`fixed inset-0 z-50 bg-base-100/30 backdrop-blur-xl
            transition-all duration-500 ease-in-out overflow-hidden
            ${videoCrop ? "opacity-100" : "opacity-0 pointer-events-none"}
            flex flex-col`}
        >
          {/* Video preview + crop */}
          <div className="flex-1 relative">
            {/* Crop overlay */}
            <Cropper
              video={videoCrop}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
              mediaProps={{
                autoPlay: true,
                muted: true,
                playsInline: true,
              }}
            />
          </div>

          {/* Footer */}
          <div className="w-full bg-base-200 pt-4 pb-5 px-4 rounded-t-3xl">
            <h1 className="text-xl text-center font-bold">
              🎬 Crop Video Studio
            </h1>

            <div className="flex justify-center gap-4 mt-3">
              <button
                onClick={() => setVideoCrop(null)}
                className="btn btn-outline btn-error"
              >
                <X className="mr-1" /> Huỷ
              </button>

              <button onClick={handleConfirm} className="btn btn-primary">
                <Scissors className="mr-1" /> Lưu vùng cắt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CropVideoStudio;
