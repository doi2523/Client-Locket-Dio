import { X, Send, Sparkles } from "lucide-react";
import * as utils from "../../../../utils/index.js";
import * as lockerService from "../../../../services/locketService.js";
import LoadingRing from "../../../../components/UI/Loading/ring.jsx";
import { useApp } from "../../../../context/AppContext.jsx";
import { useCallback, useEffect } from "react";
import {
  showError,
  showInfo,
  showSuccess,
} from "../../../../components/Toast/index.jsx";
import { defaultPostOverlay } from "../../../../storages/usePost.js";

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
    if (isUploading) return; // Nếu đang upload thì thôi
    if (uploadQueue.length === 0) return; // Hết hàng đợi thì thôi

    isUploading = true;

    try {
      // Lấy phần tử đầu tiên trong hàng đợi
      const { selectedFile, previewType, postOverlay } = uploadQueue[0];

      // Tạo payload upload
      const payload = await utils.createRequestPayloadV3(
        selectedFile,
        previewType,
        postOverlay
      );

      // Lưu payload vào localStorage (tuỳ bạn dùng hoặc không)
      const savedPayloads = JSON.parse(
        localStorage.getItem("uploadPayloads") || "[]"
      );
      savedPayloads.push(payload);
      // localStorage.setItem("uploadPayloads", JSON.stringify(savedPayloads));

      // Gọi API upload
      const response = await lockerService.uploadMediaV2(payload);

      // Lấy dữ liệu cũ
      const savedResponses = JSON.parse(localStorage.getItem("uploadedMoments") || "[]");
      
      // Chuẩn hoá data mới (response.data là 1 object, normalizeMoments nhận mảng, nên bọc vào mảng)
      const normalizedNewData = utils.normalizeMoments([response?.data]);
      
      // Ghép dữ liệu cũ với dữ liệu mới đã chuẩn hoá
      const updatedData = [...savedResponses, ...normalizedNewData];
      
      // Lưu vào localStorage
      localStorage.setItem("uploadedMoments", JSON.stringify(updatedData));
      
      // Cập nhật state với dữ liệu đã chuẩn hoá
      setRecentPosts(updatedData);
      

      // Hiển thị thông báo thành công
      showSuccess(
        `${previewType === "video" ? "Video" : "Hình ảnh"} đã được tải lên!`
      );

      // Sau khi upload thành công, xóa phần tử đầu tiên khỏi hàng đợi
      uploadQueue.shift();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Lỗi không xác định";
      showError(`Lỗi khi tải lên: ${errorMessage}`);
      console.error("Lỗi khi gửi bài:", error);

      // Có thể quyết định xóa phần tử lỗi khỏi hàng đợi hoặc không,
      // nếu muốn bỏ qua lỗi, uncomment dòng dưới:
      // uploadQueue.shift();
    } finally {
      isUploading = false;
      // Gọi lại để tiếp tục xử lý phần tử tiếp theo (nếu còn)
      handleQueueUpload();
    }
  };

  // Hàm submit: đẩy dữ liệu vào hàng đợi và gọi xử lý
  const handleSubmit = async () => {
    if (!selectedFile) {
      showError("Không có dữ liệu để tải lên.");
      return;
    }

    const { type: previewType } = preview || {};
    const isImage = previewType === "image";
    const isVideo = previewType === "video";
    const maxFileSize = isImage ? 1 : 10; // MB

    if (isSizeMedia > maxFileSize) {
      showError(
        `${
          isImage ? "Ảnh" : "Video"
        } vượt quá giới hạn dung lượng. Tối đa ${maxFileSize}MB.`
      );
      return;
    }
    // Đẩy vào hàng đợi
    uploadQueue.push({ selectedFile, previewType, postOverlay });
    setSendLoading(true);
    showInfo("Gửi bài viết vào hàng chờ thành công, vui lòng đợi!");

    // Gọi hàm xử lý hàng đợi (nếu chưa đang chạy)
    handleQueueUpload();

    // Reset UI hoặc xoá dữ liệu
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
      </div>
    </>
  );
};
export default MediaControls;
