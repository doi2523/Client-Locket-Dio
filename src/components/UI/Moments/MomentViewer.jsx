import { useContext, useEffect, useState } from "react";
import { useApp } from "../../../context/AppContext";
import { getAllMoments } from "../../../cache/momentDB";
import { Heart, Send, Smile, ThumbsUp, X } from "lucide-react";
import LoadingRing from "../Loading/ring";
import BottomMenu from "./BottomMenu";
import { AuthContext } from "../../../context/AuthLocket";

const MomentViewer = () => {
  const { user: me } = useContext(AuthContext)
  const { post } = useApp();
  const { selectedMoment, setSelectedMoment } = post;

  const [moments, setMoments] = useState([]);

  const [loading, setLoading] = useState(true); // thêm state loading

  useEffect(() => {
    const fetchMoments = async () => {
      setLoading(true);
      const data = await getAllMoments();
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMoments(sorted);
      setLoading(false);
    };
    fetchMoments();
  }, []);

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

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      if (selectedMoment > 0) setSelectedMoment(selectedMoment - 1);
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      if (selectedMoment < moments.length - 1)
        setSelectedMoment(selectedMoment + 1);
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  // Swipe detection
  let touchStartY = null;
  const handleTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    if (!touchStartY) return;
    const diff = touchStartY - touchEndY;

    if (diff > 50 && selectedMoment < moments.length - 1) {
      setSelectedMoment(selectedMoment + 1);
    } else if (diff < -50 && selectedMoment > 0) {
      setSelectedMoment(selectedMoment - 1);
    }
    touchStartY = null;
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

  const formatMomentTime = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);
    const now = new Date();

    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours || 1}h`;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
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

  if (!loading && !hasValidMoment && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between items-center transition-all duration-300 ease-in-out bg-base-100 ${
        isVisible && !isAnimating
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      {/* Viewer ở giữa */}
      <div className="flex-1 flex flex-col justify-center items-center w-full gap-2">
        <div
          className={`relative w-full max-w-md aspect-square bg-base-200 rounded-[64px] overflow-hidden transition-all duration-300 ease-in-out ${
            isVisible && !isAnimating
              ? "opacity-100 scale-100"
              : "opacity-0 scale-90 pointer-events-none"
          }`}
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

            {currentMoment?.video_url ? (
              <video
                src={currentMoment.video_url}
                className="max-h-full max-w-full object-contain rounded-2xl"
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={() => setIsMediaLoading(false)}
              />
            ) : (
              <img
                src={currentMoment?.thumbnail_url || currentMoment?.image_url}
                alt={currentMoment?.caption || "Moment"}
                className="max-h-full max-w-full object-contain rounded-2xl"
                onLoad={() => setIsMediaLoading(false)}
              />
            )}

            {/* Caption */}
            {currentMoment?.caption && (
              <div className="absolute bottom-4 w-fit bg-black/60 backdrop-blur-sm rounded-2xl px-4 py-2">
                <p className="text-white text-sm font-medium">
                  {currentMoment.caption}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-md text-muted-foreground">
          {(() => {
            const user = getUserFromFriendDetails(currentMoment?.user);

            if (!user) return (
              <div className="flex items-center gap-1">
              <img
                src={me?.profilePicture || "./prvlocket.png"}
                alt={me?.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="truncate max-w-[80px]">Bạn</span>
              <span className="mx-1">·</span>
            </div>
            );
            const fullName = `${user.firstName} ${user.lastName || ""}`.trim();
            const shortName =
              fullName.length > 10 ? fullName.slice(0, 10) + "…" : fullName;

            return (
              <div className="flex items-center gap-1">
                <img
                  src={user.profilePic}
                  alt={fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="truncate max-w-[80px]">{shortName}</span>
                <span className="">·</span>
              </div>
            );
          })()}

          <div>{formatMomentTime(currentMoment?.date)}</div>
        </div>
      </div>

      {/* Bottom menu luôn cố định dưới cùng */}
      <BottomMenu />
    </div>
  );
};

export default MomentViewer;
