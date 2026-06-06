import React, { useRef, useMemo, useLayoutEffect } from "react";
import HeaderGroupChatDetail from "./HeaderGroupChatDetail";
import GroupMessageItem from "./GroupMessageItem";
import InputGroupChatDetail from "./InputGroupChatDetail";

// ================= Component: ConversationWithGroup =================
const ConversationWithGroup = ({
  selectedChat,
  messages,
  setSelectedChat,
  isLoading,
}) => {
  const messagesContainerRef = useRef(null);

  // Sắp xếp tin nhắn theo thời gian tăng dần để hiển thị
  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => Number(a.update_time) - Number(b.update_time),
    );
  }, [messages]);

  // Tự động scroll xuống cuối khi mở hoặc khi có tin nhắn mới
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
        <HeaderGroupChatDetail
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
          <div className="flex justify-center items-center h-full text-sm text-base-content/60 font-semibold">
            Chưa có tin nhắn nào trong nhóm
          </div>
        ) : (
          [
            ...new Map(
              sortedMessages
                .filter((msg) => msg && msg.id)
                .map((m) => [m.id, m]),
            ).values(),
          ].map((msg) => (
            <GroupMessageItem key={msg.id} msg={msg} />
          ))
        )}
      </div>

      {/* Footer / Input */}
      <div className="sticky bottom-4 z-10 p-2">
        <InputGroupChatDetail selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default ConversationWithGroup;
