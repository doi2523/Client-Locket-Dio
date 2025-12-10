import { useContext, useEffect, useRef, useState } from "react";
import { useApp } from "../../../../context/AppContext";
import { AuthContext } from "../../../../context/AuthLocket";
import { Plus, RefreshCcw, Trash2, UserPlus, Users, X } from "lucide-react";
import { FaUserFriends } from "react-icons/fa";
import { refreshFriends, removeFriend } from "../../../../services";
import LoadingRing from "../../../../components/ui/Loading/ring";
import Settings from "../../../Public/Settings";
import SettingView from "../../../Public/Settings/SettingView";

const SettingContainer = () => {
  const { user, friendDetails, setFriendDetails } = useContext(AuthContext);
  const popupRef = useRef(null);
  const { navigation } = useApp();
  const { isSettingTabOpen, setSettingTabOpen, isFullview, setIsFullview } =
    navigation;
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [startY, setStartY] = useState(null);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Khi mở tab thì reset trạng thái kéo
  useEffect(() => {
    if (isSettingTabOpen) {
      document.body.classList.add("overflow-hidden");
      setCurrentY(0);
    } else {
      document.body.classList.remove("overflow-hidden");
      setCurrentY(0);
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isSettingTabOpen]);

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || startY === null) return;
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - startY;

    if (deltaY > 0) {
      const maxDrag = window.innerHeight * 0.86; // tương đương h-[86vh]
      setCurrentY(Math.min(deltaY, maxDrag));
    }
  };

  // Load friendDetails từ localStorage khi component mount hoặc tab mở
  useEffect(() => {
    if (isSettingTabOpen) {
      const savedDetails = localStorage.getItem("friendDetails");
      if (savedDetails) {
        setFriendDetails(JSON.parse(savedDetails));
      }
    }
  }, [isSettingTabOpen]);

  const handleTouchEnd = () => {
    const popupHeight = window.innerHeight * 0.86;
    const halfway = popupHeight / 2;

    if (currentY > halfway) {
      setSettingTabOpen(false); // Đóng nếu kéo quá nửa popup
    } else {
      setCurrentY(0); // Kéo chưa đủ → trở lại vị trí cũ
    }

    setIsDragging(false);
    setStartY(null);
  };

  const translateStyle = {
    transform: `translateY(${
      isSettingTabOpen ? currentY : window.innerHeight
    }px)`,
    transition: isDragging ? "none" : "transform 0.3s ease-out",
  };
  const handleSelect = (value) => {
    setIsFullview(value);
  };
  return (
    <div
      className={`fixed inset-0 z-90 flex justify-center items-end transition-all duration-500 ${
        isSettingTabOpen
          ? "translate-y-0"
          : "pointer-events-none translate-y-full"
      }`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-base-100/10 backdrop-blur-[2px] bg-opacity-50 transition-opacity duration-500 ${
          isSettingTabOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => {
          setSettingTabOpen(false);
        }}
      />

      {/* Popup */}
      <div
        ref={popupRef}
        className={`
          w-full ${
            isFullview ? "h-[95vh]" : "h-[85vh]"
          } h-[85vh] bg-base-100 rounded-t-4xl shadow-lg flex flex-col justify-center items-center
          will-change-transform ouline-2 outline-base-content outline-dashed
        `}
        style={translateStyle}
      >
        {/* Drag Handle */}
        <div
          className="w-full flex justify-between items-center pt-3 pb-2 active:cursor-grabbing touch-none px-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Thanh kéo ở giữa */}
          <div className="w-12 h-1.5 bg-base-content rounded-full mx-auto" />

          {/* Nút X ở góc phải */}
          <button
            onClick={() => setSettingTabOpen(false)}
            aria-label="Đóng tab bạn bè"
            className="text-base-content focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 absolute right-6 text-base-content"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Header */}
        <div className="flex justify-start flex-col items-center px-4 pb-2 text-primary w-full">
          <div className="flex items-center space-x-2 justify-center w-full no-select">
            <h1 className="text-2xl font-semibold text-base-content sf-compact-rounded-black">
              Settings
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto w-full px-4">
            <SettingView/>
        </div>
      </div>
    </div>
  );
};

export default SettingContainer;
