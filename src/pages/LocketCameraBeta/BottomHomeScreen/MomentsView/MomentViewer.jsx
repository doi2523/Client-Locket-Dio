import { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";
import { useApp } from "@/context/AppContext";
import { AuthContext } from "@/context/AuthLocket";
import MomentSlide from "./MomentSlide";

const MomentViewer = ({ moments }) => {
  const { user } = useContext(AuthContext);
  const [swiperRef, setSwiperRef] = useState(null);
  const { post } = useApp();
  const {
    selectedMoment,
    setSelectedMoment,
    selectedMomentId,
    selectedFriendUid,
    setSelectedMomentId,
  } = post;

  // Hiện tại có moment không?
  const hasValidMoment =
    typeof selectedMoment === "number" &&
    selectedMoment >= 0 &&
    selectedMoment < moments.length;

  const currentMoment = hasValidMoment ? moments[selectedMoment] : null;

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Bắt hiệu ứng mở mỗi khi selectedMoment thay đổi từ null -> số
  useEffect(() => {
    if (selectedMoment !== null) {
      setIsVisible(true);
    }
  }, [selectedMoment]);

  const handleClose = () => {
    setIsAnimating(true);
    setIsVisible(false); // để kích hoạt hiệu ứng đóng
    setTimeout(() => {
      setSelectedMoment(null);
      setIsAnimating(false);
    }, 300);
  };

  // Khóa cuộn khi mở modal
  useEffect(() => {
    const shouldLock = hasValidMoment || isAnimating;
    if (shouldLock) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [hasValidMoment, isAnimating]);

    useEffect(() => {
    if (!swiperRef || selectedMoment == null) return;

    if (swiperRef.activeIndex !== selectedMoment) {
      swiperRef.slideTo(selectedMoment, 0);
    }
  }, [selectedMoment, swiperRef]);
  
  if (!hasValidMoment && !isAnimating) return null;

  return (
    <>
      {/* <div className="fixed flex justify-center items-center h-full w-full bg-amber-200">
        <LoadingRing color="orange" size={50} />
      </div> */}
      <div
        className={`flex flex-col justify-center items-center w-full h-full transition-all duration-300 ${
          isVisible && !isAnimating
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90 pointer-events-none"
        }`}
      >
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
                <div className="pointer-events-auto bg-amber-600 touch-pan-y w-full h-2/5 pb-26 flex items-center justify-center">
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
      </div>
    </>
  );
};

export default MomentViewer;
