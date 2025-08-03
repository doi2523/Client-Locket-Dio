import React, { useEffect, useState } from "react";
import { CalendarHeart } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import { showInfo } from "../../../components/Toast";
import UploadingQueue from "../../../components/UI/Moments/UploadingQueue";
import MomentsGrid from "../../../components/UI/Moments/MomentsGrid";
import MomentViewer from "../../../components/UI/Moments/MomentViewer";
import QueueViewer from "../../../components/UI/Moments/QueueViewer";
import HeaderHistory from "./Header/HeaderHistory";
import EmojiPicker from "./Container/EmojiStudio";
import FlyingEmojiEffect from "./Container/FlyingEmojiEffect";
import { INITIAL_MOMENTS_VISIBLE } from "../../../constants";

const BottomHomeScreen = () => {
  const { navigation, post } = useApp();
  const { isBottomOpen, setIsBottomOpen, showFlyingEffect, flyingEmojis } =
    navigation;
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

  // Chỉ giữ lại các state thực sự cần thiết
  const [visibleCount, setVisibleCount] = useState(INITIAL_MOMENTS_VISIBLE);
  const [isClosing, setIsClosing] = useState(false);
  const [loadedItems, setLoadedItems] = useState([]);
  const [selectItems, setselectItems] = useState(null);

  useEffect(() => {
    if (isBottomOpen) {
      const localData = JSON.parse(
        localStorage.getItem("uploadedMoments") || "[]"
      ).reverse();
      setRecentPosts(localData);
      setVisibleCount(INITIAL_MOMENTS_VISIBLE);
    }
  }, [isBottomOpen, setRecentPosts]);

  const handleReturnHome = () => {
    setIsClosing(true);
    setSelectedMoment(null);
    setSelectedQueue(null);
    setTimeout(() => {
      setIsBottomOpen(false);
      setVisibleCount(INITIAL_MOMENTS_VISIBLE);
      setIsClosing(false);
    }, 0);
  };

  // Tính toán selectedAnimate dựa trên selectedMoment và selectedQueue
  const selectedAnimate =
    (selectedMoment !== null && selectedQueue === null) ||
    (selectedMoment === null && selectedQueue !== null);

  const handleCloseMedia = () => {
    setSelectedMoment(null);
    setSelectedQueue(null);
  };

  const handleLoaded = (id) => {
    setLoadedItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col transition-all duration-500 z-50 bg-base-100 overflow-hidden ${
        isBottomOpen
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      }`}
    >
      <EmojiPicker />
      {/* Header */}

      <FlyingEmojiEffect emoji={flyingEmojis} show={showFlyingEffect} />

      {/* Main content area */}
      <div className="flex-1 overflow-hidden relative">
        <div className={`overflow-auto h-full`}>
          <div className="sticky top-0 z-50">
            <HeaderHistory />
          </div>
          <div
            className={`transition-all duration-500 ${
              selectedAnimate ? "opacity-0 scale-90" : "opacity-100 scale-100"
            }`}
          >
            <UploadingQueue
              payloads={uploadPayloads}
              setuploadPayloads={setuploadPayloads}
              handleLoaded={handleLoaded}
              setselectItems={setselectItems}
            />
            <MomentsGrid visibleCount={visibleCount} />
          </div>

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
      </div>
      {/* Bottom Button */}
      {selectedMoment == null && selectedQueue == null && (
        <div className="w-full fixed bottom-0 px-5 py-5 text-base-content z-30">
          <div className="grid grid-cols-3 items-center">
            {/* Left: Close viewer button */}
            <div className="flex justify-start"></div>

            {/* Center: Home button */}
            <div className="flex justify-center scale-75">
              <button
                onClick={handleReturnHome}
                className="relative flex items-center justify-center w-20 h-20"
              >
                <div className="absolute w-20 h-20 border-4 border-base-content/30 rounded-full z-10"></div>
                <div className="absolute rounded-full w-16 h-16 bg-neutral z-0 hover:scale-105 transition-transform"></div>
              </button>
            </div>

            {/* Right: Delete button */}
            <div className="flex justify-end">
              <button
                onClick={() => showInfo("Chức năng này đang phát triển!")}
                className="p-2 backdrop-blur-xs bg-base-100/30 text-base-content tooltip-left tooltip cursor-pointer hover:bg-base-200/50 rounded-full transition-colors"
              >
                <CalendarHeart size={28} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomHomeScreen;
