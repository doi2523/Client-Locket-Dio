import { X, Send, Sparkles, Check } from "lucide-react";
import * as utils from "../../../../utils/index.js";
import * as services from "../../../../services";
import { useApp } from "../../../../context/AppContext.jsx";
import { useCallback, useEffect, useState } from "react";
import {
  showError,
  showInfo,
  showSuccess,
} from "../../../../components/Toast/index.jsx";
import { defaultPostOverlay } from "../../../../stores/usePost.js";
import { PostMoments } from "../../../../services/index.js";
import UploadStatusIcon from "./UploadStatusIcon.jsx";
import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthLocket.jsx";
import { getMaxUploads } from "../../../../hooks/useFeature.js";

const MediaControls = () => {
  const { uploadStats } = useContext(AuthContext)
  const { navigation, post, useloading, camera } = useApp();
  const { setIsFilterOpen } = navigation;
  const { sendLoading, setSendLoading, uploadLoading, setUploadLoading } =
    useloading;
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
  const { storage_limit_mb } = getMaxUploads();

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

  // Biến global để theo dõi trạng thái upload
  let isProcessingQueue = false;

  const handleQueueUpload = async () => {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

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
      isProcessingQueue = false;
    }
  };

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
        selectedRecipients
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

  // Hàm tiện ích để xem trạng thái hàng đợi
  const getQueueStatus = () => {
    const pending = JSON.parse(localStorage.getItem("uploadPayloads") || "[]");
    const uploaded = JSON.parse(
      localStorage.getItem("uploadedMoments") || "[]"
    );
    const failed = JSON.parse(localStorage.getItem("failedUploads") || "[]");

    return {
      pending: pending.length,
      uploaded: uploaded.length,
      failed: failed.length,
      isProcessing: isProcessingQueue,
    };
  };

  // Hàm để thử lại các upload bị lỗi
  const retryFailedUploads = () => {
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
  };

  // Hàm để xóa tất cả hàng đợi (nếu cần)
  const clearAllQueues = () => {
    localStorage.removeItem("uploadPayloads");
    localStorage.removeItem("failedUploads");
    showSuccess("Đã xóa tất cả hàng đợi upload.");
  };

  // Tự động kiểm tra và xử lý hàng đợi khi trang load
  const initializeQueueProcessor = () => {
    const pendingUploads = JSON.parse(
      localStorage.getItem("uploadPayloads") || "[]"
    );

    if (pendingUploads.length > 0 && !isProcessingQueue) {
      console.log(
        `🔄 Phát hiện ${pendingUploads.length} bài đang chờ upload. Tự động bắt đầu xử lý...`
      );
      setTimeout(() => {
        handleQueueUpload();
      }, 2000); // Delay để đợi các component khác load xong
    }
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
