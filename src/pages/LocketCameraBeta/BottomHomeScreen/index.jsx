import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import UploadingQueue from "./MomentsView/UploadingQueue";
import MomentsGrid from "./MomentsView/MomentsGrid";
import QueueViewer from "./MomentsView/QueueViewer";
import { useAuth } from "@/context/AuthLocket";

import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";
import "swiper/css";
import MomentSlide from "./MomentsView/MomentSlide";
import { useMoments } from "@/hooks/useMomentsV2";
import { useSocket } from "@/context/SocketContext";
import { bulkAddMoments } from "@/cache/momentDB";
import { createListHandler } from "@/socket/socketHandlersV2";

const BottomHomeScreen = () => {
  const { navigation, post } = useApp();
  const [swiperRef, setSwiperRef] = useState(null);
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
    setSelectedMomentId,
  } = post;

  const { user } = useAuth();

  const { socket, isConnected } = useSocket();
  const {
    moments,
    setMoments,
    loading,
    hasMore,
    visibleCount,
    setVisibleCount,
    loadMoreOlder,
    addNewMoment,
    resetVisible,
  } = useMoments(user, selectedFriendUid);

  useEffect(() => {
    resetVisible();
  }, [isBottomOpen, isHomeOpen, isProfileOpen, selectedFriendUid]);

  const handleClose = () => {
    setSelectedMoment(null);
  };

  const idToken = localStorage.getItem("idToken");

  // ================= Socket init =================
  useEffect(() => {
    if (!idToken || !socket) return;

    //Dữ liệu trả về là chuỗi [{},{}] nên sẽ gọi list
    const handler = createListHandler(setMoments, bulkAddMoments);

    // LISTEN
    socket.on("new_on_moments", addNewMoment);

    // EMIT để server gửi moments đầu tiên
    socket.emit("on_moments", {
      timestamp: null,
      token: idToken,
      friendId: null,
      limit: 5,
    });
    // console.log(socket._callbacks);

    // CLEANUP — rất quan trọng
    return () => {
      socket.off("new_on_moments", addNewMoment); // phải cùng tên event!
    };
  }, [idToken, socket]); // nên thêm socket vào dependency

  // Tính toán selectedAnimate dựa trên selectedMoment và selectedQueue
  const selectedAnimate =
    (selectedMoment !== null && selectedQueue === null) ||
    (selectedMoment === null && selectedQueue !== null);

  return (
    <>
      {/* <FlyingEmojiEffect emoji={flyingEmojis} show={showFlyingEffect} /> */}
      {typeof selectedMoment === "number" ||
      typeof selectedQueue === "number" ? (
        <>
          <div className="fixed z-50 inset-0 w-full flex flex-col justify-center h-full items-center">
            {typeof selectedMoment === "number" && (
              <Swiper
                direction="vertical"
                className="w-full h-full max-w-md aspect-square flex flex-col justify-center items-center"
                modules={[Virtual]}
                onSwiper={setSwiperRef}
                slidesPerView={1}
                initialSlide={selectedMoment}
                virtual
                onSlideChange={(swiper) => {
                  const newIndex = swiper.activeIndex;

                  if (newIndex === selectedMoment) return; // <-- FIX LOOP

                  if (newIndex < 0 || newIndex >= moments.length) return;

                  setSelectedMoment(newIndex);
                  setSelectedMomentId(moments[newIndex]?.id);
                }}
              >
                {moments.map((slideContent, index) => (
                  <SwiperSlide
                    key={slideContent.id}
                    virtualIndex={index}
                    className="h-full flex items-center justify-center"
                  >
                    <div className="w-full h-full pb-26 flex items-center justify-center">
                      <MomentSlide
                        moment={slideContent}
                        me={user}
                        handleClose={handleClose}
                        className="w-full max-w-3xl"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            {typeof selectedQueue === "number" && <QueueViewer />}
          </div>
        </>
      ) : null}
      <div
        className={`transition-all w-full duration-500 ${
          selectedAnimate
            ? "opacity-0 scale-95 pointer-events-none select-none"
            : "opacity-100 scale-100"
        }`}
      >
        <UploadingQueue />
        <MomentsGrid
          visibleCount={visibleCount}
          setVisibleCount={setVisibleCount}
          moments={moments}
          loadMoreOlder={loadMoreOlder}
          hasMore={hasMore}
          loading={loading}
        />
      </div>
    </>
  );
};

export default BottomHomeScreen;
