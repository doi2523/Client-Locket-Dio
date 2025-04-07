import React, { useCallback } from "react";
import { useApp } from "../../../../../context/AppContext";
import { showToast } from "../../../../../components/Toast";
import { ImageUp } from "lucide-react";
import * as utils from "../../../../../utils";
import { data } from "react-router-dom";

const UploadFile = () => {
  const { post, useloading } = useApp();
  const { selectedFile, setSelectedFile, preview, setPreview } = post;
  const { uploadLoading, setUploadLoading } = useloading;

  const handleFileChange = useCallback(async (event) => {
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

    showToast("info", `Đang tải ${fileType === "image" ? "ảnh" : "video"}...`);
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", rawFile);

      const uploadPreset =
        fileType === "image" ? "locket_image_preset" : "locket_video_preset";
      formData.append("upload_preset", uploadPreset);

      const cloudinaryUrl =
        fileType === "image"
          ? utils.API_URL.UPLOAD_IMAGE_TO_CLOUD
          : utils.API_URL.UPLOAD_VIDEO_TO_CLOUD;

      const res = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadLoading(false);
        showToast("success", "Tải lên thành công!");

        // Lưu thông tin file sau khi upload
        const fileData =
          fileType === "image"
            ? {
                // Dữ liệu cho ảnh
                type: "image",
                url: data.secure_url,
                public_id: data.public_id,
                size: data.bytes,
                format: data.format,
                width: data.width,
                height: data.height,
              }
            : {
                // Dữ liệu cho video
                type: "video",
                url: data.secure_url,
                public_id: data.public_id,
                size: data.bytes,
                format: data.format,
                duration: data.duration,
                thumbnail: `https://res.cloudinary.com/diocloud/video/upload/w_500,h_500,c_fill,q_auto,f_auto/v${data.version}/${data.public_id}.jpeg`,
              };

        setSelectedFile(fileData); // Cập nhật file sau khi upload thành công
        setPreview({ type: fileType, data: fileData.url });
        console.log("File đã upload:", fileData);
      } else {
        showToast("error", data?.error?.message || "Tải lên thất bại!");
        console.error("Upload lỗi:", data);
        setUploadLoading(false);
      }
    } catch (error) {
      console.error("Lỗi khi upload:", error);
      showToast("error", "Lỗi hệ thống!");
      setUploadLoading(false);
    }
  }, []);
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
    </>
  );
};
export default UploadFile;
