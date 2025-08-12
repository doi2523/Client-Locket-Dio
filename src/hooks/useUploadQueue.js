import { useCallback, useRef } from "react";
import { showError, showSuccess } from "@/components/Toast";
import { PostMoments } from "@/services";
import * as utils from "@/utils";
import { useApp } from "@/context/AppContext";

export const useUploadQueue = () => {
  const { setRecentPosts, setuploadPayloads } = useApp().post;
  const isProcessingQueueRef = useRef(false);

  const handleQueueUpload = useCallback(async () => {
    if (isProcessingQueueRef.current) return;
    isProcessingQueueRef.current = true;

    try {
      let queuePayloads = JSON.parse(
        localStorage.getItem("uploadPayloads") || "[]"
      );

      if (queuePayloads.length === 0) {
        console.log("✅ Không có bài nào trong hàng đợi.");
        return;
      }

      console.log("🚀 Bắt đầu xử lý hàng đợi upload");

      for (let i = 0; i < queuePayloads.length; i++) {
        const currentPayload = queuePayloads[i];

        // Chỉ xử lý nếu đang trong trạng thái "uploading"
        if (currentPayload.status !== "uploading") {
          continue;
        }

        try {
          console.log(`📤 Đang upload bài ${i + 1}/${queuePayloads.length}`);

          const response = await PostMoments(currentPayload);

          const savedResponses = JSON.parse(
            localStorage.getItem("uploadedMoments") || "[]"
          );
          const normalizedNewData = utils.normalizeMoments([response?.data]);
          const updatedData = [...savedResponses, ...normalizedNewData];
          localStorage.setItem("uploadedMoments", JSON.stringify(updatedData));
          setRecentPosts(updatedData);

          // ✅ Đánh dấu thành công
          queuePayloads[i].status = "done";
          queuePayloads[i].lastUploaded = new Date().toISOString();

          showSuccess(
            `${
              currentPayload.contentType === "video" ? "Video" : "Hình ảnh"
            } đã được tải lên!`
          );

          console.log(`✅ Upload thành công bài ${i + 1}`);
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message ||
            error.message ||
            "Lỗi không xác định";

          console.error(`❌ Upload thất bại bài ${i + 1}:`, errorMessage);

          queuePayloads[i].status = "error";
          queuePayloads[i].errorMessage = errorMessage;
          queuePayloads[i].retryCount = (queuePayloads[i].retryCount || 0) + 1;
          queuePayloads[i].lastTried = new Date().toISOString();

          showError(
            `Bài ${
              i + 1
            } tải lên thất bại: ${errorMessage}. Tiếp tục bài tiếp theo...`
          );
        }

        // ✅ Cập nhật localStorage và state sau mỗi lần
        localStorage.setItem("uploadPayloads", JSON.stringify(queuePayloads));
        setuploadPayloads([...queuePayloads]);

        // ⏳ Delay nhỏ trước khi xử lý bài tiếp theo
        if (i < queuePayloads.length - 1) {
          console.log("⏳ Chờ 1 giây...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      console.log("✅ Hoàn thành xử lý hàng đợi upload");
    } catch (error) {
      console.error("❌ Lỗi trong quá trình xử lý hàng đợi:", error);
    } finally {
      isProcessingQueueRef.current = false;
    }
  }, [setRecentPosts, setuploadPayloads]);

  const getQueueStatus = useCallback(() => {
    const pending = JSON.parse(localStorage.getItem("uploadPayloads") || "[]");
    const uploaded = JSON.parse(
      localStorage.getItem("uploadedMoments") || "[]"
    );
    const failed = JSON.parse(localStorage.getItem("failedUploads") || "[]");

    return {
      pending: pending.length,
      uploaded: uploaded.length,
      failed: failed.length,
      isProcessing: isProcessingQueueRef.current,
    };
  }, []);

  const initializeQueueProcessor = useCallback(() => {
    const pendingUploads = JSON.parse(
      localStorage.getItem("uploadPayloads") || "[]"
    );

    if (pendingUploads.length > 0 && !isProcessingQueueRef.current) {
      console.log(
        `🔄 Phát hiện ${pendingUploads.length} bài đang chờ upload. Tự động bắt đầu xử lý...`
      );
      setTimeout(() => {
        handleQueueUpload();
      }, 2000); // Delay để đợi các component khác load xong
    }
  }, [handleQueueUpload]);

  return {
    handleQueueUpload,
    getQueueStatus,
    initializeQueueProcessor,
    isProcessingQueue: isProcessingQueueRef.current,
  };
};