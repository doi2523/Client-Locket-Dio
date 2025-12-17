import React, { useEffect, useState } from "react";
import {
  getOutgoingRequestFriend,
  loadFriendDetailsV2,
  rejectFriendRequests,
} from "@/services";
import { useApp } from "@/context/AppContext";
import { X } from "lucide-react";
import { BsCheckCircleFill } from "react-icons/bs";
import { SonnerError, SonnerSuccess } from "@/components/ui/SonnerToast";
import { useAuth } from "@/context/AuthLocket";

const OutgoingRequest = () => {
  const { navigation } = useApp();
  const { user } = useAuth();
  const { isFriendsTabOpen } = navigation;
  const [friends, setFriends] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAllFriends, setShowAllFriends] = useState(false);

  useEffect(() => {
    if (isFriendsTabOpen) {
      setFriends([]); // reset khi mở tab mới
      setNextPageToken(null);
      setShowAllFriends(false);
      fetchFriendRequests();
    }
  }, [isFriendsTabOpen]);

  const fetchFriendRequests = async (pageToken = null) => {
    if (!user) return;
    setLoading(true);
    const result = await getOutgoingRequestFriend(pageToken);

    if (result?.errorMessage) {
      setErrorMessage(result.errorMessage);
    } else {
      const frienddetails = await loadFriendDetailsV2(result?.friends);
      setFriends((prev) => [...prev, ...frienddetails]);
      setNextPageToken(result.nextPageToken || null);
    }
    setLoading(false);
  };

  const handleCancelRequest = async (uid, name) => {
    if (window.confirm(`Bạn có muốn huỷ yêu cầu kết bạn tới ${name}?`)) {
      try {
        await rejectFriendRequests(uid, "outgoing"); // gọi API huỷ
        SonnerSuccess(
          "Huỷ yêu cầu thành công",
          `Bạn đã huỷ yêu cầu kết bạn tới ${name}`
        );

        // Xoá khỏi danh sách hiển thị
        setFriends((prev) => prev.filter((f) => f.uid !== uid));
      } catch (error) {
        console.error("❌ Lỗi khi huỷ yêu cầu:", error);
        SonnerError("Có lỗi xảy ra khi huỷ yêu cầu. Vui lòng thử lại!");
      }
    }
  };

  const visibleFriends = showAllFriends ? friends : friends.slice(0, 3);

  return (
    <div>
      <h2 className="flex flex-row items-center gap-2 text-base-content font-semibold text-md lg:text-xl mb-3">
        <BsCheckCircleFill size={22} /> Yêu cầu đã gửi
      </h2>
      <div className="text-xs text-gray-500 mt-1 w-full"></div>

      {loading && friends.length === 0 ? (
        <p className="text-center text-gray-400 h-[70px]">Đang tải...</p>
      ) : errorMessage ? (
        <p className="text-center text-red-500 h-[70px]">{errorMessage}</p>
      ) : friends.length === 0 ? (
        <p className="text-center text-gray-400 h-[70px]">
          Không tìm thấy ai!!
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {visibleFriends.map((friend) => (
              <div
                key={friend.uid}
                className="flex items-center gap-3 rounded-md cursor-pointer justify-between"
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
                  className="flex flex-row justify-center p-1 px-2.5 rounded-full transition shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelRequest(friend.uid, friend.firstName);
                  }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>

          {(friends.length > 3 || nextPageToken) && (
            <div className="flex items-center gap-4 mt-4">
              <hr className="flex-grow border-t border-base-content" />
              <button
                onClick={async () => {
                  if (!showAllFriends) {
                    setShowAllFriends(true);
                  } else if (nextPageToken) {
                    await fetchFriendRequests(nextPageToken);
                  }
                }}
                className="bg-base-200 hover:bg-base-300 text-base-content font-semibold px-4 py-2 transition-colors rounded-3xl"
              >
                {nextPageToken
                  ? "Xem thêm"
                  : showAllFriends
                  ? "Đã hiện hết"
                  : "Xem thêm"}
              </button>
              <hr className="flex-grow border-t border-base-content" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OutgoingRequest;
