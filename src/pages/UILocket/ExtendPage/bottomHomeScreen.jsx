import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { MessageCircle, X, Trash2, LayoutGrid } from "lucide-react"; // Import icon xóa
import { useApp } from "../../../context/AppContext";
import { showSuccess } from "../../../components/Toast";

const BottomHomeScreen = () => {
  const { user } = useContext(AuthContext);
  const { navigation, useloading, post } = useApp();
  const { isBottomOpen, setIsBottomOpen } = navigation;
  const { setRecentPosts, recentPosts } = post;

  const [payloads, setPayloads] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAnimate, setSelectedAnimate] = useState(false);
  const [imageInfo, setImageInfo] = useState(null); // State để lưu thông tin ảnh

  // Khởi tạo và đồng bộ dữ liệu từ localStorage
  useEffect(() => {
    if (isBottomOpen) {
      const savedPayloads = JSON.parse(
        localStorage.getItem("uploadPayloads") || "[]"
      ).reverse();
      setPayloads(savedPayloads);
      setRecentPosts(savedPayloads); // Cập nhật state từ localStorage
    }
  }, [isBottomOpen, setRecentPosts]);

  const handleClick = () => {
    setIsBottomOpen(false);
  };

  const handleOpenImage = (url, info) => {
    setSelectedAnimate(true);
    setSelectedImage(url);
    setImageInfo(info); // Lưu thông tin ảnh vào state
  };

  const handleCloseImage = () => {
    setSelectedAnimate(false);
    setTimeout(() => {
      setSelectedImage(null); // Reset hình ảnh sau khi hiệu ứng kết thúc
      setImageInfo(null);
    }, 500); // Khớp với duration trong CSS (500ms)
  };
  const handleDeleteImage = (url) => {
    // Tiến hành xóa ảnh nếu url hợp lệ
    const updatedPayloads = payloads.filter(
      (payload) => payload.mediaInfo.url !== url
    );

    // Cập nhật state và localStorage
    setPayloads(updatedPayloads);
    setRecentPosts(updatedPayloads); // Cập nhật state sau khi xóa
    localStorage.setItem("uploadPayloads", JSON.stringify(updatedPayloads)); // Cập nhật lại localStorage

    // Hiển thị alert thành công
    showSuccess("Xóa ảnh thành công!");
    handleCloseImage(); // Đóng modal khi xóa ảnh
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
            Locket Pro
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 bg-base-200 relative">
              <MessageCircle size={30} />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`flex flex-wrap overflow-y-auto p-2 transition-all duration-0 ${
          selectedAnimate ? "opacity-0 scale-0" : "opacity-100 scale-100"
        }`}
      >
        {payloads.length === 0 ? (
          <div className="w-full h-full text-center text-lg text-base-content font-semibold">
            Không có gì ở đây :(
          </div>
        ) : (
          payloads.map((payload, index) => (
            <div
              key={index}
              className="w-1/3 md:w-1/6 aspect-square overflow-hidden p-1 cursor-pointer"
              onClick={() => handleOpenImage(payload.mediaInfo.url, payload)}
            >
              <img
                src={payload.mediaInfo.url}
                alt={payload.options.caption || "Image"}
                className={`object-cover w-full h-full rounded-3xl transition-all duration-300 transform ${
                  selectedImage === payload.mediaInfo.url
                    ? "scale-110"
                    : "scale-95"
                }`}
              />
            </div>
          ))
        )}
      </div>

      {/* Image Modal */}
      <div
        className={`absolute inset-0 flex justify-center items-center transition-all duration-500 ${
          selectedAnimate ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        <div className="relative max-w-md aspect-square">
          <img
            src={selectedImage}
            alt="Selected"
            className="object-contain border-0 rounded-[65px]"
          />
          {imageInfo && (
            <div className="mt-4 absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
              <div
                className={`flex flex-col whitespace-nowrap drop-shadow-lg items-center space-y-1 py-2 px-4 h-auto w-auto rounded-3xl font-semibold justify-center ${
                  !imageInfo.options.colorTop && !imageInfo.options.colorBottom
                    ? "bg-black/70 text-white backdrop-blur-3xl"
                    : ""
                }`}
                style={{
                  background:
                    imageInfo.options.color_top || imageInfo.options.color_bottom
                      ? `linear-gradient(to bottom, ${
                          imageInfo.options.color_top || "transparent"
                        }, ${imageInfo.options.color_bottom || "transparent"})`
                      : undefined,
                  color:
                    imageInfo.options.text_color ||
                    (imageInfo.options.color_top || imageInfo.options.color_bottom
                      ? ""
                      : "white"),
                }}
              >
                {imageInfo.options.type === "image_icon" ? (
                  <span className="text-base flex flex-row items-center">
                    <img
                      src={imageInfo.options.icon}
                      alt=""
                      className="w-5 h-5 mr-2"
                    />
                    {imageInfo.options.caption || "Caption"}
                  </span>
                ) : (
                  <span className="text-base">
                    {(imageInfo.options.icon || "") + " "}
                    {imageInfo.options.theme_caption ||
                      imageInfo.options.caption ||
                      ""}
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
            onClick={handleCloseImage}
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
              if (imageInfo && imageInfo.mediaInfo && imageInfo.mediaInfo.url) {
                handleDeleteImage(imageInfo.mediaInfo.url);
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
      <div className="absolute bottom-30 z-10">
        Các hình ảnh ở đây là những hình ảnh đăng tải xoá ở đây nhưng trên Locket sẽ không bị xoá
      </div>
    </div>
  );
};

export default BottomHomeScreen;
