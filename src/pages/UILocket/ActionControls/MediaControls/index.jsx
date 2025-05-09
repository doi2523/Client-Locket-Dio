import { X, Send, Sparkles } from "lucide-react";
import * as utils from "../../../../utils/index.js";
import * as lockerService from "../../../../services/locketService.js";
import LoadingRing from "../../../../components/UI/Loading/ring.jsx";
import { useApp } from "../../../../context/AppContext.jsx";
import { useCallback } from "react";
import {
  showError,
  showInfo,
  showSuccess,
} from "../../../../components/Toast/index.jsx";

const MediaControls = () => {
  const { navigation, post, useloading, camera } = useApp();
  const { setIsFilterOpen } = navigation;
  const { sendLoading, setSendLoading } = useloading;
  const {
    preview,
    setPreview,
    caption,
    setCaption,
    selectedFile,
    setSelectedFile,
    selectedColors,
    setSelectedColors,
    isSizeMedia,
    setSizeMedia,
  } = post;
  const { cameraActive, setCameraActive } = camera;

  const handleDelete = useCallback(() => {
    // Dừng stream cũ nếu có
    if (camera.streamRef.current) {
      camera.streamRef.current.getTracks().forEach((track) => track.stop());
      camera.streamRef.current = null;
    }
    setSelectedFile(null);
    setPreview(null);
    setCaption("");
    setSizeMedia(null);
    setSelectedColors({ id: "", top: "", bottom: "", text: "#FFFFFF" });

    setCameraActive(true); // Giữ dòng này để trigger useEffect
  }, []);

  const uploadQueue = [];
  let isUploading = false;

  const handleQueueUpload = async () => {
    if (isUploading || uploadQueue.length === 0) return;
    isUploading = true;

    try {
      const { selectedFile, previewType, caption, selectedColors } =
        uploadQueue.shift();
      const payload = await utils.createRequestPayloadV3(
          selectedFile,
          previewType,
          caption,
          selectedColors
      );

      // showInfo(`Đang tạo bài viết !`);
      await lockerService.uploadMediaV2(payload);
      showSuccess(
        `${previewType === "video" ? "Video" : "Hình ảnh"} đã được tải lên!`
      );
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Lỗi không xác định";
      showError(`Lỗi khi tải lên: ${errorMessage}`);
      console.error("Lỗi khi gửi bài:", error);
    } finally {
      isUploading = false;
      handleQueueUpload();
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      showError("Không có dữ liệu để tải lên.");
      return;
    }

    const { type: previewType } = preview || {};
    const isImage = previewType === "image";
    const isVideo = previewType === "video";
    const maxFileSize = isImage ? 1 : 10;

    if (isSizeMedia > maxFileSize) {
      showError(
        `${
          isImage ? "Ảnh" : "Video"
        } vượt quá giới hạn dung lượng. Tối đa ${maxFileSize}MB.`
      );
      return;
    }

    setSendLoading(true);
    //Thêm vào hàng đợi để xử lý
    uploadQueue.push({ selectedFile, previewType, caption, selectedColors });
    //Làm mới
    setTimeout(() => {
      setSendLoading(false);
      console.log("Sau khi setSendLoading(false):", sendLoading);
      handleDelete();
    }, 500);
    //Gọi hàm xử lý hàng đợi
    handleQueueUpload();

    // setSendLoading(false);
  };

  return (
    <>
      <button
        className="cursor-pointer"
        onClick={handleDelete}
        disabled={sendLoading}
      >
        <X size={35} />
      </button>
      <button
        onClick={handleSubmit}
        className="rounded-full w-22 h-22 duration-300 outline-base-300 bg-base-300/50 backdrop-blur-4xl mx-4 text-center flex items-center justify-center disabled:opacity-50"
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
    </>
  );
};
export default MediaControls;
