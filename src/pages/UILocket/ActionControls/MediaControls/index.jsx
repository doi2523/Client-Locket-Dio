import { X, Send, Sparkles } from "lucide-react";
import * as utils from "../../../../utils/index.js";
import LoadingRing from "../../../../components/UI/Loading/ring.jsx";
import { useApp } from "../../../../context/AppContext.jsx";
import { useCallback } from "react";
import {
  showError,
  showInfo,
  showSuccess,
} from "../../../../components/Toast/index.jsx";
import { defaultPostOverlay } from "../../../../storages/usePost.js";
import { PostMoments } from "../../../../services/index.js";

const MediaControls = () => {
  const { navigation, post, useloading, camera } = useApp();
  const { setIsFilterOpen } = navigation;
  const { sendLoading, setSendLoading } = useloading;
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
  } = post;
  const { setCameraActive } = camera;

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
  }, []);
  const uploadQueue = [];
  let isUploading = false;

  // Hàm xử lý upload tuần tự theo hàng đợi
  const handleQueueUpload = async () => {
    if (isUploading) return;
    if (uploadQueue.length === 0) return;

    isUploading = true;

    try {
      const { selectedFile, previewType, postOverlay } = uploadQueue[0];

      const payload = await utils.createRequestPayloadV5(
        selectedFile,
        previewType,
        postOverlay,
        audience,
        selectedRecipients
      );

      if (!payload) {
        throw new Error("Không tạo được payload. Hủy tiến trình tải lên.");
      }

      const savedPayloads = JSON.parse(
        localStorage.getItem("uploadPayloads") || "[]"
      );
      savedPayloads.push(payload);
      // localStorage.setItem("uploadPayloads", JSON.stringify(savedPayloads));

      const response = await PostMoments(payload);

      const savedResponses = JSON.parse(
        localStorage.getItem("uploadedMoments") || "[]"
      );
      const normalizedNewData = utils.normalizeMoments([response?.data]);
      const updatedData = [...savedResponses, ...normalizedNewData];

      localStorage.setItem("uploadedMoments", JSON.stringify(updatedData));
      setRecentPosts(updatedData);

      showSuccess(
        `${previewType === "video" ? "Video" : "Hình ảnh"} đã được tải lên!`
      );

      uploadQueue.shift(); // Xóa khỏi hàng đợi sau thành công
      isUploading = false;
      handleQueueUpload(); // Gọi tiếp nếu còn
    } catch (error) {
      isUploading = false;

      const errorMessage =
        error?.response?.data?.message || error.message || "Lỗi không xác định";
      showError(`Tải lên thất bại: ${errorMessage}`);

      console.error("❌ Upload thất bại, hàng đợi dừng lại tại đây:", error);

      // KHÔNG gọi lại handleQueueUpload ở đây => dừng hẳn
      // Nếu muốn cho phép bỏ qua lỗi và tiếp tục, dùng dòng này thay:
      // uploadQueue.shift(); handleQueueUpload();
    }
  };

  // Hàm submit
  const handleSubmit = async () => {
    if (!selectedFile) {
      showError("Không có dữ liệu để tải lên.");
      return;
    }

    const { type: previewType } = preview || {};
    const isImage = previewType === "image";
    const isVideo = previewType === "video";
    const maxFileSize = isImage ? maxImageSizeMB : maxVideoSizeMB;

    if (isSizeMedia > maxFileSize) {
      showError(`${isImage ? "Ảnh" : "Video"} vượt quá dung lượng. Tối đa ${maxFileSize}MB.`);
      return;
    }

    uploadQueue.push({ selectedFile, previewType, postOverlay });
    setSendLoading(true);
    showInfo("Đã đưa bài vào hàng chờ. Đang tải lên...");

    handleQueueUpload(); // bắt đầu xử lý

    setTimeout(() => {
      setSendLoading(false);
      handleDelete();
    }, 500);
  };

  return (
    <>
      <div className="flex gap-4 w-full h-25 max-w-md justify-evenly items-center">
        <button
          className="cursor-pointer"
          onClick={handleDelete}
          disabled={sendLoading}
        >
          <X size={35} />
        </button>
        <button
          onClick={handleSubmit}
          className="rounded-full w-22 h-22 duration-300 outline-base-300 bg-base-300/50 backdrop-blur-4xl mx-2.5 text-center flex items-center justify-center disabled:opacity-50"
          disabled={sendLoading}
        >
          {sendLoading ? (
            <LoadingRing size={40} stroke={3} />
          ) : (
            <Send size={40} className="mr-1 mt-1" />
          )}
        </button>
        <button
          className="cursor-pointer"
          onClick={() => {
            setIsFilterOpen(true);
          }}
        >
          <Sparkles size={35} />
        </button>
      </div>
    </>
  );
};
export default MediaControls;
