import { useEffect, useState } from "react";
import { Check, RotateCcw, TriangleAlert, X } from "lucide-react";
import LoadingOverlay from "@/components/ui/Loading/LineSpinner";
import { useSelectedStore, useUploadQueueStore } from "@/stores";
import { SonnerWarning } from "@/components/ui/SonnerToast";
import { OverlayRenderer } from "@/components/Overlay";

const QueueViewer = () => {
  const retryUploadItem = useUploadQueueStore((s) => s.retryUploadItem);

  const selectedQueue = useSelectedStore((s) => s.selectedQueue);
  const setSelectedQueue = useSelectedStore((s) => s.setSelectedQueue);

  const selectedQueueId = useSelectedStore((s) => s.selectedQueueId);
  const setSelectedQueueId = useSelectedStore((s) => s.setSelectedQueueId);

  const queueInfo = useUploadQueueStore((s) =>
    s.uploadItems.find((i) => i.id === selectedQueueId),
  );

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [mediaFailed, setMediaFailed] = useState(false);
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
    if (mediaFailed) {
      SonnerWarning("Ảnh/Video này không tồn tại.");
      return;
    }
    if (!queueInfo?.id) return;

    try {
      retryUploadItem(queueInfo.id);
      handleClose();
    } catch (err) {
      console.error("❌ Retry failed:", err);
    }
  };

  if (!queueInfo && !isAnimating) return null;

  const mediaType = queueInfo?.mediaInfo?.type;
  const mediaUrl =
    queueInfo?.mediaInfo?.publicUrl ||
    queueInfo?.mediaInfo?.publicURL ||
    queueInfo?.mediaInfo?.url;

  const optionsData = queueInfo?.optionsData || {};

  const caption = queueInfo?.optionsData?.text || queueInfo?.text || "";

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between items-center transition-all duration-300 ease-in-out bg-base-100 ${
        isVisible && !isAnimating
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
      tabIndex={0}
    >
      <div className="flex-1 flex flex-col justify-center items-center w-full gap-2 pb-25">
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
          <div className="h-full w-full flex items-center justify-center relative">
            {mediaFailed ? (
              <div className="h-full w-full rounded-2xl flex flex-col bg-base-200 select-none p-10">
                <span className="text-7xl tracking-tight font-semibold">
                  {":("}
                </span>

                <p className="mt-3 text-sm font-medium">Media not found</p>

                {mediaUrl && (
                  <p className="mt-1 text-center text-[10px] break-all font-mono">
                    {mediaUrl}
                  </p>
                )}
              </div>
            ) : mediaType === "video" ? (
              <video
                src={mediaUrl}
                className="max-h-full max-w-full object-contain rounded-2xl"
                autoPlay
                muted
                loop
                playsInline
                onError={() => setMediaFailed(true)}
              />
            ) : (
              <img
                src={mediaUrl}
                alt={caption}
                className="max-h-full max-w-full object-contain rounded-2xl"
                onError={() => setMediaFailed(true)}
              />
            )}

            {/* Status Icon */}
            {queueInfo?.status && (
              <>
                <div className="absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  {queueInfo?.status === "uploading" && (
                    <LoadingOverlay color="white" />
                  )}
                  {queueInfo?.status === "done" && (
                    <Check className="text-green-400 w-6 h-6 animate-bounce" />
                  )}
                  {queueInfo?.status === "failed" && (
                    <div className="flex flex-col items-center justify-center text-error">
                      <TriangleAlert
                        strokeWidth={1.5}
                        className="w-16 h-16 transition-transform duration-700"
                      />

                      {queueInfo?.errorMessage && (
                        <div className="mt-3 w-full bg-base-300/70 backdrop-blur-md p-4 shadow-lg">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <span className="badge badge-error badge-sm shrink-0">
                                CODE
                              </span>

                              <p className="font-mono font-semibold break-all text-base-content">
                                {queueInfo?.errorCode || "UNKNOWN_ERROR"}
                              </p>
                            </div>

                            <div className="flex items-start gap-2">
                              <span className="badge badge-warning badge-sm shrink-0">
                                MSG
                              </span>

                              <p className="font-mono break-words text-base-content/80">
                                {queueInfo?.errorMessage}
                              </p>
                            </div>

                            {!!queueInfo?.retryCount && (
                              <div className="flex items-center gap-2 pt-1">
                                <span className="badge badge-ghost badge-sm shrink-0">
                                  RETRY
                                </span>

                                <p className="font-mono text-base-content/60">
                                  #{queueInfo.retryCount}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Caption nếu có */}
            {optionsData && (
              <OverlayRenderer overlayData={optionsData} />
            )}
          </div>
        </div>
        <div className="flex justify-center z-30">
          <button
            onClick={handleRetry}
            className="flex items-center gap-1 px-6 py-3 rounded-2xl font-semibold text-error"
          >
            <RotateCcw strokeWidth={2} className="w-10 h-10" />
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueueViewer;
