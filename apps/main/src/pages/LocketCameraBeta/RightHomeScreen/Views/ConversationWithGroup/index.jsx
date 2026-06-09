import React, { useRef, useMemo, useLayoutEffect, useState, useEffect } from "react";
import HeaderGroupChatDetail from "./HeaderGroupChatDetail";
import GroupMessageItem from "./GroupMessageItem";
import InputGroupChatDetail from "./InputGroupChatDetail";
import { useMessagesStore } from "@/stores";

const ConversationWithGroup = ({
  selectedChat,
  messages,
  setSelectedChat,
  isLoading,
}) => {
  const messagesContainerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);
  const prevScrollHeightRef = useRef(0);

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreGroupMessages = useMessagesStore((s) => s.loadMoreGroupMessages);

  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => Number(a.update_time) - Number(b.update_time),
    );
  }, [messages]);

  useLayoutEffect(() => {
    if (messagesContainerRef.current && sortedMessages.length > 0) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [selectedChat]);

  useLayoutEffect(() => {
    if (prevScrollHeightRef.current > 0 && messagesContainerRef.current) {
      const newScrollHeight = messagesContainerRef.current.scrollHeight;
      messagesContainerRef.current.scrollTop =
        newScrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = 0;
    }
  }, [sortedMessages]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !selectedChat?.uid) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (
          !entries[0].isIntersecting ||
          loadingMoreRef.current ||
          !hasMoreRef.current ||
          !selectedChat?.uid
        )
          return;

        loadingMoreRef.current = true;
        setLoadingMore(true);

        if (messagesContainerRef.current) {
          prevScrollHeightRef.current = messagesContainerRef.current.scrollHeight;
        }

        try {
          const more = await loadMoreGroupMessages(selectedChat.uid);
          hasMoreRef.current = more;
          setHasMore(more);
        } finally {
          setLoadingMore(false);
          setTimeout(() => {
            loadingMoreRef.current = false;
          }, 1000);
        }
      },
      { rootMargin: "200px 0px 0px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [selectedChat?.uid, loadMoreGroupMessages]);

  useEffect(() => {
    setHasMore(true);
    setLoadingMore(false);
    loadingMoreRef.current = false;
    hasMoreRef.current = true;
  }, [selectedChat?.uid]);

  return (
    <div
      className={`fixed inset-0 z-60 flex flex-col transition-transform duration-500 bg-base-100 text-base-content 
        ${selectedChat ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="sticky top-0 z-10 bg-base-100">
        <HeaderGroupChatDetail
          selectedChat={selectedChat}
          onBack={() => setSelectedChat(null)}
        />
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 h-full"
      >
        {hasMore && <div ref={loadMoreRef} className="h-4" />}

        {loadingMore && (
          <div className="flex justify-center py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-base-content"></div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col space-y-4">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="h-10 w-2/3 bg-base-300 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : sortedMessages.length === 0 ? (
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

      <div className="sticky bottom-4 z-10 p-2">
        <InputGroupChatDetail selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default ConversationWithGroup;
