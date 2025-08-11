import React, { useEffect, useState } from "react";
import { FaStarOfLife } from "react-icons/fa";
import {
  AcceptRequestToFriend,
  getListRequestFriend,
  loadFriendDetailsV2,
} from "@/services";
import { useApp } from "@/context/AppContext";
import { Check } from "lucide-react";
import { showSuccess } from "@/components/Toast";

const IncomingFriendRequests = () => {
  const { navigation } = useApp();
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
    setLoading(true);
    const result = await getListRequestFriend(pageToken);

    if (result?.errorMessage) {
      setErrorMessage(result.errorMessage);
    } else {
      const frienddetails = await loadFriendDetailsV2(result?.friends);
      setFriends((prev) => [...prev, ...frienddetails]);
      setNextPageToken(result.nextPageToken || null);
    }
    setLoading(false);
  };

  const handleAcceptRequest = async (uid) => {
    try {
      const acceptedUid = await AcceptRequestToFriend(uid);
      // Xoá người vừa chấp nhận khỏi danh sách hiển thị
      setFriends((prev) => prev.filter((friend) => friend.uid !== acceptedUid));

      // Hiển thị thông báo thành công
      showSuccess("Đã chấp nhận lời mời");
    } catch (error) {
      console.error("❌ Lỗi khi chấp nhận lời mời:", error.message || error);
    }
  };

  const visibleFriends = showAllFriends ? friends : friends.slice(0, 3);

  return (
    <div>
      <h2 className="flex flex-row items-center gap-2 text-base-content font-semibold text-md lg:text-xl mb-3">
        <FaStarOfLife size={22} /> Lời mời kết bạn
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
                  className="btn flex flex-row justify-center bg-yellow-500 text-black p-1 px-3 rounded-full transition shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcceptRequest(friend.uid);
                  }}
                >
                  <Check className="w-5 h-5" strokeWidth={3} />
                  <span className="text-base font-semibold">Chấp nhận</span>
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

export default IncomingFriendRequests;
