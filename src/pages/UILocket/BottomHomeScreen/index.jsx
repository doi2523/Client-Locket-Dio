import { useEffect, useState } from "react";
import { CalendarHeart } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { showInfo } from "@/components/Toast";
import HeaderHistory from "./Layout/HeaderHistory";
import { INITIAL_MOMENTS_VISIBLE } from "@/constants";

// const UploadingQueue = lazy(() => import("./MomentsView/UploadingQueue"));
// const MomentsGrid = lazy(() => import("./MomentsView/MomentsGrid"));
// const MomentViewer = lazy(() => import("./MomentsView/MomentViewer"));
// const QueueViewer = lazy(() => import("./MomentsView/QueueViewer"));
// const EmojiPicker = lazy(() => import("./Modal/EmojiStudio"));
// const FlyingEmojiEffect = lazy(() => import("./Modal/FlyingEmojiEffect"));

import UploadingQueue from "./MomentsView/UploadingQueue";
import MomentsGrid from "./MomentsView/MomentsGrid";
import MomentViewer from "./MomentsView/MomentViewer";
import QueueViewer from "./MomentsView/QueueViewer";
import EmojiPicker from "./Modal/EmojiStudio";
import FlyingEmojiEffect from "./Modal/FlyingEmojiEffect";
import BottomMenu from "./Layout/BottomMenu";
import { useMoments } from "@/hooks/useMoments";

const BottomHomeScreen = () => {
  const { navigation, post } = useApp();
  const {
    isHomeOpen,
    isBottomOpen,
    setIsBottomOpen,
    showFlyingEffect,
    flyingEmojis,
    setIsHomeOpen,
    isProfileOpen,
  } = navigation;
  const {
    recentPosts,
    setRecentPosts,
    uploadPayloads,
    setuploadPayloads,
    selectedMoment,
    setSelectedMoment,
    selectedQueue,
    setSelectedQueue,
    selectedFriendUid,
  } = post;

  // Chỉ giữ lại các state thực sự cần thiết
  const [visibleCount, setVisibleCount] = useState(INITIAL_MOMENTS_VISIBLE);
  const [loadedItems, setLoadedItems] = useState([]);
  const [selectItems, setselectItems] = useState(null);

  useEffect(() => {
    setVisibleCount(INITIAL_MOMENTS_VISIBLE);
  }, [isBottomOpen, isProfileOpen, isHomeOpen]);

  const handleReturnHome = () => {
    setSelectedMoment(null);
    setSelectedQueue(null);
    setIsBottomOpen(false);
    setVisibleCount(INITIAL_MOMENTS_VISIBLE);
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
      className={`fixed inset-0 flex flex-col transition-all duration-500 z-50 overflow-hidden
    ${isBottomOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
    ${isHomeOpen ? "-translate-x-full opacity-100" : ""}
    ${isProfileOpen ? "translate-x-full opacity-100" : ""}
  `}
    >
      <EmojiPicker />
      {/* Header */}

      <FlyingEmojiEffect emoji={flyingEmojis} show={showFlyingEffect} />
      {selectedMoment == null && selectedQueue == null ? (
        <div className="absolute w-full top-0 z-60">
          <HeaderHistory />
        </div>
      ) : (
        <div className="w-full top-0 z-60">
          <HeaderHistory />
        </div>
      )}
      {/* Main content area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-auto">
          {typeof selectedMoment === "number" ||
          typeof selectedQueue === "number" ? (
            <div className="absolute w-full h-full inset-0 flex flex-col justify-center items-center">
              {typeof selectedMoment === "number" && <MomentViewer />}
              {typeof selectedQueue === "number" && <QueueViewer />}
            </div>
          ) : null}
          <div
            className={`transition-all duration-300 ease-in ${
              selectedAnimate
                ? "opacity-0 pointer-events-none select-none"
                : "opacity-100"
            }`}
          >
            <div className="h-16"></div>
            <UploadingQueue
              payloads={uploadPayloads}
              setuploadPayloads={setuploadPayloads}
              handleLoaded={handleLoaded}
              setselectItems={setselectItems}
            />
            <MomentsGrid visibleCount={visibleCount} />
          </div>
        </div>
      </div>
      {/* Bottom Button */}
      {selectedMoment == null && selectedQueue == null ? (
        <div className="w-full fixed bottom-0 px-5 py-5 text-base-content z-60">
          <div className="grid grid-cols-3 items-center">
            {/* Left: Close viewer button */}
            <div className="flex justify-start"></div>

            {/* Center: Home button */}
            <div className="flex justify-center scale-75 sm:scale-65">
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
      ) : (
        <BottomMenu />
      )}
    </div>
  );
};

export default BottomHomeScreen;
