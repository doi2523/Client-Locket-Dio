import React, { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { useApp } from "@/context/AppContext";
import { Scissors, X } from "lucide-react";
import { getCroppedImg } from "@/utils";

const CropImageStudio = () => {
  const {
    selectedFile,
    setSelectedFile,
    preview,
    setPreview,
    isSizeMedia,
    setSizeMedia,
    imageToCrop,
    setImageToCrop,
    videoCrop,
    setVideoCrop
  } = useApp().post;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropError, setCropError] = useState("");

  const handleCropConfirm = useCallback(async () => {
    if (!croppedAreaPixels || !imageToCrop) return;

    try {
      const croppedFile = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const localPreviewUrl = URL.createObjectURL(croppedFile);

      setSelectedFile(croppedFile); // ✅ Lưu file gửi lên server
      setPreview({ type: "image", data: localPreviewUrl });
      const fileSizeInMB = croppedFile.size / (1024 * 1024);
      setSizeMedia(fileSizeInMB.toFixed(2));

      setImageToCrop(null); // ✅ Ẩn cropper sau khi cắt
    } catch (e) {
      console.error("Crop failed", e);
      setCropError(`⚠️ Không thể cắt ảnh. Chi tiết lỗi: ${e?.message || e}`);
    }
  }, [croppedAreaPixels, imageToCrop]);

  // Effect để reset crop và zoom khi có ảnh mới
  useEffect(() => {
    if (imageToCrop) {
      setCrop({ x: 0, y: 0 });
      setZoom(1); // Reset zoom về 1 để ảnh lấp đầy khung
    }
  }, [imageToCrop]);

  const [showCropper, setShowCropper] = useState(false);

  // Mỗi khi imageToCrop thay đổi, xử lý hiệu ứng mở/đóng
  useEffect(() => {
    if (imageToCrop) {
      setShowCropper(true); // Mở cropper
    } else {
      // Đóng cropper sau hiệu ứng (300ms)
      const timer = setTimeout(() => setShowCropper(false), 300);
      return () => clearTimeout(timer);
    }
  }, [imageToCrop]);

  //Khoá cuộn màn hình cho thẻ body
  useEffect(() => {
    if (imageToCrop) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [imageToCrop]);

  return (
    <>
      {showCropper && (
        <div
          className={`fixed inset-0 z-50 bg-base-100/30 backdrop-blur-xl
            transition-all duration-500 ease-in-out overflow-hidden
            ${imageToCrop ? "opacity-100" : "opacity-0 pointer-events-none"}
            flex flex-col`}
        >
          {/* Cropper Area */}
          <div className="flex-1 h-[calc(100vh-180px)] flex items-center justify-center relative">
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) =>
                setCroppedAreaPixels(croppedAreaPixels)
              }
              cropShape="rect"
              showGrid={true}
              zoomWithScroll={true}
              touchAction="pan"
              objectFit="contain"
              restrictPosition={true}
              disableAutomaticStylesInjection={false}
              style={{
                containerStyle: {
                  width: "100%",
                  height: "100%",
                },
              }}
            />
          </div>

          {/* Footer Buttons */}
          <div className="w-full bg-base-200 -mt-6 pt-4 pb-5 px-4 shadow-lg z-10 relative rounded-t-3xl">
            <h1 className="text-xl font-lovehouse text-center text-base-content">
              🖼️ Crop Image Studio
            </h1>
            <p className="text-sm text-center text-gray-600 mt-1">
              Kéo ảnh lên/xuống hoặc zoom để chọn vùng muốn cắt
            </p>
            {cropError && (
              <p className="text-sm text-center text-red-500 font-medium mt-2 break-words">
                {cropError}
              </p>
            )}

            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => setImageToCrop(null)}
                className="btn btn-outline btn-error"
              >
                <X className="mr-1" /> Huỷ
              </button>
              <button onClick={handleCropConfirm} className="btn btn-primary">
                <Scissors className="mr-1" /> Cắt ảnh
              </button>
            </div>
            <p className="text-xs italic text-center text-gray-400 mt-1">
              Nếu gặp lỗi, vui lòng báo với admin.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CropImageStudio;
