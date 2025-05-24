import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { MessageCircle, Trash2, LayoutGrid } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import { showSuccess } from "../../../components/Toast";

const BottomHomeScreen = () => {
  const { user } = useContext(AuthContext);
  const { navigation, post } = useApp();
  const { isBottomOpen, setIsBottomOpen } = navigation;
  const { recentPosts, setRecentPosts } = post;

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedAnimate, setSelectedAnimate] = useState(false);
  const [imageInfo, setImageInfo] = useState(null);

  useEffect(() => {
    if (isBottomOpen) {
      const localData = JSON.parse(
        localStorage.getItem("uploadedMoments") || "[]"
      ).reverse();
      setRecentPosts(localData);
    }
  }, [isBottomOpen, setRecentPosts]);

  const handleClick = () => setIsBottomOpen(false);

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

  // const handleDeleteImage = (id) => {
  //   const updated = recentPosts.filter((p) => p.id !== id);
  //   setRecentPosts(updated);
  //   localStorage.setItem("uploadedMoments", JSON.stringify(updated));
  //   showSuccess("Xóa ảnh thành công!");
  //   handleCloseMedia();
  // };

    const handleDeleteImage = (id) => {
      alert("Đang phát triển..")
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col transition-all duration-500 z-50 bg-base-100 ${
        isBottomOpen
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-full opacity-0 scale-0"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col shadow-lg px-4 py-2 text-base-content relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="font-lovehouse text-2xl font-semibold px-3 pt-1 border-base-content border rounded-xl">
            Locket Dio
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 bg-base-200 relative">
              <MessageCircle size={30} />
            </button>
          </div>
        </div>
      </div>

      {/* Lưới media thumbnail */}
      <div
        className={`flex flex-wrap overflow-y-auto p-2 transition-all duration-0 ${
          selectedAnimate ? "opacity-0 scale-0" : "opacity-100 scale-100"
        }`}
      >
        {recentPosts.length === 0 ? (
          <div className="w-full h-full text-center text-lg text-base-content font-semibold">
            Không có gì ở đây :(
          </div>
        ) : (
          recentPosts.map((item) => (
            <div
              key={item.id}
              className="w-1/3 md:w-1/6 aspect-square overflow-hidden p-1 cursor-pointer"
              onClick={() => handleOpenMedia(item)}
            >
              {item.video_url ? (
                <video
                  src={item.video_url}
                  className={`object-cover w-full h-full rounded-3xl transition-all duration-300 transform ${
                    selectedVideo === item.video_url ? "scale-110" : "scale-95"
                  }`}
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={item.thumbnail_url || item.image_url}
                  alt={item.captions?.[0]?.text || "Image"}
                  className={`object-cover w-full h-full rounded-3xl transition-all duration-300 transform ${
                    selectedImage === (item.image_url || item.thumbnail_url)
                      ? "scale-110"
                      : "scale-95"
                  }`}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal media lớn + caption */}
      <div
        className={`absolute inset-0 flex justify-center items-center transition-all duration-500 ${
          selectedAnimate ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        <div className="relative max-w-md aspect-square">
          {selectedVideo ? (
            <video
              src={selectedVideo}
              // controls
              autoPlay
              className="object-contain border-0 rounded-[65px]"
            />
          ) : (
            selectedImage && (
              <img
                src={selectedImage}
                alt="Selected"
                className="object-contain border-0 rounded-[65px]"
              />
            )
          )}
          {imageInfo && imageInfo.captions && imageInfo.captions.length > 0 && (
            <div className="mt-4 absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
              <div
                className={`flex flex-col whitespace-nowrap drop-shadow-lg items-center space-y-1 py-2 px-4 h-auto w-auto rounded-3xl font-semibold justify-center ${
                  !imageInfo.captions[0].background?.colors.length
                    ? "bg-black/70 text-white backdrop-blur-3xl"
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
                  <span className="text-base flex flex-row items-center">
                    <img
                      src={imageInfo.captions[0].icon.data}
                      alt=""
                      className="w-5 h-5 mr-2"
                    />
                    {imageInfo.captions[0].text || "Caption"}
                  </span>
                ) : (
                  <span className="text-base">
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
      <div className="flex flex-col shadow-lg px-4 py-2 text-base-content overflow-hidden bottom-0 fixed w-full">
        <div className="flex items-center justify-between">
          {/* Close button */}
          <button
            className="p-1 text-base-content tooltip tooltip-right cursor-pointer"
            onClick={handleCloseMedia}
            data-tip="Bấm để xem danh sách lưới"
          >
            <LayoutGrid size={30} />
          </button>
          <div className="scale-75">
            <button
              onClick={handleClick}
              className="relative flex items-center justify-center w-22 h-22"
            >
              <div className="absolute w-22 h-22 border-4 border-base-content/50 rounded-full z-10"></div>
              <div className="absolute rounded-full btn w-18 h-18 outline-accent bg-base-content z-0"></div>
            </button>
          </div>
          {/* Delete button */}
          <button
            className="p-1 text-base-content tooltip-left tooltip cursor-pointer"
            onClick={() => {
              if (imageInfo && imageInfo.id) {
                handleDeleteImage(imageInfo.id);
              } else {
                alert("Vui lòng chọn ảnh trước khi xóa!");
              }
            }}
            data-tip="Bấm để xoá ảnh"
          >
            <Trash2 size={30} />
          </button>
        </div>
      </div>

      <div className="absolute bottom-30 z-10 px-4 text-sm text-center">
        Các hình ảnh ở đây là những hình ảnh đăng tải xoá ở đây nhưng trên
        Locket sẽ không bị xoá
      </div>
    </div>
  );
};

export default BottomHomeScreen;
