import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { markReadMessage } from "@/services";
import { CONFIG } from "@/config";
import { useSocket } from "@/context/SocketContext";
import { useAuthStore, useMessagesStore } from "@/stores";
import HeaderConversation from "./Layout/HeaderConversation";
import ConversationWithUser from "./Views/ConversationWithUser";
import ConversationList from "./Views/ConversationList";

const INITIAL_DISPLAY_COUNT = CONFIG.ui.chat.initialVisible;

// ================= Component: RightHomeScreen =================
const RightHomeScreen = ({ setIsHomeOpen }) => {
  const { user } = useAuthStore();
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
        Number(a.latestMessage?.createdAt || 0),
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
        <HeaderConversation
          setIsHomeOpen={setIsHomeOpen}
          setSelectedChat={setSelectedChat}
          isConnected={isConnected}
        />
        <ConversationList
          onSelect={handleSelectChat}
          loading={loading}
          conversations={displayedMessages}
          handleLoadMore={handleLoadMore}
          remainingCount={remainingCount}
          initDisplayCount={INITIAL_DISPLAY_COUNT}
        />
      </div>

      {/* ================= ConversationWithUser ================= */}
      <ConversationWithUser
        selectedChat={selectedChat}
        messages={messagesByConversation || []}
        setSelectedChat={setSelectedChat}
      />
    </>
  );
};

export default RightHomeScreen;
