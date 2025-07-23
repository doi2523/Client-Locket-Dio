import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { MessageCircle, Trash2, LayoutGrid, Send } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import { showSuccess, showWarning } from "../../../components/Toast";
import BadgePlan from "./Badge";
import UploadingQueue from "../../../components/UI/Moments/UploadingQueue";
import MomentsGrid from "../../../components/UI/Moments/MomentsGrid";
import MomentViewer from "../../../components/UI/Moments/MomentViewer";
import QueueViewer from "../../../components/UI/Moments/QueueViewer";
import HeaderHistory from "./Header/HeaderHistory";
import InputForMoment from "../../../components/UI/Moments/InputForMoment";
import EmojiPicker from "./Container/EmojiStudio";
import FlyingEmojiEffect from "./Container/FlyingEmojiEffect";

const BottomHomeScreen = () => {
  const { user } = useContext(AuthContext);
  const { navigation, post } = useApp();
  const { isBottomOpen, setIsBottomOpen, showFlyingEffect, flyingEmojis } = navigation;
  const {
    recentPosts,
    setRecentPosts,
    uploadPayloads,
    setuploadPayloads,
    selectedMoment,
    setSelectedMoment,
    selectedQueue,
    setSelectedQueue,
  } = post;

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
      setVisibleCount(20);
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
  const handleReturnHome = () => {
    setIsClosing(true);
    setSelectedMoment(null);
    setSelectedQueue(null);
    setTimeout(() => {
      setIsBottomOpen(false);
      setVisibleCount(20);
      setIsClosing(false);
      setSelectedImage(null);
      setSelectedVideo(null);
      setImageInfo(null);
      setSelectedAnimate(false);
    }, 0);
  };

  useEffect(() => {
    setSelectedAnimate(
      (selectedMoment !== null && selectedQueue === null) ||
        (selectedMoment === null && selectedQueue !== null)
    );
  }, [selectedMoment, selectedQueue]);

  const handleCloseMedia = () => {
    setSelectedMoment(null);
    setSelectedQueue(null);
    setSelectedAnimate(false);
    setTimeout(() => {
      setSelectedImage(null);
      setSelectedVideo(null);
      setImageInfo(null);
    }, 500);
  };

  const handleLoaded = (id) => {
    setLoadedItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleDelete = () => {
    if (selectedMoment !== null) {
      showWarning("Đang phát triển!!!");
      return;
    } else if (selectedQueue !== null) {
      const updatedPayloads = uploadPayloads.filter(
        (_, index) => index !== selectedQueue
      );

      setuploadPayloads(updatedPayloads);
      localStorage.setItem("uploadPayloads", JSON.stringify(updatedPayloads));

      setSelectedQueue(null);
      showSuccess("Đã xoá thành công!");
    }
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

  return (
    <div
      className={`fixed inset-0 flex flex-col transition-all duration-500 z-50 bg-base-100 overflow-hidden ${
        isBottomOpen
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      }`}
    >
      <EmojiPicker/>
      {/* Header */}
      <HeaderHistory />

      <FlyingEmojiEffect emoji={flyingEmojis} show={showFlyingEffect} />

      {/* Main content area */}
      <div className="flex-1 overflow-hidden relative pt-16">
        <div
          className={`overflow-auto h-full p-2 transition-all duration-500 ${
            selectedAnimate ? "opacity-0 scale-90" : "opacity-100 scale-100"
          }`}
        >
          <UploadingQueue
            payloads={uploadPayloads}
            setuploadPayloads={setuploadPayloads}
            handleLoaded={handleLoaded}
            setselectItems={setselectItems}
          />
          <MomentsGrid />
        </div>
        {/* Nếu đang chọn Moment hoặc Queue thì hiển thị Viewer */}
        {typeof selectedMoment === "number" ||
        typeof selectedQueue === "number" ? (
          <div className="absolute inset-0 z-20">
            {typeof selectedMoment === "number" && (
              <MomentViewer visibleCount={visibleCount} />
            )}
            {typeof selectedQueue === "number" && <QueueViewer />}
          </div>
        ) : null}
      </div>

      {/* Bottom Button */}
      <div className="w-full fixed bottom-0 px-5 py-5 text-base-content z-30">
        {(typeof selectedMoment === "number" ||
          typeof selectedQueue === "number") && (
            <InputForMoment/>
        )}

        <div className="grid grid-cols-3 items-center">
          {/* Left: Close viewer button */}
          <div className="flex justify-start">
            {selectedMoment !== null && selectedMoment !== undefined && (
              <button
                className="p-2 text-base-content tooltip tooltip-right cursor-pointer hover:bg-base-200/50 rounded-full transition-colors"
                onClick={handleCloseMedia}
                data-tip="Bấm để xem danh sách lưới"
              >
                <LayoutGrid size={28} />
              </button>
            )}
          </div>

          {/* Center: Home button */}
          <div className="flex justify-center scale-75">
            <button
              onClick={handleReturnHome}
              className="relative flex items-center justify-center w-20 h-20"
            >
              <div className="absolute w-20 h-20 border-4 border-base-content/30 rounded-full z-10"></div>
              <div className="absolute rounded-full w-16 h-16 bg-base-content z-0 hover:scale-105 transition-transform"></div>
            </button>
          </div>

          {/* Right: Delete button */}
          <div className="flex justify-end">
            <button
              onClick={handleDelete}
              className="p-2 text-base-content tooltip-left tooltip cursor-pointer hover:bg-base-200/50 rounded-full transition-colors"
              data-tip="Bấm để xoá ảnh"
            >
              <Trash2 size={28} />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default BottomHomeScreen;
