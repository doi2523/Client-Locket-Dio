import { X, Send, Sparkles } from "lucide-react";
import * as utils from "../../../../../utils";
import * as lockerService from "../../../../../services/locketService";
import LoadingRing from "../../../../../components/UI/Loading/ring.jsx";
import { useApp } from "../../../../../context/AppContext.jsx";
import { useCallback } from "react";
import { showToast } from "../../../../../components/Toast/index.jsx";

const MediaControls = () => {
  const { navigation, post, useloading } = useApp();
  const { setIsFilterOpen } = navigation;
  const { sendLoading, setSendLoading } = useloading;
  const { 
    preview, setPreview, 
    caption, setCaption, 
    selectedFile, setSelectedFile, 
    selectedColors, setSelectedColors,
    isSizeMedia,setSizeMedia, } = post;

  const handleDelete = useCallback(() => {
    setSelectedFile(null);
    setCaption("");
    setPreview(null);
    setSelectedFile(null);
    setSelectedColors({ top: "#00FA9A", bottom: "#1E90FF", text: "#FFFFFF" });
    // Thực hiện các thao tác cần thiết khác, ví dụ:
    // setCapturedMedia(null);
    // setCameraActive(true);
    // setIsHolding(false);
    // Các thao tác khác liên quan đến stream có thể để lại nếu cần
  }, [setSelectedFile, setCaption]);

  const handleSubmit = async () => {
    if (!selectedFile) {
      showToast("error", "Không có dữ liệu để tải lên.");
      return;
    }

    try {
      setSendLoading(true);
      showToast("info", `Đang chuẩn bị ${preview.type === "video" ? "video" : "ảnh"} !`);
      //Gọi hàm upload ảnh/video lên Cloud và nhận về thông tin File
      const fileData = await utils.uploadToCloudinary(selectedFile,preview.type);

      //Gửi thông tin File để chuẩn hoá
      const mediaInfo = utils.prepareMediaInfo(fileData);

      //Tạo payload để gửi cho server với thông tin file
      const payload = utils.createRequestPayload( mediaInfo,caption,selectedColors);
      
      //Gửi payload cho server
      showToast("info", `Đang tạo bài viết !`);
      await lockerService.uploadMediaV2(payload);

      showToast("success",`${fileData.type === "video" ? "Video" : "Hình ảnh"} đã được tải lên!`);

      // Reset state
      setPreview(null);
      setSelectedFile(null);
      setCaption("");
      setSelectedColors({
        top: "#00FA9A",
        bottom: "#1E90FF",
        text: "#FFFFFF",
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || "Lỗi không xác định";

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