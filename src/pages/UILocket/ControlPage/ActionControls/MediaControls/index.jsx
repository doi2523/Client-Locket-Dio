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
  const { setPreview, caption, setCaption, selectedFile, setSelectedFile, selectedColors, setSelectedColors } = post;

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

  const createRequestPayload = (mediaInfo, caption, selectedColors) => {
    // Tạo đối tượng token (bao gồm idToken và localId)
    const tokenData = {
      idToken: utils.getAuthCookies().idToken,
      localId: utils.getAuthCookies().localId,
    };
  
    // Tạo đối tượng options (bao gồm các lựa chọn như caption, colors...)
    const optionsData = {
      caption: caption,
      text_color: "#FFFFFF",
      colorTop: selectedColors.top,
      colorBottom: selectedColors.bottom,
    };
  
    // Tạo đối tượng payload chứa tất cả dữ liệu cần gửi
    const payload = {
      userData: tokenData,
      options: optionsData,
      model: "uploadmediaV2",
      mediaInfo: mediaInfo,
    };
  
    return payload;
  };
  
  
  const handleSubmit = async () => {
    if (!selectedFile) {
      console.error("Không có dữ liệu để tải lên.");
      return;
    }
  
    try {
      setSendLoading(true);
  
      // Chuẩn bị object mediaInfo tùy theo loại
      let mediaInfo = {
        type: selectedFile.type,
        url: selectedFile.url,
        public_id: selectedFile.public_id,
        size: selectedFile.size,
      };
  
      if (selectedFile.type === "image") {
        mediaInfo = {
          ...mediaInfo,
          format: selectedFile.format,
          width: selectedFile.width,
          height: selectedFile.height,
        };
      } else if (selectedFile.type === "video") {
        mediaInfo = {
          ...mediaInfo,
          duration: selectedFile.duration,
          thumbnail: selectedFile.thumbnail,
        };
      } else {
        showToast("warning", "File không hợp lệ!");
        setSendLoading(false);
        return;
      }
  
    // Tạo payload từ hàm createRequestPayload
    const payload = createRequestPayload(mediaInfo, caption, selectedColors);
  
      // Gửi lên server
      try {
        await lockerService.uploadMediaV2(payload);
        showToast(
          "success",
          `${selectedFile.type === "video" ? "Video" : "Hình ảnh"} đã được tải lên!`
        );
        setPreview(null);
        setSelectedFile(null);
        setCaption("");
        setSelectedColors({ top: "#00FA9A", bottom: "#1E90FF", text: "#FFFFFF" });
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || error.message || "Lỗi không xác định"; // Kiểm tra lỗi từ server nếu có
        showToast("error", `Lỗi khi tải lên: ${errorMessage}`); // Hiển thị thông báo chi tiết hơn
      }
    } catch (error) {
      console.error("Lỗi khi tải lên:", error);
      showToast("error", "Lỗi hệ thống!");
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