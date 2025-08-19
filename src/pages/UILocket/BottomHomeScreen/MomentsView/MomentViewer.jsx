import { useContext, useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { X } from "lucide-react";
import LoadingRing from "@/components/ui/Loading/ring";
import { AuthContext } from "@/context/AuthLocket";
import { useMoments } from "@/hooks/useMoments";
import UserInfo from "../Layout/UserInfoView";

const MomentViewer = () => {
  const { user: me } = useContext(AuthContext);
  const { post } = useApp();
  const {
    selectedMoment,
    setSelectedMoment,
    selectedMomentId,
    selectedFriendUid,
  } = post;
  const { moments } = useMoments(selectedFriendUid);

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

  const getUserFromFriendDetails = (uid) => {
    if (!uid) return null;

    try {
      const data = localStorage.getItem("friendDetails");
      if (!data) return null;

      const users = JSON.parse(data);
      return users.find((user) => user.uid === uid) || null;
    } catch (error) {
      console.error("Lỗi khi đọc friendDetails từ localStorage:", error);
      return null;
    }
  };

  const [isMediaLoading, setIsMediaLoading] = useState(true);

  if (!hasValidMoment && !isAnimating) return null;

  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-full gap-2 transition-all duration-300 ease-in-out ${
        isVisible && !isAnimating
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none"
      }`}
    >
      <div
        className="relative w-full sm:max-w-sm max-w-md aspect-square bg-base-200 rounded-[64px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={handleClose}
          className="absolute flex justify-center items-center top-4 right-4 z-50 p-2 bg-black/40 rounded-full hover:bg-black/60"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Nội dung Moment */}
        <div className="h-full w-full flex items-center justify-center relative bg-gradient-to-br from-base-300/20 to-base-100/20">
          {isMediaLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-600 z-10">
              <LoadingRing color="orange" />
            </div>
          )}

          {currentMoment?.videoUrl ? (
            <video
              src={currentMoment.videoUrl}
              className="max-h-full max-w-full object-contain rounded-2xl"
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setIsMediaLoading(false)}
            />
          ) : (
            <img
              src={currentMoment?.thumbnailUrl}
              alt={currentMoment?.caption || "Moment"}
              className="w-full h-full object-cover rounded-2xl"
              onLoad={() => setIsMediaLoading(false)}
            />
          )}

          {/* Caption */}
          {currentMoment?.caption && (
            <div
              className="absolute max-w-[80%] bottom-4 w-fit backdrop-blur-sm rounded-3xl px-2.5 py-2"
              style={{
                background: currentMoment?.overlays?.background?.colors?.length
                  ? `linear-gradient(to bottom, ${currentMoment.overlays.background.colors.join(
                      ", "
                    )})`
                  : "rgba(0,0,0,0.6)", // fallback khi không có màu
                color: currentMoment?.overlays?.textColor || "#fff",
              }}
            >
              <div className="flex items-center gap-2 flex-row text-md font-bold">
                {/* Icon overlay nếu có */}
                {currentMoment?.overlays?.icon &&
                  (currentMoment.overlays.icon.type === "emoji" ? (
                    <span className="text-lg">
                      {currentMoment.overlays.icon.data}
                    </span>
                  ) : (
                    <img
                      src={currentMoment.overlays.icon.data}
                      alt="icon"
                      className="w-6 h-6 object-contain"
                    />
                  ))}
                <span>{currentMoment.caption}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info user + date */}
      <UserInfo
        user={getUserFromFriendDetails(currentMoment?.user)}
        me={me}
        date={currentMoment?.date}
      />
    </div>
  );
};

export default MomentViewer;
