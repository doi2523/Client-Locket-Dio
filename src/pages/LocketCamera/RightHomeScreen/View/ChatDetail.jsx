import React, { useState, useRef, useMemo, useLayoutEffect } from "react";
import ChatDetailHeader from "../Layout/HeaderChatDetail";
import ChatDetailFooter from "../Layout/InputChatDetail";

// ================= Component: ChatMessageItem =================
const ChatMessageItem = ({ msg, selectedChat }) => {
  const me = localStorage.getItem("localId");
  const isMe = msg.sender === me;

  return (
    <div className={`chat ${isMe ? "chat-end" : "chat-start"}`} key={msg.id}>
      {/* Nội dung */}
      <div className="chat-bubble relative">
        {/* Reply */}
        {msg.reply_moment && (
          <div className="text-sm italic opacity-70">↪ {msg.reply_moment}</div>
        )}

        {/* Ảnh thumbnail */}
        {msg.thumbnail_url && (
          <img
            src={msg.thumbnail_url}
            alt="thumbnail"
            className="w-32 h-32 object-cover rounded-lg my-1"
          />
        )}

        {/* Text */}
        {msg.text}

        {/* Reactions */}
        {msg.reactions && msg.reactions.length > 0 && (
          <div className="absolute -top-4 -right-2 flex gap-1 bg-base-200 p-1 rounded-full shadow text-sm">
            {msg.reactions.map((r, idx) => (
              <span key={idx} title={r.sender}>
                {r.emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Thời gian */}
      <div className="chat-footer opacity-50 text-xs">
        {new Date(Number(msg.create_time) * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
};

// ================= Component: ChatDetail =================
const ChatDetail = ({ selectedChat, messages, setSelectedChat, isLoading }) => {
  const [message, setMessage] = useState("");
  const messagesContainerRef = useRef(null);

  // Sort tin nhắn theo thời gian tăng dần
  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => Number(a.create_time) - Number(b.create_time)
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
      className={`fixed inset-0 z-60 flex flex-col transition-transform duration-500 bg-base-100 
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
                .map((m) => [m.id, m]) // dùng id làm key trong Map
            ).values(),
          ].map((msg) => (
            <ChatMessageItem
              key={msg.id}
              msg={msg}
              selectedChat={selectedChat}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-4 z-10 p-2">
        <ChatDetailFooter selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default ChatDetail;
