import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { MessageCircle, Trash2, LayoutGrid } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import { MdSlowMotionVideo } from "react-icons/md";
import { showSuccess } from "../../../components/Toast";
import BadgePlan from "./Badge";
import LoadingRing from "../../../components/UI/Loading/ring";

const BottomHomeScreen = () => {
  const { user } = useContext(AuthContext);
  const { navigation, post } = useApp();
  const { isBottomOpen, setIsBottomOpen } = navigation;
  const { recentPosts, setRecentPosts } = post;

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedAnimate, setSelectedAnimate] = useState(false);
  const [imageInfo, setImageInfo] = useState(null);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6); // Thay đổi từ showAll thành visibleCount
  const [isClosing, setIsClosing] = useState(false); // Thêm state để xử lý hiệu ứng đóng

  useEffect(() => {
    if (isBottomOpen) {
      const localData = JSON.parse(
        localStorage.getItem("uploadedMoments") || "[]"
      ).reverse();
      setRecentPosts(localData);
      setVisibleCount(6); // Reset về 6 khi mở
    }
  }, [isBottomOpen, setRecentPosts]);

  const handleClick = () => {
    setIsClosing(true); // Bắt đầu hiệu ứng đóng
    setTimeout(() => {
      setIsBottomOpen(false);
      setVisibleCount(6); // Reset về trạng thái ban đầu khi đóng
      setIsClosing(false);
      setSelectedImage(null);
      setSelectedVideo(null);
      setImageInfo(null);
      setSelectedAnimate(false);
    }, 0); // Thời gian khớp với animation
  };

  // Mở modal ảnh hoặc video lớn, truyền object dữ liệu chuẩn hoá
  const handleOpenMedia = (item) => {
    setSelectedAnimate(true);
    if (item.video_url) {
      setSelectedVideo(item.video_url);
      setSelectedImage(null);
    } else {
      setSelectedImage(item.image_url || item.thumbnail_url);
      setSelectedVideo(null);
    }
    setImageInfo(item);
  };

  const handleCloseMedia = () => {
    setSelectedAnimate(false);
    setTimeout(() => {
      setSelectedImage(null);
      setSelectedVideo(null);
      setImageInfo(null);
    }, 500);
  };
  // Xử lý hiển thị thêm 6 item
  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  // Lấy danh sách items để hiển thị
  const displayedPosts = recentPosts.slice(0, visibleCount);
  const hasMore = recentPosts.length > visibleCount;

  // Không render component nếu không mở
  // if (!isBottomOpen) {
  //   return null;
  // }

  const [loadedItems, setLoadedItems] = useState([]);

  const handleLoaded = (id) => {
    setLoadedItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleDeleteImage = (id) => {
    alert("Đang phát triển..");
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

      {/* Lưới media thumbnail - 3 ảnh 1 hàng trên mobile */}
      <div
        className={`flex-1 overflow-y-auto p-2 transition-all duration-300 ${
          selectedAnimate ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {recentPosts.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-lg text-base-content font-semibold">
            Không có gì ở đây :(
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
            {displayedPosts.map((item) => {
              const isLoaded = loadedItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="aspect-square overflow-hidden cursor-pointer bg-base-200 rounded-2xl relative group"
                  onClick={() => handleOpenMedia(item)}
                >
                  {!isLoaded && (
                    <div className="absolute inset-0 skeleton w-full h-full rounded-2xl z-10" />
                  )}

                  {item.video_url ? (
                    <>
                      <img
                        src={item.thumbnail_url}
                        className={`object-cover w-full h-full rounded-2xl transition-all duration-300 ${
                          isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => handleLoaded(item.id)}
                      />

                      <div className="absolute top-2 right-2 bg-primary/30 rounded-full p-1 z-20">
                        <MdSlowMotionVideo className="text-white" />
                      </div>
                    </>
                  ) : (
                    <img
                      src={item.thumbnail_url || item.image_url}
                      alt={item.captions?.[0]?.text || "Image"}
                      className={`object-cover w-full h-full rounded-2xl transition-all duration-300 ${
                        isLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      loading="lazy"
                      onLoad={() => handleLoaded(item.id)}
                    />
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-2xl z-20"></div>
                </div>
              );
            })}

            {/* Nút xem thêm */}
            {hasMore && (
              <div
                className="aspect-square overflow-hidden cursor-pointer bg-base-300 rounded-2xl relative group flex items-center justify-center border-2 border-dashed border-base-content/30 hover:bg-base-200 transition-colors"
                onClick={handleShowMore}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">+</div>
                  <div className="text-xs text-base-content/70">Xem thêm</div>
                  <div className="text-xs text-base-content/50">
                    ({Math.min(6, recentPosts.length - visibleCount)})
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal media lớn + caption */}
      <div
        className={`absolute inset-0 flex justify-center items-center transition-all duration-500 ${
          selectedAnimate ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCloseMedia}
      >
        <div
          className="relative max-w-sm w-full aspect-square bg-base-200 rounded-[64px] overflow-hidden"
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

          {/* Caption overlay */}
          {imageInfo && imageInfo.captions && imageInfo.captions.length > 0 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 max-w-[90%]">
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

      {/* Bottom Button - Đã bỏ hoàn toàn màu nền */}
      <div className="flex flex-col px-4 py-2 text-base-content overflow-hidden bg-transparent">
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
                handleDeleteImage(imageInfo.id);
              } else {
                alert("Vui lòng chọn ảnh trước khi xóa!");
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
