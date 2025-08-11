import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { Check, RotateCcw, X } from "lucide-react";
import * as utils from "@/utils";
import LoadingOverlay from "@/components/ui/Loading/LineSpinner";
import { showError, showInfo, showSuccess } from "@/components/Toast";
import { PostMoments } from "@/services";
import BottomMenu from "../Layout/BottomMenu";

const QueueViewer = () => {
  const { post } = useApp();
  const {
    uploadPayloads,
    selectedQueue,
    setSelectedQueue,
    setuploadPayloads,
    setRecentPosts,
  } = post;
  const [queueInfo, setQueueInfo] = useState(uploadPayloads[selectedQueue]);

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [retryingIndex, setRetryingIndex] = useState(null);

  // Mở hiệu ứng khi có selectedQueue
  useEffect(() => {
    if (selectedQueue !== null) {
      setIsVisible(true);
      setIsMediaLoading(true); // reset loading khi chuyển queue
    }
  }, [selectedQueue]);

  const handleClose = () => {
    setIsAnimating(true);
    setIsVisible(false);
    setTimeout(() => {
      setSelectedQueue(null);
      setIsAnimating(false);
    }, 300);
  };

  // Khóa cuộn khi mở modal
  useEffect(() => {
    const shouldLock = selectedQueue !== null || isAnimating;
    if (shouldLock) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [selectedQueue, isAnimating]);

  const handleRetry = async () => {
    let payloads = JSON.parse(localStorage.getItem("uploadPayloads") || "[]");
    const retryPayload = payloads[selectedQueue];

    if (!retryPayload) return;

    try {
      setRetryingIndex(selectedQueue);

      // ✅ Cập nhật state: chuyển sang "uploading" ngay lập tức
      const updatedPayload = {
        ...retryPayload,
        status: "uploading",
        errorMessage: null,
        retryCount: (retryPayload.retryCount || 0) + 1,
        lastTried: new Date().toISOString(),
      };
      payloads[selectedQueue] = updatedPayload;

      setuploadPayloads([...payloads]);
      setQueueInfo(updatedPayload);
      localStorage.setItem("uploadPayloads", JSON.stringify(payloads));

      showInfo("Đang gửi lại...");

      // Gọi API upload
      const response = await PostMoments(retryPayload);

      if (response?.data) {
        payloads[selectedQueue] = {
          ...payloads[selectedQueue],
          status: "done",
        };
        setuploadPayloads([...payloads]);
        localStorage.setItem("uploadPayloads", JSON.stringify(payloads));

        // Lưu vào uploadedMoments
        const savedResponses = JSON.parse(
          localStorage.getItem("uploadedMoments") || "[]"
        );
        const normalizedNewData = utils.normalizeMoments([response.data]);
        const updatedData = [...savedResponses, ...normalizedNewData];

        localStorage.setItem("uploadedMoments", JSON.stringify(updatedData));
        setRecentPosts(updatedData.reverse());

        showSuccess(
          `${
            retryPayload.contentType === "video" ? "Video" : "Hình ảnh"
          } đã được tải lên thành công!`
        );

        handleClose(); // đóng modal sau khi thành công
      }
    } catch (error) {
      console.error("❌ Upload thất bại:", error);

      const errorCode = error?.response?.status;
      const errorMessage =
        error?.response?.data?.message || error.message || "Lỗi không xác định";

      if (errorCode === 409) {
        // Xoá phần tử bị lỗi 409
        payloads.splice(selectedQueue, 1);

        setuploadPayloads([...payloads]);
        localStorage.setItem("uploadPayloads", JSON.stringify(payloads));
        handleClose(); // Đóng modal nếu cần
      } else {
        // Các lỗi khác
        payloads[selectedQueue] = {
          ...payloads[selectedQueue],
          status: "error",
          errorMessage: errorMessage,
          retryCount: (payloads[selectedQueue].retryCount || 0) + 1,
          lastTried: new Date().toISOString(),
        };

        setuploadPayloads([...payloads]);
        setQueueInfo(payloads[selectedQueue]);
        localStorage.setItem("uploadPayloads", JSON.stringify(payloads));

        showError(`Upload thất bại: ${errorMessage}`);
      }
    } finally {
      setRetryingIndex(null);
    }
  };

  if (!queueInfo && !isAnimating) return null;

  const mediaType = queueInfo?.mediaInfo?.type;
  const mediaUrl = queueInfo?.mediaInfo?.url;
  const caption = queueInfo?.caption || "";
  const icon = queueInfo?.options?.icon || "";
  const colorTop = queueInfo?.options?.color_top || "#00000088";
  const colorBottom = queueInfo?.options?.color_bottom || "#000000cc";
  const textColor = queueInfo?.options?.text_color || "#ffffff";

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between items-center transition-all duration-300 ease-in-out bg-base-100 ${
        isVisible && !isAnimating
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
      // onClick={handleClose}
      tabIndex={0}
    >
      <div className="flex-1 flex flex-col justify-center items-center w-full gap-2">
        <div
          className={`relative w-full max-w-md aspect-square bg-base-200 rounded-[64px] overflow-hidden transition-all duration-300 ease-in-out ${
            isVisible && !isAnimating
              ? "opacity-100 scale-100"
              : "opacity-0 scale-90 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút đóng */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/40 rounded-full hover:bg-black/60"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Nội dung media */}
          <div className="h-full w-full flex items-center justify-center relative bg-gradient-to-br from-base-300/20 to-base-100/20">
            {mediaType === "video" ? (
              <video
                src={mediaUrl}
                className="max-h-full max-w-full object-contain rounded-2xl"
                autoPlay
                muted
                loop
                playsInline
                //   onLoadedData={() => setIsMediaLoading(false)}
              />
            ) : (
              <img
                src={mediaUrl}
                alt={caption}
                className="max-h-full max-w-full object-contain rounded-2xl"
                //   onLoad={() => setIsMediaLoading(false)}
              />
            )}
            {/* Status Icon */}
            {queueInfo?.status && (
              <>
                <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40 flex items-center justify-center z-10"></div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  {queueInfo?.status === "uploading" && (
                    <LoadingOverlay color="white" />
                  )}
                  {queueInfo?.status === "done" && (
                    <Check className="text-green-400 w-6 h-6 animate-bounce" />
                  )}
                  {queueInfo?.status === "error" && (
                    <div
                      className="flex flex-col items-center justify-center text-error cursor-pointer"
                      onClick={handleRetry}
                    >
                      <RotateCcw
                        strokeWidth={1.5}
                        className="w-16 h-16 transition-transform duration-700"
                      />

                      {queueInfo?.errorMessage && (
                        <p className="text-xs text-center mt-2 text-white bg-black/50 px-2 py-1 rounded">
                          {queueInfo.errorMessage} - Lần thử lại:{" "}
                          {queueInfo?.retryCount}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
            {/* Caption nếu có */}
            {caption && (
              <div
                className="absolute bottom-4 w-fit backdrop-blur-sm rounded-2xl px-3 py-2"
                style={{
                  background: `linear-gradient(to bottom, ${colorTop}, ${colorBottom})`,
                }}
              >
                <p className="text-sm font-medium" style={{ color: textColor }}>
                  {icon} {caption}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomMenu />
    </div>
  );
};

export default QueueViewer;
