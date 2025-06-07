import { useContext, useEffect, useRef, useState } from "react";
import { useApp } from "../../../../context/AppContext";
import { AuthContext } from "../../../../context/AuthLocket";
import { Plus, RefreshCcw, Trash2, UserPlus, Users, X } from "lucide-react";
import { FaUserFriends } from "react-icons/fa";
import { refreshFriends, removeFriend } from "../../../../services";
import LoadingRing from "../../../../components/UI/Loading/ring";

const FriendsContainer = () => {
  const { user, friendDetails, setFriendDetails } = useContext(AuthContext);
  const popupRef = useRef(null);
  const { navigation } = useApp();
  const { isFriendsTabOpen, setFriendsTabOpen, isFullview } = navigation;
  const [showAllFriends, setShowAllFriends] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null); // tool đã chọn

  const [startY, setStartY] = useState(null);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // State tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const updated = localStorage.getItem("friendsUpdatedAt");
    if (updated) {
      setLastUpdated(updated);
    }
  }, []);

  const handleSelectTool = (tool) => {
    setSelectedTool(tool);
    setOpen(false);
    console.log("Đã chọn công cụ:", tool); // Tuỳ bạn xử lý
  };

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
      setShowAllFriends(false);
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
  const visibleFriends = showAllFriends
    ? filteredFriends
    : filteredFriends.slice(0, 3);

  useEffect(() => {
    if (selectedTool === "create") {
      // mở modal tạo nhóm
    } else if (selectedTool === "delete") {
      // mở modal xác nhận xoá
    }
  }, [selectedTool]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshFriends = async () => {
    try {
      setIsRefreshing(true); // Bắt đầu loading
      console.log("🔄 Đang làm mới danh sách bạn bè...");

      const result = await refreshFriends();

      if (result) {
        alert("✅ Đã làm mới danh sách bạn bè!");
        setFriendDetails(result?.friendDetails);
        setLastUpdated(result?.updatedAt);
      } else {
        alert("⚠️ Không thể làm mới danh sách bạn bè.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi làm mới bạn bè:", error);
      alert("❌ Có lỗi xảy ra khi làm mới danh sách.");
    } finally {
      setIsRefreshing(false); // Kết thúc loading
    }
  };
  const handleDeleteFriend = async (uid) => {
    const confirmed = window.confirm("❓Bạn có chắc muốn xoá người bạn này?");
    if (!confirmed) return;

    try {
      console.log("🗑️ Đang xóa bạn với uid:", uid);

      const result = await removeFriend(uid); // Gửi request xóa bạn từ server

      if (result?.success) {
        // ✅ Cập nhật lại state & localStorage
        const updatedFriends = friendDetails.filter((f) => f.uid !== uid);
        setFriendDetails(updatedFriends);
        localStorage.setItem("friendDetails", JSON.stringify(updatedFriends));
        alert("✅ Đã xoá bạn thành công.");
      } else {
        alert("⚠️ Không thể xoá bạn (có thể đã bị xoá từ trước).");
      }
    } catch (error) {
      console.error("❌ Lỗi khi xoá bạn:", error);
      alert("❌ Có lỗi xảy ra khi xoá bạn.");
    }
  };

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
        className={`fixed inset-0 bg-base-100/10 backdrop-blur-[2px] bg-opacity-50 transition-opacity duration-500 ${
          isFriendsTabOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => {
          setFriendsTabOpen(false);
          setShowAllFriends(false);
        }}
        
      />

      {/* Popup */}
      <div
        ref={popupRef}
        className={`
          w-full ${isFullview ? "h-[95vh]": "h-[85vh]"} h-[85vh] bg-base-100 rounded-t-4xl shadow-lg flex flex-col justify-center items-center
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

        <div className="absolute bottom-8 right-8 flex items-end gap-3">
          {/* Thanh công cụ trượt ra */}
          <div
            className={`flex items-center gap-2 bg-base-100 shadow-xl rounded-full px-3 py-2 transition-all duration-300 ${
              open
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4 pointer-events-none"
            }`}
          >
            <button
              className="btn btn-sm btn-ghost flex items-center gap-1"
              onClick={() => handleSelectTool("create")}
            >
              <UserPlus size={18} /> Tạo nhóm
            </button>
            <button
              className="btn btn-sm btn-ghost flex items-center gap-1 text-error"
              onClick={() => handleSelectTool("delete")}
            >
              <Trash2 size={18} /> Xoá nhóm
            </button>
            <button
              className="btn btn-sm btn-square btn-neutral"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* Nút Plus */}
          <button
            className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/80 transition-colors"
            onClick={() => setOpen(true)}
          >
            <Plus size={32} strokeWidth={3} />
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
          <div className="flex flex-col items-start justify-start w-full mt-2">
            <div
              className={`btn flex whitespace-nowrap flex-row items-center btn-base-200 text-sm text-base-content gap-2 cursor-pointer hover:opacity-80 ${
                isRefreshing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => {
                if (!isRefreshing) handleRefreshFriends();
              }}
            >
              {isRefreshing ? (
                <>
                  <LoadingRing size={20} stroke={2} />
                  <span>Đang làm mới...</span>
                </>
              ) : (
                <>
                  <RefreshCcw className="w-4 h-4" />
                  <span>Làm mới</span>
                </>
              )}
            </div>

            {/* Thời gian cập nhật */}
            {lastUpdated && (
              <div className="text-xs text-gray-500 mt-1">
                Cập nhật lần cuối:{" "}
                {new Date(lastUpdated).toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
            )}
          </div>
        </div>

        {/* Nội dung bạn bè */}
        <div className="flex-1 overflow-y-auto px-4 w-full">
          {filteredFriends.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              Không có bạn bè để hiển thị
            </p>
          )}
          <div>
            <h1 className="flex flex-row items-center gap-1 font-semibold text-xl">
              <FaUserFriends size={25}/> Bạn bè của bạn
            </h1>
            {visibleFriends.map((friend) => (
              <div
                key={friend.uid}
                className="flex items-center gap-3 p-2 rounded-md cursor-pointer justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={friend.profilePic || "./default-avatar.png"}
                    alt={`${friend.firstName} ${friend.lastName}`}
                    className="w-16 h-16 rounded-full border-[3.5px] p-0.5 border-amber-400 object-cover"
                  />
                  <div>
                    <h2 className="font-medium">
                      {friend.firstName} {friend.lastName}
                    </h2>
                    <p className="text-sm text-gray-500 underline">
                      @{friend.username || "Không có username"}
                    </p>
                  </div>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFriend(friend.uid);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {filteredFriends.length > 3 && (
              <div className="flex items-center gap-4 mt-4">
  <hr className="flex-grow border-t border-base-content" />
  <button
    onClick={() => setShowAllFriends(!showAllFriends)}
    className="bg-base-200 hover:bg-base-300 text-base-content font-semibold px-4 py-2 transition-colors rounded-3xl"
  >
    {showAllFriends ? "Thu gọn" : "Xem thêm"}
  </button>
  <hr className="flex-grow border-t border-base-content" />
</div>

            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsContainer;
