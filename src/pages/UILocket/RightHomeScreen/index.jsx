import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthLocket";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import BadgePlan from "../ExtendPage/Badge";
import { useMessages } from "@/hooks/useMessages";
import { fetchUserV2 } from "@/services";
import { formatTimeAgo } from "@/utils";
import ChatDetail from "./View/ChatDetail";
import { getUserFromFriendDetails } from "@/helpers/GetInfoUser/getInfoDetails";

const RightHomeScreen = () => {
  const { user } = useContext(AuthContext);
  const { navigation } = useApp();
  const [selectedChat, setSelectedChat] = useState(null); // { uid, friend }
  const { messages, loading, hasMore, loadMore } = useMessages(20);
  const { isHomeOpen, setIsHomeOpen } = navigation;

  // ✅ Cache thông tin bạn bè
  const [friendsMap, setFriendsMap] = useState({});

  useEffect(() => {
    // Lấy tất cả friendUid trong messages
    const friendUids = messages
      .map((msg) => msg.members?.find((m) => m !== user?.uid))
      .filter(Boolean);

    // Lọc ra UID chưa fetch
    const needFetch = friendUids.filter((uid) => !friendsMap[uid]);

    if (needFetch.length === 0) return;

    needFetch.forEach(async (uid) => {
      try {
        const friend = await fetchUserV2(uid);
        setFriendsMap((prev) => ({ ...prev, [uid]: friend }));
      } catch (err) {
        console.error("❌ fetchUser error:", err);
      }
    });
  }, [messages, user?.uid, friendsMap]);

  return (
    <>
      <div
        className={`fixed inset-0 flex flex-col transition-transform duration-500 z-50 bg-base-100 overflow-hidden
${
  isHomeOpen
    ? selectedChat
      ? "-translate-x-full"
      : "translate-x-0"
    : "translate-x-full"
}`}
      >
        {/* Header */}
        <div className="relative flex items-center shadow-lg justify-between px-4 py-2 text-base-content">
          <button
            onClick={() => setIsHomeOpen(false)}
            className="btn p-1 border-0 rounded-full hover:bg-base-200 transition cursor-pointer z-10"
          >
            <ChevronLeft size={30} />
          </button>
          <BadgePlan />
        </div>

        {/* Nội dung */}
        <div className="flex-1 px-4 py-6 overflow-y-auto space-y-4">
          {loading && <p className="text-center">⏳ Đang tải...</p>}

          {[...messages] // copy ra tránh mutate state gốc
            .sort((a, b) => {
              const timeA = new Date(a.latestMessage?.createdAt || 0).getTime();
              const timeB = new Date(b.latestMessage?.createdAt || 0).getTime();
              return timeB - timeA; // mới nhất trước
            })
            .map((msg) => {
              const friendUid = msg.members?.find((m) => m !== user?.uid);
              if (!friendUid) return null;

              const friend = getUserFromFriendDetails(friendUid);

              return (
                <div
                  key={msg.id}
                  onClick={() =>
                    setSelectedChat({
                      uid: friendUid,
                      friend: friend,
                    })
                  }
                  className="relative w-full flex items-center gap-3 p-3 bg-base-200 rounded-3xl shadow-sm cursor-pointer hover:bg-base-300"
                >
                  {/* Avatar bạn bè */}
                  {friend ? (
                    <img
                      src={friend.profilePic || "/default-avatar.png"}
                      alt={friend?.firstName || "user"}
                      className="w-15 h-15 rounded-full border-[3px] p-0.5 border-amber-400 object-cover transition-all duration-200"
                    />
                  ) : (
                    <div className="w-15 h-15 rounded-xl bg-gray-300 animate-pulse" />
                  )}

                  {/* Nội dung */}
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold truncate">
                      {friend?.firstName} {friend?.lastName} ~{" "}
                      {formatTimeAgo(msg.latestMessage?.createdAt)}
                    </p>
                    <p className="text-md text-gray-500 truncate pt-1">
                      {msg.latestMessage?.body}
                    </p>
                  </div>

                  {/* Chevron icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <ChevronRight className="w-6 h-6 text-gray-500" />
                  </div>
                </div>
              );
            })}

          {hasMore && !loading && (
            <button
              onClick={loadMore}
              className="btn btn-sm mt-4 mx-auto w-fit rounded-full"
            >
              Tải thêm
            </button>
          )}
        </div>
      </div>
      {/* Chat detail */}
      <ChatDetail
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />
    </>
  );
};

export default RightHomeScreen;
