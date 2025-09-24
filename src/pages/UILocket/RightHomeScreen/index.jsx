import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthLocket";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import BadgePlan from "../ExtendPage/Badge";
import { useMessages } from "@/hooks/useMessages";
import { formatTimeAgo } from "@/utils";
import ChatDetail from "./View/ChatDetail";
import { getFriendDetail } from "@/cache/friendsDB";

const RightHomeScreen = () => {
  const { user } = useContext(AuthContext);
  const { navigation } = useApp();
  const [selectedChat, setSelectedChat] = useState(null); // { uid, friend }
  const { messages, loading, hasMore, loadMore } = useMessages(20);
  const { isHomeOpen, setIsHomeOpen } = navigation;

  // ✅ Cache thông tin bạn bè
  const [friendsMap, setFriendsMap] = useState({});

  useEffect(() => {
    const loadFriends = async () => {
      const friendUids = messages
        .map((msg) => msg.members?.find((m) => m !== user?.uid))
        .filter(Boolean);

      const needFetch = friendUids.filter((uid) => !friendsMap[uid]);

      if (needFetch.length === 0) return;

      const results = await Promise.all(
        needFetch.map(async (uid) => {
          try {
            return [uid, await getFriendDetail(uid)];
          } catch (err) {
            console.error("❌ getFriendDetail error:", err);
            return [uid, null];
          }
        })
      );

      // Cập nhật 1 lần
      setFriendsMap((prev) => {
        const newMap = { ...prev };
        results.forEach(([uid, friend]) => {
          if (friend) newMap[uid] = friend;
        });
        return newMap;
      });
    };

    loadFriends();
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

          {[...messages]
            .sort((a, b) => {
              const timeA = new Date(a.latestMessage?.createdAt || 0).getTime();
              const timeB = new Date(b.latestMessage?.createdAt || 0).getTime();
              return timeB - timeA;
            })
            .map((msg) => {
              const friendUid = msg.members?.find((m) => m !== user?.uid);
              if (!friendUid) return null;

              const friend = friendsMap[friendUid]; // ✅ lấy từ state, không await trong render

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
