import { useContext, useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import { AuthContext } from "@/context/AuthLocket";
import { RefreshCcw, X } from "lucide-react";
import { FaUserFriends, FaSearchPlus } from "react-icons/fa";
import { FindFriendByUserName, refreshFriends, removeFriend } from "@/services";
import LoadingRing from "@/components/ui/Loading/ring";
import FriendItem from "./FriendItem";
import SearchInput from "@/components/ui/Input/SearchInput";
import { showError } from "@/components/Toast";
import FriendFind from "./FriendFind";
import IncomingFriendRequests from "./IncomingRequests";

const FriendsContainer = () => {
  const { user, friendDetails, setFriendDetails } = useContext(AuthContext);
  const popupRef = useRef(null);
  const { navigation } = useApp();
  const { isFriendsTabOpen, setFriendsTabOpen, isPWA } = navigation;
  const [showAllFriends, setShowAllFriends] = useState(false);

  const [startY, setStartY] = useState(null);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // State tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  const [lastUpdated, setLastUpdated] = useState(null);
  const [isFocused, setIsFocused] = useState(null);

  const [searchTermFind, setSearchTermFind] = useState("");
  const [isFocusedFind, setIsFocusedFind] = useState(null);

  useEffect(() => {
    const updated = localStorage.getItem("friendsUpdatedAt");
    if (updated) {
      setLastUpdated(updated);
    }
  }, []);

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

  const [foundUser, setFoundUser] = useState(null); // Lưu user tìm được

  const handleFindFriend = async (searchTermFind) => {
    try {
      //setIsLoading(true); // nếu có
      const result = await FindFriendByUserName(searchTermFind); // gọi service API

      setFoundUser(result); // lưu vào state
    } catch (error) {
      console.error("❌ Lỗi khi tìm bạn:", error);
      setFoundUser(null); // reset nếu không tìm được
      showError(error.message || "Người dùng không tồn tại");
    } finally {
      //setIsLoading(false); // nếu có
    }
  };

  return (
    <>
      <div
        className={`absolute inset-0 bg-base-100/10 backdrop-blur-[2px] bg-opacity-50 transition-opacity duration-500 z-0 ${
          isFriendsTabOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
        onClick={() => {
          setFriendsTabOpen(false);
          setShowAllFriends(false);
        }}
      />

      {/* Popup với translate animation */}
      <div
        className={`
          fixed inset-0 z-50 flex justify-center items-end transition-all duration-800 ease
          ${
            isFriendsTabOpen
              ? "translate-y-0"
              : "translate-y-full pointer-events-none"
          }
        `}
      >
        <div
          ref={popupRef}
          className={`
            relative w-full ${isPWA ? "h-[95vh]" : "h-[85vh]"}
            bg-base-100 flex flex-col rounded-t-4xl shadow-lg
            will-change-transform outline-2 outline-base-content outline-dashed z-50
          `}
          style={translateStyle}
        >
          {/* Drag Handle - Sticky */}
          <div
            className="sticky top-0 w-full flex justify-between items-center pt-1 px-4 active:cursor-grabbing touch-none z-10 rounded-t-4xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Thanh kéo ở giữa */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2">
              <div className="w-12 h-1.5 bg-base-content rounded-full" />
            </div>
            <div className="flex-1" /> {/* Spacer để đẩy nút X sang phải */}
            {/* Nút X ở góc phải */}
            <button
              onClick={() => setFriendsTabOpen(false)}
              aria-label="Đóng tab bạn bè"
              className="text-base-content focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Header - Sticky */}
          <div className="sticky top-12 shadow-md z-10 flex justify-start flex-col items-center pb-2 text-primary w-full px-3">
            <div className="flex flex-col items-center space-x-2 justify-center w-full no-select">
              <h1 className="text-2xl font-semibold text-base-content sf-compact-rounded-black">
                ❤️‍🔥 {friendDetails.length} người bạn
              </h1>
              <h2 className="flex flex-row items-center gap-1 font-semibold text-md mb-1 text-base-content">
                Tìm kiếm và thêm bạn thân
              </h2>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
            {/* Tìm kiếm người dùng mới */}
            <div className="w-full gap-2 space-y-2">
              <h2 className="flex flex-row items-center gap-2 text-base-content font-semibold text-md lg:text-xl mb-1">
                <FaSearchPlus size={22} /> Tìm kiếm ai đó?
              </h2>
              <div className="flex flex-row gap-2 items-center w-full">
                <SearchInput
                  searchTerm={searchTermFind}
                  setSearchTerm={setSearchTermFind}
                  isFocused={isFocusedFind}
                  setIsFocused={setIsFocusedFind}
                  placeholder="Thêm một người bạn mới..."
                />
                {searchTermFind ? (
                  <div
                    className={`btn flex flex-row items-center btn-base-200 text-sm text-base-content gap-2 cursor-pointer hover:opacity-80 ${
                      isRefreshing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleFindFriend(searchTermFind)}
                  >
                    <span>Tìm kiếm</span>
                  </div>
                ) : null}
              </div>
              <div className="w-full flex justify-center">
                {foundUser ? (
                  <FriendFind friend={foundUser} />
                ) : (
                  <p className="text-center h-[70px] text-gray-400">
                    Không tìm thấy người dùng nào
                  </p>
                )}
              </div>
            </div>

            {/* Danh sách bạn bè */}
            <div className="w-full">
              <h1 className="flex flex-row items-center gap-2 font-semibold text-md lg:text-xl mb-1">
                <FaUserFriends size={25} className="scale-x-[-1]" /> Bạn bè của
                bạn
              </h1>
              {/* Input và nút làm mới cùng hàng */}
              <div className="flex items-center gap-2 w-full mt-2">
                <SearchInput
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  isFocused={isFocused}
                  setIsFocused={setIsFocused}
                  placeholder="Tìm kiếm bạn bè..."
                />

                <div
                  className={`btn flex flex-row items-center btn-base-200 text-sm text-base-content gap-2 cursor-pointer hover:opacity-80 ${
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
              </div>

              {/* Thời gian cập nhật ở hàng riêng */}
              {lastUpdated && (
                <div className="text-xs text-gray-500 mt-1 w-full">
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

              {/* Danh sách friend items - có thể cuộn */}
              <div className="mt-4">
                {filteredFriends.length === 0 && (
                  <p className="text-center text-gray-400 mt-10">
                    Không có bạn bè để hiển thị
                  </p>
                )}

                {visibleFriends
                  .slice() // tạo bản copy để không mutate mảng gốc
                  .sort((a, b) => {
                    // Celeb lên trước
                    if (a.isCelebrity === b.isCelebrity) return 0;
                    return a.isCelebrity ? -1 : 1;
                  })
                  .map((friend) => (
                    <FriendItem
                      key={friend.uid}
                      friend={friend}
                      onDelete={handleDeleteFriend}
                    />
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

            {/* Lời mời nhận được */}
            <div className="w-full gap-2 space-y-2">
              <IncomingFriendRequests />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendsContainer;
