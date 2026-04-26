import React, { useEffect, useState } from "react";
import {
  getOutgoingRequestFriend,
  loadFriendDetailsV3,
  rejectFriendRequests,
} from "@/services";
import { useApp } from "@/context/AppContext";
import { X } from "lucide-react";
import { BsCheckCircleFill } from "react-icons/bs";
import { SonnerError, SonnerSuccess } from "@/components/ui/SonnerToast";
import { useAuthStore } from "@/stores";

const OutgoingRequest = () => {
  const { navigation } = useApp();
  const { user } = useAuthStore();
  const { isFriendsTabOpen } = navigation;

  const [friends, setFriends] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [lastFetchAt, setLastFetchAt] = useState(0);

  // ✅ CHỈ reset state khi mở tab — KHÔNG fetch
  useEffect(() => {
    if (isFriendsTabOpen) {
      setFriends([]);
      setNextPageToken(null);
      setShowAllFriends(false);
      setErrorMessage(null);
    }
  }, [isFriendsTabOpen]);

  // ✅ Fetch khi bấm nút
  const fetchFriendRequests = async (pageToken = null) => {
    if (!user) return;

    const now = Date.now();

    // 🚫 chống spam 5s
    if (now - lastFetchAt < 5000) return;

    setLastFetchAt(now);
    setLoading(true);

    try {
      const result = await getOutgoingRequestFriend(pageToken);

      if (result?.errorMessage) {
        setErrorMessage(result.errorMessage);
      } else {
        const frienddetails = await loadFriendDetailsV3(result?.friends);

        setFriends((prev) =>
          pageToken ? [...prev, ...frienddetails] : frienddetails,
        );

        setNextPageToken(result.nextPageToken || null);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Lỗi khi tải danh sách yêu cầu đã gửi");
    }

    setLoading(false);
  };

  const handleCancelRequest = async (uid, name) => {
    if (window.confirm(`Bạn có muốn huỷ yêu cầu kết bạn tới ${name}?`)) {
      try {
        await rejectFriendRequests(uid, "outgoing");

        SonnerSuccess(
          "Huỷ yêu cầu thành công",
          `Bạn đã huỷ yêu cầu kết bạn tới ${name}`,
        );

        // ✅ remove khỏi list
        setFriends((prev) => prev.filter((f) => f.uid !== uid));
      } catch (error) {
        console.error("❌ Lỗi khi huỷ:", error);
        SonnerError("Có lỗi xảy ra khi huỷ yêu cầu!");
      }
    }
  };

  const visibleFriends = showAllFriends ? friends : friends.slice(0, 3);

  return (
    <div>
      <h2 className="flex items-center gap-2 font-semibold text-md lg:text-xl mb-3">
        <BsCheckCircleFill size={22} /> Yêu cầu đã gửi
      </h2>

      {/* ✅ Nút fetch */}
      {friends.length === 0 && !loading && (
        <div className="flex justify-center my-4">
          <button
            onClick={() => fetchFriendRequests()}
            className="bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold"
          >
            Lấy danh sách đã gửi
          </button>
        </div>
      )}

      {loading && friends.length === 0 ? (
        <p className="text-center text-gray-400 h-[70px]">Đang tải...</p>
      ) : errorMessage ? (
        <p className="text-center text-red-500 h-[70px]">{errorMessage}</p>
      ) : friends.length === 0 ? (
        <p className="text-center text-gray-400 h-[70px]">Chưa tải danh sách</p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {visibleFriends.map((friend) => (
              <div
                key={friend.uid}
                className="flex items-center gap-3 justify-between"
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
                  className="p-1 px-2.5 rounded-full"
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
                className="bg-base-200 hover:bg-base-300 font-semibold px-4 py-2 rounded-3xl"
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
