import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { markReadMessage, markGroupAsRead } from "@/services";
import { CONFIG } from "@/config";
import { useSocket } from "@/context/SocketContext";
import { useAuthStore, useGroupChatStore, useMessagesStore, useUserInfoStore } from "@/stores";
import { mergeAndSortConversations } from "@/utils/mergeChatList";
import { useGroupRelay } from "@/hooks/useGroupRelay";
import HeaderConversation from "./Layout/HeaderConversation";
import ConversationWithUser from "./Views/ConversationWithUser";
import ConversationWithGroup from "./Views/ConversationWithGroup";
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
    loading: conversationsLoading,
    conversations,
    getMessagesByUser,
    getGroupMessagesAction,
    addMessageWithUserV2,
  } = useMessagesStore();

  const {
    groups,
    fetchGroups,
    loading: groupsLoading,
  } = useGroupChatStore();

  const loading = conversationsLoading || groupsLoading;

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

  // ================= Group WebSocket Relay =================
  const { status: relayStatus, sendReconnect } = useGroupRelay(
    idToken,
    user?.uid,
    !!idToken && !!user?.uid && isConnected,
  );

  // ================= Reset displayCount khi đóng isHomeOpen =================
  useEffect(() => {
    if (!isHomeOpen) {
      setDisplayCount(INITIAL_DISPLAY_COUNT);
    }
  }, [isHomeOpen]);

  const initUserInfo = useUserInfoStore((s) => s.init);

  // ================= Fetch conversations & groups =================
  useEffect(() => {
    if (!idToken) return;
    fetchConversations();
    fetchGroups();
    initUserInfo();
  }, [idToken]);

  // ================= Chọn chat =================
  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);

    if (!chat?.uid) return;

    if (chat.type === "group") {
      await getGroupMessagesAction(chat.uid);
      await markGroupAsRead({ groupId: chat.uid });
    } else {
      await getMessagesByUser(chat.uid);

      if (chat.isRead === false) {
        await markReadMessage(chat.uid);
      }
    }
  };

  // ================= Load more conversations =================
  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 10);
  };

  // ================= Merge & sắp xếp conversations + groups =================
  const sortedMessages = useMemo(
    () => mergeAndSortConversations(conversations, groups),
    [conversations, groups],
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
          relayStatus={relayStatus}
          sendReconnect={sendReconnect}
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

      {/* ================= Conversation Detail (Direct or Group) ================= */}
      {selectedChat?.type === "group" ? (
        <ConversationWithGroup
          selectedChat={selectedChat}
          messages={messagesByConversation || []}
          setSelectedChat={setSelectedChat}
          isLoading={conversationsLoading}
        />
      ) : (
        <ConversationWithUser
          selectedChat={selectedChat}
          messages={messagesByConversation || []}
          setSelectedChat={setSelectedChat}
        />
      )}
    </>
  );
};

export default RightHomeScreen;
