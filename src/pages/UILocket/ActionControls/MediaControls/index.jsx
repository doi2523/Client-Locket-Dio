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

    const { type: previewType } = preview || {};
    const isImage = previewType === "image";
    const isVideo = previewType === "video";
    const maxFileSize = isImage ? 1 : 10;
  
    if (isSizeMedia > maxFileSize) {
      showToast(
        "error",
        `${isImage ? "Ảnh" : "Video"} vượt quá giới hạn dung lượng. Tối đa ${maxFileSize}MB.`
      );
      return;
    }
  

    try {
      setSendLoading(true);
      showToast("info", `Đang chuẩn bị ${isVideo ? "video" : "ảnh"} !`);

      const payload = await utils.createRequestPayloadV3(
        selectedFile,
        previewType,
        caption,
        selectedColors
      );

      showToast("info", `Đang tạo bài viết !`);
      await lockerService.uploadMediaV2(payload);

      showToast(
        "success",
        `${previewType === "video" ? "Video" : "Hình ảnh"} đã được tải lên!`
      );
      
      handleDelete();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Lỗi không xác định";
      showToast("error", `Lỗi khi tải lên: ${errorMessage}`);
      console.error("Lỗi khi gửi bài:", error);
    } finally {
      setSendLoading(false);
    }
  };
//   const handleSubmit = async () => {
//     if (!selectedFile) {
//         showToast("error", "Không có dữ liệu để tải lên.");
//         return;
//     }

//     const { type: previewType } = preview || {};
//     const postData = {
//         selectedFile,
//         previewType,
//         caption,
//         selectedColors,
//     };

//     try {
//         // Lưu vào hàng đợi trong sessionStorage
//         const queue = JSON.parse(sessionStorage.getItem("postQueue")) || [];
//         queue.push(postData);
//         sessionStorage.setItem("postQueue", JSON.stringify(queue));

//         console.log("Bài viết đã được thêm vào hàng đợi:", postData);
//         showToast("success", "Bài viết đã được lưu vào hàng đợi!");
//     } catch (error) {
//         console.error("Lỗi khi lưu bài viết vào hàng đợi:", error);
//         showToast("error", "Lỗi khi lưu vào hàng đợi!");
//     }
// };

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
