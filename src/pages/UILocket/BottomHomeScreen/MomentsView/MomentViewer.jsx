import { useEffect, useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import LoadingRing from "@/components/ui/Loading/ring";
import { useMoments } from "@/hooks/useMoments";
import UserInfo from "../Layout/UserInfoView";

const MomentViewer = () => {
  const { moments } = useMoments();
  const { selectedMoment, setSelectedMoment, setSelectedMomentId } =
    useApp().post;
  const [animating, setAnimating] = useState(false);
  const startY = useRef(null);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const velocity = useRef(0);
  const lastMoveTime = useRef(0);
  const lastMoveY = useRef(0);

  // Sync selectedMoment -> selectedMomentId
  useEffect(() => {
    if (
      selectedMoment !== null &&
      selectedMoment !== undefined &&
      moments[selectedMoment]
    ) {
      setSelectedMomentId(moments[selectedMoment].id);
    }
  }, [selectedMoment, moments, setSelectedMomentId]);

  // Thêm keyboard support (optional)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        changeMoment(selectedMoment - 1);
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        changeMoment(selectedMoment + 1);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [selectedMoment, moments.length]);

  useEffect(() => {
    if (selectedMoment) {
      // khóa cuộn
      document.body.style.overflow = "hidden";
    } else {
      // mở lại cuộn
      document.body.style.overflow = "";
    }

    // cleanup khi component unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMoment]);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    lastMoveY.current = e.touches[0].clientY;
    lastMoveTime.current = Date.now();
    velocity.current = 0;
    setOffsetY(0);
    setIsDragging(true);
    setAnimating(false);
  };

  const handleTouchMove = (e) => {
    if (startY.current === null || animating) return;

    const currentY = e.touches[0].clientY;
    const currentTime = Date.now();
    const deltaY = currentY - startY.current;

    // Tính toán velocity
    const timeDiff = currentTime - lastMoveTime.current;
    if (timeDiff > 0) {
      velocity.current = (currentY - lastMoveY.current) / timeDiff;
    }

    lastMoveY.current = currentY;
    lastMoveTime.current = currentTime;

    // Thêm resistance khi vuốt quá giới hạn
    let adjustedDeltaY = deltaY;
    if (
      (selectedMoment <= 0 && deltaY > 0) ||
      (selectedMoment >= moments.length - 1 && deltaY < 0)
    ) {
      // Áp dụng resistance effect
      adjustedDeltaY = deltaY * 0.3;
    }

    setOffsetY(adjustedDeltaY);
  };

  const handleTouchEnd = () => {
    if (startY.current === null) return;

    setIsDragging(false);

    // Tính toán threshold dựa trên offset và velocity
    const threshold = 100;
    const velocityThreshold = 0.5;
    const shouldSwipe =
      Math.abs(offsetY) > threshold ||
      Math.abs(velocity.current) > velocityThreshold;

    if (shouldSwipe) {
      // Xác định hướng dựa trên offset và velocity
      const direction =
        offsetY < 0 || velocity.current < -velocityThreshold ? -1 : 1;

      if (direction < 0 && selectedMoment < moments.length - 1) {
        // Swipe up - next moment
        setAnimating(true);
        setSelectedMoment((p) => p + 1);
      } else if (direction > 0 && selectedMoment > 0) {
        // Swipe down - previous moment
        setAnimating(true);
        setSelectedMoment((p) => p - 1);
      }
    }

    // Reset states với animation mượt
    setOffsetY(0);
    startY.current = null;
    velocity.current = 0;

    setTimeout(() => setAnimating(false), 400);
  };
  const [isMediaLoading, setIsMediaLoading] = useState(true);

  const renderMoment = (moment, idx, position) => (
    <div
      key={idx}
      className={`absolute inset-0 flex flex-col items-center justify-center ${
        isDragging
          ? "transition-none"
          : "transition-transform duration-400 ease-out"
      }`}
      style={{
        transform: `translateY(calc(${(idx - selectedMoment) * 100}% + ${
          isDragging ? offsetY : 0
        }px))`,
      }}
    >
      <div className="flex flex-col items-center justify-center relative w-full sm:max-w-sm max-w-md aspect-square bg-base-200 rounded-[64px] overflow-hidden">
        {isMediaLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-600 z-10">
            <LoadingRing color="orange" />
          </div>
        )}
        {/* nội dung media */}
        {moment?.videoUrl ? (
          <video
            src={moment.videoUrl}
            className="max-h-full max-w-full object-contain rounded-2xl"
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsMediaLoading(false)}
          />
        ) : (
          <img
            src={moment?.thumbnailUrl}
            alt={moment?.caption || "Moment"}
            className="w-full h-full object-cover"
            onLoad={() => setIsMediaLoading(false)}
          />
        )}

        {/* caption */}
        {moment?.caption && (
          <div
            className="absolute max-w-[80%] bottom-4 w-fit backdrop-blur-sm rounded-3xl px-2.5 py-2"
            style={{
              background: moment?.overlays?.background?.colors?.length
                ? `linear-gradient(to bottom, ${moment.overlays.background.colors.join(
                    ", "
                  )})`
                : "rgba(0,0,0,0.6)", // fallback khi không có màu
              color: moment?.overlays?.textColor || "#fff",
            }}
          >
            <div className="flex items-center gap-2 flex-row text-md font-bold">
              {/* Icon overlay nếu có */}
              {moment?.overlays?.icon &&
                (moment.overlays.icon.type === "emoji" ? (
                  <span className="text-lg">{moment.overlays.icon.data}</span>
                ) : (
                  <img
                    src={moment.overlays.icon.data}
                    alt="icon"
                    className="w-6 h-6 object-contain"
                  />
                ))}
              <span>{moment.caption}</span>
            </div>
          </div>
        )}
      </div>
      {/* luôn hiện userInfo */}
      <UserInfo user={{ uid: moment.user }} date={moment.date} />
    </div>
  );

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {moments.map((m, i) => renderMoment(m, i))}
    </div>
  );
};

export default MomentViewer;
