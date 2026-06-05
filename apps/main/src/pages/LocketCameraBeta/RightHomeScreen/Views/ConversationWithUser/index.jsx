import React, { useState, useRef, useMemo, useLayoutEffect } from "react";
import ChatDetailHeader from "./HeaderChatDetail";
import InputChatDetail from "./InputChatDetail";
import MessageItem from "./MessageItem";

// ================= Component: ChatDetail =================
const ConversationWithUser = ({
  selectedChat,
  messages,
  setSelectedChat,
  isLoading,
}) => {
  const [message, setMessage] = useState("");
  const messagesContainerRef = useRef(null);

  // Sort tin nhắn theo thời gian tăng dần
  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => Number(a.create_time) - Number(b.create_time),
    );
  }, [messages]);

  // Auto scroll xuống cuối khi mở hoặc khi có tin nhắn mới
  useLayoutEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [sortedMessages, selectedChat]);

  return (
    <div
      className={`fixed inset-0 z-60 flex flex-col transition-transform duration-500 bg-base-100 text-base-content 
        ${selectedChat ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-base-100">
        <ChatDetailHeader
          selectedChat={selectedChat}
          onBack={() => setSelectedChat(null)}
        />
      </div>

      {/* Danh sách tin nhắn */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 h-full"
      >
        {isLoading ? (
          // Loading skeleton
          <div className="flex flex-col space-y-4">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="h-10 w-2/3 bg-base-300 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : sortedMessages.length === 0 ? (
          // Không có tin nhắn
          <div className="flex justify-center items-center h-full text-sm text-base-content/60">
            Chưa có tin nhắn nào
          </div>
        ) : (
          [
            ...new Map(
              sortedMessages
                .filter((msg) => msg && msg.id) // bỏ null/undefined
                .map((m) => [m.id, m]), // dùng id làm key trong Map
            ).values(),
          ].map((msg) => (
            <MessageItem key={msg.id} msg={msg} selectedChat={selectedChat} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-4 z-10 p-2">
        <InputChatDetail selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default ConversationWithUser;
