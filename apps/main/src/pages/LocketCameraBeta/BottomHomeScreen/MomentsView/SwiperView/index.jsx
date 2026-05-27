import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";
import "swiper/css";

import { useMomentsStoreV2, useSelectedStore } from "@/stores";
import QueueViewer from "./QueueViewer";
import MomentViewer from "./MomentViewer";

const SwiperView = () => {
  const [swiperRef, setSwiperRef] = useState(null);

  const selectedMoment = useSelectedStore((s) => s.selectedMoment);
  const setSelectedMoment = useSelectedStore((s) => s.setSelectedMoment);

  const selectedQueue = useSelectedStore((s) => s.selectedQueue);

  const selectedMomentId = useSelectedStore((s) => s.selectedMomentId);
  const setSelectedMomentId = useSelectedStore((s) => s.setSelectedMomentId);

  const selectedFriendUid = useSelectedStore((s) => s.selectedFriendUid);

  const selectedKey = selectedFriendUid ?? "all";
  const bucket = useMomentsStoreV2((s) => s.momentsByUser[selectedKey]);
  const moments = bucket?.moments ?? [];

  const momentActive = typeof selectedMoment === "number";
  const queueActive = typeof selectedQueue === "number";

  useEffect(() => {
    if (!swiperRef || selectedMomentId == null) return;

    const newIndex = moments.findIndex((m) => m.id === selectedMomentId);
    if (newIndex === -1) return;

    if (newIndex !== selectedMoment) {
      setSelectedMoment(newIndex);
      swiperRef.slideTo(newIndex, 0);
    }
  }, [moments, selectedMomentId, swiperRef, selectedMoment, setSelectedMoment]);

  const handleClose = () => {
    setSelectedMoment(null);
    setSelectedMomentId(null);
  };

  if (!momentActive && !queueActive) return null;

  if (queueActive) return <QueueViewer />;

  return (
    <div className="fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center">
      <Swiper
        direction="vertical"
        className="flex h-full w-full max-w-md flex-col items-center justify-center aspect-square"
        modules={[Virtual]}
        onSwiper={setSwiperRef}
        slidesPerView={1}
        initialSlide={selectedMoment}
        virtual
        onSlideChange={(swiper) => {
          const newIndex = swiper.activeIndex;

          if (newIndex === selectedMoment) return;
          if (newIndex < 0 || newIndex >= moments.length) return;

          setSelectedMoment(newIndex);
          setSelectedMomentId(moments[newIndex]?.id);
        }}
      >
        {moments.map((slideContent, index) => (
          <SwiperSlide
            key={slideContent.id}
            virtualIndex={index}
            className="flex h-full items-center justify-center"
          >
            <div className="flex h-full w-full items-center justify-center pb-26">
              <MomentViewer moment={slideContent} handleClose={handleClose} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperView;
