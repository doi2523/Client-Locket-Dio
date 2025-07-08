import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import {
  MessageCircle,
  Trash2,
  LayoutGrid,
  RotateCcw,
  Check,
} from "lucide-react";
import { useApp } from "../../../context/AppContext";
import { MdSlowMotionVideo } from "react-icons/md";
import { showInfo, showSuccess, showError } from "../../../components/Toast";
import BadgePlan from "./Badge";
import LoadingRing from "../../../components/UI/Loading/ring";
import UploadingQueue from "../../../components/UI/Moments/UploadingQueue";
import RecentPostGrid from "../../../components/UI/Moments/RecentPostGrid";
import LoadingOverlay from "../../../components/UI/Loading/LineSpinner";
import { PostMoments } from "../../../services";
import * as utils from "../../../utils";

const BottomHomeScreen = () => {
  const { user } = useContext(AuthContext);
  const { navigation, post } = useApp();
  const { isBottomOpen, setIsBottomOpen } = navigation;
  const { recentPosts, setRecentPosts, uploadPayloads, setuploadPayloads } =
    post;

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedAnimate, setSelectedAnimate] = useState(false);
  const [imageInfo, setImageInfo] = useState(null);
  const [overlaysInfo, setOverlaysInfo] = useState(null);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isClosing, setIsClosing] = useState(false);
  const [loadedItems, setLoadedItems] = useState([]);
  const [selectItems, setselectItems] = useState(null);
  const [retryingIndex, setRetryingIndex] = useState(null);

  useEffect(() => {
    if (isBottomOpen) {
      const localData = JSON.parse(
        localStorage.getItem("uploadedMoments") || "[]"
      ).reverse();
      setRecentPosts(localData);
      setVisibleCount(6);
    }
  }, [isBottomOpen, setRecentPosts]);

  const handleClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsBottomOpen(false);
      setVisibleCount(6);
      setIsClosing(false);
      setSelectedImage(null);
      setSelectedVideo(null);
      setImageInfo(null);
      setSelectedAnimate(false);
    }, 0);
  };

  const handleOpenMedia = (item) => {
    setSelectedAnimate(true);
    if (item.video_url || item.mediaInfo?.type === "video") {
      setSelectedVideo(item.video_url || item.mediaInfo?.url);
      setSelectedImage(null);
    } else {
      setSelectedImage(
        item.image_url || item.thumbnail_url || item.mediaInfo?.url
      );
      setSelectedVideo(null);
    }
    setImageInfo(item);
    setOverlaysInfo(item.options);
  };

  const handleCloseMedia = () => {
    setSelectedAnimate(false);
    setTimeout(() => {
      setSelectedImage(null);
      setSelectedVideo(null);
      setImageInfo(null);
    }, 500);
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  const displayedPosts = recentPosts.slice(0, visibleCount);
  const hasMore = recentPosts.length > visibleCount;

  const handleLoaded = (id) => {
    setLoadedItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleDeleteImage = (id) => {
    if (!id) return;
    console.log(id);

    // 1. Xoá khỏi uploadPayloads
    const updatedPayloads = uploadPayloads.filter((item) => item.id !== id);
    setuploadPayloads(updatedPayloads);

    // 2. Xoá khỏi recentPosts
    const updatedRecent = recentPosts.filter((item) => item.id !== id);
    setRecentPosts(updatedRecent);

    // 3. Cập nhật localStorage
    localStorage.setItem(
      "uploadedMoments",
      JSON.stringify([...updatedRecent].reverse())
    );
    localStorage.setItem("uploadPayloads", JSON.stringify(updatedPayloads));

    // 4. Đóng preview nếu đang xem ảnh đó
    if (imageInfo?.id === id) {
      handleCloseMedia();
    }

    showSuccess("Đã xoá thành công!");
  };

  const handleRetry = async () => {
    if (selectItems == null) return;

    const index = Number(selectItems);
    let payloads = JSON.parse(localStorage.getItem("uploadPayloads") || "[]");
    const retryPayload = payloads[index];

    if (!retryPayload) return;

    try {
      setRetryingIndex(index);

      // Cập nhật trạng thái về 'uploading'
      payloads[index] = {
        ...retryPayload,
        status: "uploading",
        errorMessage: null, // Xóa thông báo lỗi cũ
      };

      // Cập nhật state và localStorage
      setuploadPayloads([...payloads]);
      setImageInfo(payloads[index]);

      localStorage.setItem("uploadPayloads", JSON.stringify(payloads));

      showInfo("Đang gửi lại...");

      // Gọi API upload
      const response = await PostMoments(retryPayload);

      if (response?.data) {
        // Cập nhật trạng thái thành công
        payloads[index] = {
          ...payloads[index],
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
        setRecentPosts(updatedData.reverse()); // Reverse để hiển thị mới nhất trước

        showSuccess(
          `${
            retryPayload.contentType === "video" ? "Video" : "Hình ảnh"
          } đã được tải lên thành công!`
        );

        // Tự động đóng modal sau khi upload thành công
        setTimeout(() => {
          handleCloseMedia();
        }, 1500);
      }
    } catch (error) {
      console.error("❌ Upload thất bại:", error);

      const errorMessage =
        error?.response?.data?.message || error.message || "Lỗi không xác định";

      // Cập nhật thông tin lỗi
      payloads[index] = {
        ...payloads[index],
        status: "error",
        errorMessage: errorMessage,
        retryCount: (payloads[index].retryCount || 0) + 1,
        lastTried: new Date().toISOString(),
      };

      setuploadPayloads([...payloads]);
      setImageInfo(payloads[index]);
      localStorage.setItem("uploadPayloads", JSON.stringify(payloads));

      showError(`Upload thất bại: ${errorMessage}`);
    } finally {
      setRetryingIndex(null);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col transition-all duration-500 z-50 bg-base-100 ${
        isBottomOpen
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col shadow-lg px-4 py-2 text-base-content relative overflow-hidden">
        <div className="flex items-center justify-between">
          <BadgePlan />
          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 bg-base-200 relative">
              <MessageCircle size={30} />
            </button>
          </div>
        </div>
      </div>

      {/* Lưới media thumbnail */}
      <div
        className={`flex-1 overflow-y-auto p-2 transition-all duration-300 ${
          selectedAnimate ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <UploadingQueue
          payloads={uploadPayloads}
          setuploadPayloads={setuploadPayloads}
          handleOpenMedia={handleOpenMedia}
          handleLoaded={handleLoaded}
          setselectItems={setselectItems}
        />
        <RecentPostGrid
          recentPosts={recentPosts}
          displayedPosts={displayedPosts}
          loadedItems={loadedItems}
          handleOpenMedia={handleOpenMedia}
          handleLoaded={handleLoaded}
          handleShowMore={handleShowMore}
          hasMore={hasMore}
          visibleCount={visibleCount}
        />
      </div>

      {/* Modal media lớn + caption */}
      <div
        className={`absolute inset-0 flex justify-center drop-shadow-2xl backdrop-blur-[2px] bg-base-100/20 items-center transition-all mx-0 duration-500 ${
          selectedAnimate ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCloseMedia}
      >
        <div
          className="relative max-w-md w-full aspect-square bg-base-200 rounded-[64px] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {isMediaLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-200 z-10">
              <LoadingRing color="black" />
            </div>
          )}
          {selectedVideo ? (
            <video
              src={selectedVideo}
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setIsMediaLoading(false)}
              className={`object-cover w-full h-full transition-opacity duration-300 rounded-[64px] ${
                isMediaLoading ? "opacity-0" : "opacity-100"
              }`}
            />
          ) : (
            selectedImage && (
              <img
                src={selectedImage}
                alt="Selected"
                onLoad={() => setIsMediaLoading(false)}
                className={`object-cover w-full h-full transition-opacity duration-300 rounded-[64px] ${
                  isMediaLoading ? "opacity-0" : "opacity-100"
                }`}
              />
            )
          )}

          {/* Status Icon */}
          {imageInfo?.status && (
            <>
              <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40 flex items-center justify-center z-10"></div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                {imageInfo?.status === "uploading" && (
                  <LoadingOverlay color="white" />
                )}
                {imageInfo?.status === "done" && (
                  <Check className="text-green-400 w-6 h-6 animate-bounce" />
                )}
                {imageInfo?.status === "error" && (
                  <div
                    className="flex flex-col items-center justify-center text-error cursor-pointer"
                    onClick={handleRetry}
                  >
                    <RotateCcw
                      strokeWidth={1.5}
                      className="w-16 h-16 transition-transform duration-700"
                    />

                    {imageInfo?.errorMessage && (
                      <p className="text-xs text-center mt-2 text-white bg-black/50 px-2 py-1 rounded">
                        {imageInfo.errorMessage} - Lần thử lại: {imageInfo?.retryCount}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Caption overlay */}
          {imageInfo && imageInfo.captions && imageInfo.captions.length > 0 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 max-w-[90%] z-10">
              <div
                className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-2xl font-semibold backdrop-blur-lg ${
                  !imageInfo.captions[0].background?.colors.length
                    ? "bg-black/30 text-white"
                    : ""
                }`}
                style={{
                  background: imageInfo.captions[0].background?.colors.length
                    ? `linear-gradient(to bottom, ${
                        imageInfo.captions[0].background.colors[0] ||
                        "transparent"
                      }, ${
                        imageInfo.captions[0].background.colors[1] ||
                        "transparent"
                      })`
                    : undefined,
                  color:
                    imageInfo.captions[0].text_color ||
                    (!imageInfo.captions[0].background?.colors.length
                      ? "white"
                      : ""),
                }}
              >
                {imageInfo.captions[0].icon?.type === "image" ? (
                  <span className="text-sm flex flex-row items-center text-center">
                    <img
                      src={imageInfo.captions[0].icon.data}
                      alt=""
                      className="w-4 h-4 mr-2"
                    />
                    {imageInfo.captions[0].text || "Caption"}
                  </span>
                ) : (
                  <span className="text-sm text-center">
                    {(imageInfo.captions[0].icon?.data || "") + " "}
                    {imageInfo.captions[0].text || ""}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="absolute w-full bottom-2 flex flex-col px-5 py-2 text-base-content">
        <div className="flex items-center justify-between">
          {/* Close button */}
          <button
            className="p-2 text-base-content tooltip tooltip-right cursor-pointer hover:bg-base-200/50 rounded-full transition-colors"
            onClick={handleCloseMedia}
            data-tip="Bấm để xem danh sách lưới"
          >
            <LayoutGrid size={28} />
          </button>

          {/* Home button */}
          <div className="scale-75">
            <button
              onClick={handleClick}
              className="relative flex items-center justify-center w-20 h-20"
            >
              <div className="absolute w-20 h-20 border-4 border-base-content/30 rounded-full z-10"></div>
              <div className="absolute rounded-full w-16 h-16 bg-base-content z-0 hover:scale-105 transition-transform"></div>
            </button>
          </div>

          {/* Delete button */}
          <button
            className="p-2 text-base-content tooltip-left tooltip cursor-pointer hover:bg-base-200/50 rounded-full transition-colors"
            onClick={() => {
              if (imageInfo && imageInfo.id) {
                handleDeleteImage(imageInfo.id || "");
              } else {
                console.log("Selected item:", selectItems);

                const indexToDelete = Number(selectItems);
                let queuePayloads = JSON.parse(
                  localStorage.getItem("uploadPayloads") || "[]"
                );

                // Xoá phần tử tại index
                queuePayloads.splice(indexToDelete, 1);

                // Lưu lại localStorage
                localStorage.setItem(
                  "uploadPayloads",
                  JSON.stringify(queuePayloads)
                );

                // Cập nhật state
                setuploadPayloads(queuePayloads);

                if (Number(selectItems) === indexToDelete) {
                  handleCloseMedia();
                }

                showSuccess("Đã xoá thành công!");
              }
            }}
            data-tip="Bấm để xoá ảnh"
          >
            <Trash2 size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomHomeScreen;
