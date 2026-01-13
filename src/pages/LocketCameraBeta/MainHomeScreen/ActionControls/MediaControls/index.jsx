import { X, Sparkles } from "lucide-react";
import * as services from "@/services";
import { useApp } from "@/context/AppContext.jsx";
import { useCallback, useState } from "react";
import { defaultPostOverlay } from "@/stores/usePost.js";
import UploadStatusIcon from "./UploadStatusIcon.jsx";
import { getMaxUploads } from "@/hooks/useFeature.js";
import {
  SonnerError,
  SonnerInfo,
  SonnerSuccess,
  SonnerWarning,
} from "@/components/ui/SonnerToast";
import { useUploadQueueStore } from "@/stores";

const MediaControls = () => {
  const { navigation, post, useloading, camera } = useApp();
  const { setIsFilterOpen } = navigation;
  const { sendLoading, uploadLoading, setUploadLoading } = useloading;
  const {
    preview,
    setPreview,
    selectedFile,
    setSelectedFile,
    isSizeMedia,
    setSizeMedia,
    postOverlay,
    setPostOverlay,
    audience,
    setAudience,
    selectedRecipients,
    setSelectedRecipients,
  } = post;
  const { setCameraActive } = camera;

  //Nhap hooks
  const { maxImageSizeMB, maxVideoSizeMB, storage_limit_mb } = getMaxUploads();
  const enqueueUploadItem = useUploadQueueStore((s) => s.enqueueUploadItem);

  // State để quản lý hiệu ứng loading và success
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDelete = useCallback(() => {
    // Dừng stream cũ nếu có
    if (camera.streamRef.current) {
      camera.streamRef.current.getTracks().forEach((track) => track.stop());
      camera.streamRef.current = null;
    }
    setSelectedFile(null);
    setPreview(null);
    setSizeMedia(null);
    setPostOverlay(defaultPostOverlay);
    setAudience("all");
    setCameraActive(true); // Giữ dòng này để trigger useEffect
    setIsSuccess(false); // Reset success state
  }, []);

  // Hàm submit được cải tiến
  const handleSubmit = async () => {
    if (!selectedFile) {
      SonnerWarning("Không có dữ liệu để tải lên.");
      return;
    }

    const { type: previewType } = preview || {};
    const isImage = previewType === "image";
    const isVideo = previewType === "video";
    const maxFileSize = isImage ? maxImageSizeMB : maxVideoSizeMB;

    if (isVideo && isSizeMedia < 0.2) {
      SonnerWarning("Video quá nhẹ hoặc không hợp lệ (dưới 0.2MB).");
      return;
    }
    if (!maxFileSize) {
      SonnerInfo(
        "Không tìm thấy dữ liệu người dùng.",
        "Hãy truy cập lại web để làm mới!"
      );
      return;
    }
    if (isSizeMedia > maxFileSize) {
      SonnerWarning(
        "Nâng cấp gói để tăng giới hạn!",
        `${
          isImage ? "Ảnh" : "Video"
        } vượt quá dung lượng. Tối đa ${maxFileSize}MB.`
      );
      return;
    }

    try {
      // Bắt đầu loading
      setUploadLoading(true);
      setIsSuccess(false);

      // Tạo payload
      const payload = await services.createRequestPayloadV5(
        selectedFile,
        previewType,
        postOverlay,
        audience,
        selectedRecipients
      );

      if (!payload) {
        throw new Error("Không tạo được payload. Hủy tiến trình tải lên.");
      }

      // Lưu payload vào memory và start
      enqueueUploadItem(payload);

      // Kết thúc loading và hiển thị success
      setUploadLoading(false);
      setIsSuccess(true);
      // Hiển thị thông báo thành công
      SonnerSuccess(
        "Thêm vào hàng đợi!", // Title
        "Bài viết đang được xử lý..." // Body
      );
      // Reset success state sau 1 giây
      setTimeout(() => {
        setIsSuccess(false);
        handleDelete();
      }, 1000);
    } catch (error) {
      setUploadLoading(false);
      setIsSuccess(false);

      const errorMessage =
        error?.response?.data?.message || error.message || "Lỗi không xác định";
      SonnerError("Tạo payload thất bại!", `${errorMessage}`);

      console.error("❌ Tạo payload thất bại:", error);
    }
  };

  return (
    <>
      <button
        className="cursor-pointer active:scale-95"
        onClick={handleDelete}
        disabled={sendLoading || uploadLoading}
      >
        <X size={35} />
      </button>
      <button
        onClick={handleSubmit}
        className={`rounded-full w-24 h-24 duration-500 outline-base-300 backdrop-blur-4xl text-center flex items-center justify-center disabled:opacity-50 transition-all ease-in-out active:scale-95 ${
          isSuccess
            ? "bg-green-500/20"
            : uploadLoading
            ? "bg-blue-500/20"
            : "bg-base-300/50 hover:bg-base-300/70"
        }`}
        disabled={uploadLoading}
        style={{
          animation: isSuccess ? "success-pulse 1s ease-in-out" : "none",
        }}
      >
        <UploadStatusIcon loading={uploadLoading} success={isSuccess} />
      </button>
      <button
        className="cursor-pointer active:scale-95"
        onClick={() => {
          setIsFilterOpen(true);
        }}
        disabled={uploadLoading}
      >
        <Sparkles size={35} />
      </button>
    </>
  );
};

export default MediaControls;
