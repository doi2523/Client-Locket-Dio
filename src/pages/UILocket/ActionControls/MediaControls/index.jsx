import { X, Send, Sparkles } from "lucide-react";
import * as utils from "../../../../utils/index.js";
import * as lockerService from "../../../../services/locketService.js";
import LoadingRing from "../../../../components/UI/Loading/ring.jsx";
import { useApp } from "../../../../context/AppContext.jsx";
import { useCallback } from "react";
import { showToast } from "../../../../components/Toast/index.jsx";

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

  const handleSubmit = async () => {
    if (!selectedFile) {
      showToast("error", "Không có dữ liệu để tải lên.");
      return;
    }

    // Kiểm tra dung lượng file
    const isImage = preview?.type === "image";
    const isVideo = preview?.type === "video";

    if ((isImage && isSizeMedia > 1) || (isVideo && isSizeMedia > 10)) {
      showToast(
        "error",
        `${isImage ? "Ảnh" : "Video"} vượt quá giới hạn dung lượng. ${
          isImage ? "Tối đa 1MB" : "Tối đa 10MB"
        }.`
      );
      return;
    }

    try {
      setSendLoading(true);
      showToast("info", `Đang chuẩn bị ${isVideo ? "video" : "ảnh"} !`);

      const fileData = await utils.uploadToCloudinary(
        selectedFile,
        preview.type
      );

      const mediaInfo = utils.prepareMediaInfo(fileData);

      const payload = utils.createRequestPayloadV2(
        mediaInfo,
        caption,
        selectedColors
      );

      showToast("info", `Đang tạo bài viết !`);
      await lockerService.uploadMediaV2(payload);

      showToast(
        "success",
        `${fileData.type === "video" ? "Video" : "Hình ảnh"} đã được tải lên!`
      );

      // Reset state
      setPreview(null);
      setSelectedFile(null);
      setCaption("");
      setSelectedColors(null);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Lỗi không xác định";
      showToast("error", `Lỗi khi tải lên: ${errorMessage}`);
      console.error("Lỗi khi gửi bài:", error);
    } finally {
      setSendLoading(false);
    }
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
