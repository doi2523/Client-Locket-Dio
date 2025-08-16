import { X, Sparkles } from "lucide-react";
import * as services from "@/services";
import { useApp } from "@/context/AppContext.jsx";
import { useCallback, useState } from "react";
import { showError, showInfo, showSuccess } from "@/components/Toast/index.jsx";
import { defaultPostOverlay } from "@/stores/usePost.js";
import UploadStatusIcon from "./UploadStatusIcon.jsx";
import { getMaxUploads } from "@/hooks/useFeature.js";
import { useStreakToDay } from "@/hooks/useStreak.js";
import { useUploadQueue } from "@/hooks/useUploadQueue.js";

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
    recentPosts,
    setRecentPosts,
    postOverlay,
    setPostOverlay,
    audience,
    setAudience,
    selectedRecipients,
    setSelectedRecipients,
    maxImageSizeMB,
    maxVideoSizeMB,
    setuploadPayloads,
  } = post;
  const { setCameraActive } = camera;

  //Nhap hooks
  const { storage_limit_mb } = getMaxUploads();
  const isStreaktoday = useStreakToDay();
  const { handleQueueUpload, isProcessingQueue } = useUploadQueue();

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
    setCameraActive(true); // Giữ dòng này để trigger useEffect
    setIsSuccess(false); // Reset success state
  }, []);

  // Hàm submit được cải tiến
  const handleSubmit = async () => {
    if (!selectedFile) {
      showError("Không có dữ liệu để tải lên.");
      return;
    }

    const { type: previewType } = preview || {};
    const isImage = previewType === "image";
    const isVideo = previewType === "video";
    const maxFileSize = isImage ? maxImageSizeMB : maxVideoSizeMB;

    if (isVideo && isSizeMedia < 0.2) {
      showError("Video quá nhẹ hoặc không hợp lệ (dưới 0.2MB).");
      return;
    }
    if (isSizeMedia > maxFileSize) {
      showError(
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
        selectedRecipients,
        isStreaktoday
      );

      if (!payload) {
        throw new Error("Không tạo được payload. Hủy tiến trình tải lên.");
      }

      // Thêm thông tin bổ sung vào payload
      payload.contentType = previewType;
      payload.createdAt = new Date().toISOString();
      payload.status = "uploading"; // Đánh dấu trạng thái là đang upload

      // Lưu payload vào localStorage
      const savedPayloads = JSON.parse(
        localStorage.getItem("uploadPayloads") || "[]"
      );
      savedPayloads.push(payload);
      localStorage.setItem("uploadPayloads", JSON.stringify(savedPayloads));
      setuploadPayloads(savedPayloads);
      // Kết thúc loading và hiển thị success
      setUploadLoading(false);
      setIsSuccess(true);
      // Hiển thị thông báo thành công
      showSuccess(
        `Đã đưa bài vào hàng chờ. Tổng cộng ${savedPayloads.length} bài đang chờ xử lý.`
      );

      // Reset success state sau 1 giây
      setTimeout(() => {
        setIsSuccess(false);
        handleDelete();
      }, 1000);

      // Tự động bắt đầu xử lý hàng đợi nếu chưa chạy
      if (!isProcessingQueue) {
        console.log("🚀 Tự động bắt đầu xử lý hàng đợi upload...");
        setTimeout(() => {
          handleQueueUpload();
        }, 1500); // Delay nhỏ để UI kịp cập nhật
      }
    } catch (error) {
      setUploadLoading(false);
      setIsSuccess(false);

      const errorMessage =
        error?.response?.data?.message || error.message || "Lỗi không xác định";
      showError(`Tạo payload thất bại: ${errorMessage}`);

      console.error("❌ Tạo payload thất bại:", error);
    }
  };

  // Hàm để xóa tất cả hàng đợi (nếu cần)
  const clearAllQueues = () => {
    localStorage.removeItem("uploadPayloads");
    localStorage.removeItem("failedUploads");
    showSuccess("Đã xóa tất cả hàng đợi upload.");
  };

  return (
    <>
      <div className="flex gap-4 w-full h-25 max-w-md justify-evenly items-center">
        <button
          className="cursor-pointer"
          onClick={handleDelete}
          disabled={sendLoading || uploadLoading}
        >
          <X size={35} />
        </button>
        <button
          onClick={handleSubmit}
          className={`rounded-full w-22 h-22 duration-500 outline-base-300 backdrop-blur-4xl mx-2.5 text-center flex items-center justify-center disabled:opacity-50 transition-all ease-in-out ${
            isSuccess
              ? "bg-green-500/20 scale-105"
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
          className="cursor-pointer"
          onClick={() => {
            setIsFilterOpen(true);
          }}
          disabled={uploadLoading}
        >
          <Sparkles size={35} />
        </button>
      </div>
    </>
  );
};

export default MediaControls;
