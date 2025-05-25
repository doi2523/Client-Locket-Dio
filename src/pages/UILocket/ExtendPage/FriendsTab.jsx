import { useContext, useEffect, useRef, useState } from "react";
import { useApp } from "../../../context/AppContext";
import { AuthContext } from "../../../context/AuthLocket";

const FriendsTab = () => {
  const { user, friendDetails, setFriendDetails } = useContext(AuthContext);
  const popupRef = useRef(null);
  const { navigation } = useApp();
  const { isFriendsTabOpen, setFriendsTabOpen } = navigation;

  const [startY, setStartY] = useState(null);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // State tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  // Khi mở tab thì reset trạng thái kéo
  useEffect(() => {
    if (isFriendsTabOpen) {
      document.body.classList.add("overflow-hidden");
      setCurrentY(0);
    } else {
      document.body.classList.remove("overflow-hidden");
      setCurrentY(0);
      setSearchTerm(""); // reset search khi đóng tab
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isFriendsTabOpen]);

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
    if (isFriendsTabOpen) {
      const savedDetails = localStorage.getItem("friendDetails");
      if (savedDetails) {
        setFriendDetails(JSON.parse(savedDetails));
      }
    }
  }, [isFriendsTabOpen]);

  const handleTouchEnd = () => {
    const popupHeight = window.innerHeight * 0.86;
    const halfway = popupHeight / 2;

    if (currentY > halfway) {
      setFriendsTabOpen(false); // Đóng nếu kéo quá nửa popup
    } else {
      setCurrentY(0); // Kéo chưa đủ → trở lại vị trí cũ
    }

    setIsDragging(false);
    setStartY(null);
  };

  const translateStyle = {
    transform: `translateY(${
      isFriendsTabOpen ? currentY : window.innerHeight
    }px)`,
    transition: isDragging ? "none" : "transform 0.3s ease-out",
  };

  // Filter bạn bè theo tên hoặc username
  const filteredFriends = friendDetails.filter((friend) => {
    const fullName = `${friend.firstName} ${friend.lastName}`.toLowerCase();
    const username = (friend.username || "").toLowerCase();
    const term = searchTerm.toLowerCase();

    return fullName.includes(term) || username.includes(term);
  });

  return (
    <div
      className={`fixed inset-0 z-90 flex justify-center items-end transition-all duration-500 ${
        isFriendsTabOpen
          ? "translate-y-0"
          : "pointer-events-none translate-y-full"
      }`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-base-100/10 backdrop-blur-[2px] bg-opacity-50 transition-opacity duration-300 ${
          isFriendsTabOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setFriendsTabOpen(false)}
      />

      {/* Popup */}
      <div
        ref={popupRef}
        className={`
          w-full h-[86vh] bg-base-100 rounded-t-4xl shadow-lg flex flex-col justify-center items-center
          will-change-transform
        `}
        style={translateStyle}
      >
        {/* Drag Handle */}
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
            onClick={() => setFriendsTabOpen(false)}
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
              ❤️‍🔥 {friendDetails.length} người bạn
            </h1>
          </div>

          <div className="relative w-full mt-2">
            <input
              type="text"
              className="w-full pr-10 border rounded-lg input input-ghost border-base-content transition-shadow font-semibold"
              placeholder="Tìm kiếm bạn bè..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute z-1 right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Nội dung bạn bè */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4 w-full">
          {filteredFriends.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              Không có bạn bè để hiển thị
            </p>
          )}

          {filteredFriends.map((friend) => (
            <div
              key={friend.uid}
              className="flex items-center gap-3 p-2 rounded-md cursor-pointer"
            >
              <img
                src={friend.profilePic || "./default-avatar.png"}
                alt={`${friend.firstName} ${friend.lastName}`}
                className="w-16 h-16 rounded-full border-[3.5px] p-0.5 border-amber-400 object-cover"
              />
              <div>
                <h2 className="font-medium">
                  {friend.firstName} {friend.lastName}
                </h2>
                <p className="text-sm text-gray-500">
                  {friend.username || "Không có username"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsTab;
