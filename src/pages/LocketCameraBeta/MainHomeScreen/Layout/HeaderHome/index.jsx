import { useMemo, useState } from "react";
import { ChevronDown, Download, Menu, MessageCircle } from "lucide-react";
import HistorySelectFriend from "@/pages/LocketCameraBeta/ModalViews/HistorySelectFriend";
import { useAuthStore, useFriendStoreV2 } from "@/stores";

const HeaderHome = ({
  setIsHomeOpen,
  setIsProfileOpen,
  setFriendsTabOpen,
  setIsSidebarOpen,
  isBottomOpen,
  setFriendHistoryOpen,
  isFriendHistoryOpen,
  selectedFile,
}) => {
  const { user } = useAuthStore();
  const friendDetailsMap = useFriendStoreV2((s) => s.friendDetailsMap);
  const friendList = useMemo(
    () => Object.values(friendDetailsMap),
    [friendDetailsMap]
  );

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [friendName, setFriendName] = useState("Mọi người");

  const toggleDropdown = () => {
    // Nếu bottom đang mở → dùng animation logic
    if (isBottomOpen) {
      if (!isVisible) {
        // Mở dropdown
        setIsVisible(true);
        setTimeout(() => setFriendHistoryOpen(true), 10);
      } else {
        // Đóng dropdown
        setFriendHistoryOpen(false);
        setTimeout(() => setIsVisible(false), 500);
      }
      return;
    }

    // Nếu bottom đang đóng → mở tab bạn bè
    setFriendsTabOpen(true);
  };
  const handleDownload = () => {
    if (!selectedFile) return;

    const url = URL.createObjectURL(selectedFile);

    const extension = selectedFile.type.split("/")[1] || "png";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const defaultName = `locketdio-${timestamp}.${extension}`;

    const link = document.createElement("a");
    link.href = url;
    link.download = defaultName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <>
      {selectedFile && (
        <div
          className={`fixed top-0 left-0 w-full px-2 pt-1 flex items-center justify-between z-50`}
        >
          <div></div>
          <div className="absolute flex justify-center items-center flex-row gap-1 left-1/2 transform -translate-x-1/2 text-xl font-semibold text-base-content">
            Gửi đến...
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="w-11 h-11 flex items-center justify-center hover:bg-base-300 rounded-full transition"
            >
              <Download size={28} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
      {!selectedFile && (
        <div
          className={`fixed top-0 left-0 w-full px-2 pt-1 flex items-center justify-between z-50`}
        >
          {/* Avatar bên trái */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="relative flex items-center justify-center w-11 h-11 cursor-pointer active:scale-105"
          >
            {/* Nền mờ */}
            <div className="bg-base-300/70 backdrop-blur-[4px] w-11.5 h-11.5 rounded-full absolute" />

            {/* Hiển thị vòng loading khi ảnh chưa load */}
            {!isImageLoaded && (
              <div className="absolute w-5 h-5 border-t-transparent border-white rounded-full animate-spin" />
            )}

            <img
              src={user?.profilePicture || "/images/default_profile.png"}
              alt="avatar"
              onLoad={() => setIsImageLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = "/images/default_profile.png";
              }}
              className={`rounded-full h-9.5 w-9.5 relative backdrop-blur-3xl transition-opacity duration-300 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </button>

          <button
            className="absolute flex z-90 transition-all justify-center items-center flex-row gap-1 left-1/2 
          transform -translate-x-1/2 text-lg font-semibold bg-base-300/70 backdrop-blur-[4px] 
          hover:bg-base-300 active:scale-105 px-3 py-2 rounded-3xl select-none"
            onClick={toggleDropdown}
          >
            {isBottomOpen ? (
              <>
                <span>{friendName || "Mọi người"}</span>
                <ChevronDown
                  className={`ml-1 w-5 h-5 transition-transform ${
                    isFriendHistoryOpen ? "rotate-180" : ""
                  }`}
                  strokeWidth={3}
                />
              </>
            ) : (
              <>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{friendList.length || "0"}</span>người bạn
              </>
            )}
          </button>

          {/* Nút bên phải */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHomeOpen(true)}
              className="w-11 h-11 flex items-center justify-center bg-base-300/70 backdrop-blur-[4px] rounded-full hover:bg-base-300 transition active:scale-105"
            >
              <MessageCircle strokeWidth={2} />
            </button>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="w-11 h-11 flex items-center justify-center bg-base-300/70 backdrop-blur-[4px] rounded-full hover:bg-base-300 transition active:scale-105"
            >
              <Menu size={28} strokeWidth={2} />
            </button>
          </div>

          <HistorySelectFriend
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            setFriendName={setFriendName}
            onClick={toggleDropdown}
            friendList={friendList}
          />
        </div>
      )}
    </>
  );
};

export default HeaderHome;
