import React, { useCallback } from "react";
import { useApp } from "../../../../../context/AppContext";
import { showToast } from "../../../../../components/Toast";
import { ImageUp } from "lucide-react";

const UploadFile = () => {
  const { post, useloading, camera } = useApp();
  const { selectedFile, setSelectedFile, preview, setPreview, setSizeMedia } = post;
  const { uploadLoading, setUploadLoading, setIsCaptionLoading } = useloading;
  const { cameraActive, setCameraActive } = camera;

  //Handle tải file
  const handleFileChange = useCallback(async (event) => {
    setCameraActive(false)
    setSelectedFile(null);
    const rawFile = event.target.files[0];
    if (!rawFile) return;
    const localPreviewUrl = URL.createObjectURL(rawFile);
    const fileType = rawFile.type.startsWith("image/")
      ? "image"
      : rawFile.type.startsWith("video/")
      ? "video"
      : null;

    if (!fileType) {
      showToast("error", "Chỉ hỗ trợ ảnh và video.");
      return;
    }
    setPreview({ type: fileType, data: localPreviewUrl }); // Preview local ngay

    // Convert file size to MB
    const fileSizeInMB = rawFile.size / (1024 * 1024); // size in MB
    setSizeMedia(fileSizeInMB.toFixed(2)); // Store the size in MB, rounded to 2 decimal places
    setIsCaptionLoading(true);
    setSelectedFile(rawFile); // Lưu file đã chọn
  }, []);
  return (
    <>
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <ImageUp size={35} />
      </label>
    </>
  );
};
export default UploadFile;
