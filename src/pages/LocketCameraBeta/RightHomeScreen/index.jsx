import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthLocket";
import { ChevronLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import ChatDetail from "./View/ChatDetail";
import SocketStatus from "./View/SocketStatus";
import { ConversationItem } from "./View/Conversation/ConversationItem";
import { markReadMessage } from "@/services";
import { ConversationSkeleton } from "./View/Conversation/ConversationSkeleton";
import { CONFIG } from "@/config";
import { useSocket } from "@/context/SocketContext";
import { useMessagesStore } from "@/stores";

const INITIAL_DISPLAY_COUNT = CONFIG.ui.chat.initialVisible;

// ================= Component: RightHomeScreen =================
const RightHomeScreen = ({ setIsHomeOpen }) => {
  const { user } = useContext(AuthContext);
  const { navigation } = useApp();
  const { isHomeOpen } = navigation;

  const { socket, isConnected } = useSocket();
  const [selectedChat, setSelectedChat] = useState(null); // conversation đang mở
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  const idToken = localStorage.getItem("idToken");

  const {
    messages,
    fetchConversations,
    upsertConversation,
    loading,
    conversations,
    getMessagesByUser,
    addMessageWithUserV2,
  } = useMessagesStore();

  const handleListMessage = (upsertConversation) => (data) => {
    if (!Array.isArray(data) || !data.length) return;
    data.forEach(upsertConversation);
  };

  const handleNewMessageWithUserV2 = (data) => {
    if (!data) return;

    const items = Array.isArray(data) ? data : [data];

    items.forEach((msg) => {
      const convId = msg.uid;
      if (!convId) return;

      addMessageWithUserV2(convId, msg);
    });
  };

  // ================= Socket init =================
  useEffect(() => {
    if (isHomeOpen || !socket) return;

    const handler = handleListMessage(upsertConversation);

    socket.on("new_on_list_message", handler);

    return () => {
      socket.off("new_on_list_message", handler); // gỡ đúng handler
    };
  }, [socket]); // << chỉ theo socket, không theo idToken

  // emit tách riêng
  useEffect(() => {
    if (isHomeOpen || !idToken || !socket) return;

    socket.emit("get_list_message", { timestamp: null, token: idToken });
  }, [idToken, socket]);
  // ================= Socket listener cho selectedChat =================
  useEffect(() => {
    if (!socket || !selectedChat?.uid) return;

    socket.on("new_message_with_user", handleNewMessageWithUserV2);

    socket.emit("get_messages_with_user", {
      messageId: selectedChat.uid,
      timestamp: null,
      token: idToken,
    });

    return () => {
      socket.off("new_message_with_user", handleNewMessageWithUserV2);
    };
  }, [socket, selectedChat?.uid]);

  // ================= Reset displayCount khi đóng isHomeOpen =================
  useEffect(() => {
    if (!isHomeOpen) {
      setDisplayCount(INITIAL_DISPLAY_COUNT);
    }
  }, [isHomeOpen]);

  // ================= Fetch conversations =================
  useEffect(() => {
    if (!idToken) return;
    fetchConversations();
  }, [idToken]);

  // ================= Chọn chat =================
  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);

    if (!chat?.uid) return;

    await getMessagesByUser(chat.uid);

    if (chat.isRead === false) {
      await markReadMessage(chat.uid);
    }
  };

  // ================= Load more conversations =================
  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 10);
  };

  // ================= Sắp xếp và lọc conversations =================
  const sortedMessages = conversations
    ?.slice()
    .sort(
      (a, b) =>
        Number(b.latestMessage?.createdAt || 0) -
        Number(a.latestMessage?.createdAt || 0)
    );

  const displayedMessages = sortedMessages.slice(0, displayCount);
  const remainingCount = sortedMessages.length - displayCount;

  const messagesByConversation = selectedChat?.uid
    ? messages[selectedChat.uid] || []
    : [];

  return (
    <>
      {/* ================= Conversation list ================= */}
      <div
        className={`fixed inset-0 flex flex-col transition-transform duration-500 bg-base-100 overflow-hidden
        ${
          isHomeOpen
            ? selectedChat
              ? "-translate-x-full"
              : "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="relative flex items-center shadow-lg justify-between px-4 py-2 text-base-content">
          <button
            onClick={() => {
              setIsHomeOpen(false);
              setSelectedChat(null);
            }}
            className="btn p-1 border-0 rounded-full hover:bg-base-200 transition cursor-pointer z-10"
          >
            <ChevronLeft size={30} />
          </button>
          <SocketStatus isConnected={isConnected} />
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto space-y-4">
          {loading ? (
            // Hiển thị skeleton khi đang loading
            Array.from({ length: INITIAL_DISPLAY_COUNT }).map((_, idx) => (
              <ConversationSkeleton key={idx} />
            ))
          ) : (
            <>
              {/* Danh sách conversations */}
              {displayedMessages.map((msg) => (
                <ConversationItem
                  key={msg.uid}
                  msg={msg}
                  onSelect={handleSelectChat}
                />
              ))}

              {/* Nút "Xem thêm" */}
              {remainingCount > 0 && (
                <button
                  onClick={handleLoadMore}
                  className="w-full py-3 mt-4 text-sm font-medium text-primary hover:bg-base-200 rounded-lg transition-colors duration-200"
                >
                  Xem thêm {remainingCount} cuộc hội thoại
                </button>
              )}

              {/* Thông báo khi không có conversations */}
              {sortedMessages.length === 0 && (
                <div className="text-center text-base-content/60 py-8">
                  Chưa có cuộc hội thoại nào
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ================= ChatDetail ================= */}
      <ChatDetail
        selectedChat={selectedChat}
        messages={messagesByConversation || []}
        setSelectedChat={setSelectedChat}
      />
    </>
  );
};

export default RightHomeScreen;
