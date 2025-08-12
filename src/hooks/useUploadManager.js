import { useCallback } from "react";
import { showError, showSuccess, showInfo } from "@/components/Toast";
import * as services from "@/services";
import { useApp } from "@/context/AppContext";
import { useStreakToDay } from "./useStreak";

export const useUploadManager = () => {
  const {
    preview,
    selectedFile,
    isSizeMedia,
    postOverlay,
    audience,
    selectedRecipients,
    maxImageSizeMB,
    maxVideoSizeMB,
    setuploadPayloads,
  } = useApp().post;
  const isStreaktoday = useStreakToDay();
  
  const handleSubmit = useCallback(async () => {
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
  }, [
    selectedFile,
    preview,
    postOverlay,
    audience,
    selectedRecipients,
    isSizeMedia,
    maxImageSizeMB,
    maxVideoSizeMB,
    isStreaktoday,
    setuploadPayloads,
    setUploadLoading,
    setIsSuccess,
    handleDelete,
    handleQueueUpload,
    isProcessingQueue,
  ]);

  const retryFailedUploads = useCallback(() => {
    const failedUploads = JSON.parse(
      localStorage.getItem("failedUploads") || "[]"
    );

    if (failedUploads.length === 0) {
      showInfo("Không có bài nào bị lỗi để thử lại.");
      return;
    }

    // Chuyển các payload bị lỗi về hàng đợi chính
    const pendingPayloads = JSON.parse(
      localStorage.getItem("uploadPayloads") || "[]"
    );
    const retryPayloads = failedUploads.map((item) => item.payload);

    pendingPayloads.push(...retryPayloads);
    localStorage.setItem("uploadPayloads", JSON.stringify(pendingPayloads));

    // Xóa danh sách lỗi
    localStorage.removeItem("failedUploads");

    showSuccess(
      `Đã đưa ${failedUploads.length} bài bị lỗi vào hàng đợi để thử lại.`
    );

    // Tự động bắt đầu xử lý nếu chưa chạy
    if (!isProcessingQueue) {
      setTimeout(() => {
        handleQueueUpload();
      }, 1000);
    }
  }, [isProcessingQueue, handleQueueUpload]);

  const clearAllQueues = useCallback(() => {
    localStorage.removeItem("uploadPayloads");
    localStorage.removeItem("failedUploads");
    showSuccess("Đã xóa tất cả hàng đợi upload.");
  }, []);

  return {
    handleSubmit,
    retryFailedUploads,
    clearAllQueues,
  };
};
