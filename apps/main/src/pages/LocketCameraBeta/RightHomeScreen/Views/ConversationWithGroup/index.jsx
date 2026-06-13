import React, { useRef, useMemo, useLayoutEffect, useState, useEffect, useCallback } from "react";
import HeaderGroupChatDetail from "./HeaderGroupChatDetail";
import InputGroupChatDetail from "./InputGroupChatDetail";
import { useMessagesStore, useGroupChatStore, useAuthStore } from "@/stores";
import GroupMessageItem from "./GroupMessageItem";

const PULL_THRESHOLD = 80;

const PullCircle = ({ progress }) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="text-base-content">
      <circle
        cx="20" cy="20" r={radius}
        fill="none" stroke="currentColor" strokeWidth="3"
        className="opacity-20"
      />
      <circle
        cx="20" cy="20" r={radius}
        fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 20 20)"
      />
    </svg>
  );
};

const ConversationWithGroup = ({
  selectedChat,
  messages,
  setSelectedChat,
  isLoading,
}) => {
  const messagesContainerRef = useRef(null);
  const prevScrollHeightRef = useRef(0);
  const hasScrolledToBottom = useRef(false);

  const [hasMore, setHasMore] = useState(true);
  const hasMoreRef = useRef(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [pullDistance, setPullDistance] = useState(0);
  const pullDistanceRef = useRef(0);
  const pullStartY = useRef(0);
  const isPulling = useRef(false);

  const loadMoreGroupMessages = useMessagesStore((s) => s.loadMoreGroupMessages);
  const groupFromStore = useGroupChatStore((s) =>
    s.groups.find((g) => g.id === selectedChat?.uid),
  );
  const currentUser = useAuthStore((s) => s.user);
  const isMember = useMemo(() => {
    if (!currentUser?.uid || !groupFromStore?.users) return true;
    return groupFromStore.users.some((u) => u.user_id === currentUser.uid);
  }, [currentUser?.uid, groupFromStore?.users]);

  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => Number(a.update_time) - Number(b.update_time),
    );
  }, [messages]);

  // Reset when switching chat
  useEffect(() => {
    setHasMore(true);
    setLoadingMore(false);
    hasMoreRef.current = true;
    setPullDistance(0);
    pullDistanceRef.current = 0;
    isPulling.current = false;
    hasScrolledToBottom.current = false;
  }, [selectedChat?.uid]);

  // Auto-scroll to bottom
  useLayoutEffect(() => {
    hasScrolledToBottom.current = false;
  }, [selectedChat]);

  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || sortedMessages.length === 0) return;

    if (!hasScrolledToBottom.current) {
      container.scrollTop = container.scrollHeight;
      hasScrolledToBottom.current = true;
      return;
    }

    const isNearBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 100;
    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [sortedMessages, selectedChat]);

  // Preserve scroll position after loading older messages
  useLayoutEffect(() => {
    if (prevScrollHeightRef.current > 0 && messagesContainerRef.current) {
      const newScrollHeight = messagesContainerRef.current.scrollHeight;
      messagesContainerRef.current.scrollTop =
        newScrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = 0;
    }
  }, [sortedMessages]);

  // Prevent native scroll while pulling
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handler = (e) => {
      if (isPulling.current) e.preventDefault();
    };

    container.addEventListener("touchmove", handler, { passive: false });
    return () => container.removeEventListener("touchmove", handler);
  }, []);

  const triggerLoadMore = useCallback(async () => {
    if (!selectedChat?.uid || !hasMoreRef.current) return;
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
    }
  }, [selectedChat?.uid, loadMoreGroupMessages]);

  const handleTouchStart = useCallback((e) => {
    const container = messagesContainerRef.current;
    if (!container || !hasMoreRef.current || loadingMore) return;
    if (container.scrollTop <= 5) {
      pullStartY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, [loadingMore]);

  const handleTouchMove = useCallback((e) => {
    if (!isPulling.current) return;
    const delta = e.touches[0].clientY - pullStartY.current;
    if (delta <= 0) {
      isPulling.current = false;
      setPullDistance(0);
      pullDistanceRef.current = 0;
      return;
    }
    const distance = Math.min(delta * 0.4, 120);
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
    pullDistanceRef.current = distance;
    setPullDistance(distance);
  }, []);

  const handleTouchEnd = useCallback(() => {
    isPulling.current = false;
    if (pullDistanceRef.current >= PULL_THRESHOLD && hasMoreRef.current && !loadingMore) {
      triggerLoadMore();
      setPullDistance(PULL_THRESHOLD);
    } else {
      setPullDistance(0);
      pullDistanceRef.current = 0;
    }
  }, [loadingMore, triggerLoadMore]);

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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="flex-1 overflow-y-auto"
      >
        {pullDistance > 0 && !loadingMore && (
          <div
            className="overflow-hidden"
            style={{
              height: pullDistance,
              transition: pullDistance === 0 ? "height 0.3s ease" : "none",
            }}
          >
            <div className="flex justify-center items-center h-full">
              <PullCircle progress={(pullDistance / PULL_THRESHOLD) * 100} />
            </div>
          </div>
        )}

        {loadingMore && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-base-content border-t-transparent" />
          </div>
        )}

        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="flex flex-col space-y-4">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-10 w-2/3 bg-base-300 rounded-lg animate-pulse"
                />
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
        <div className="h-18"/>
      </div>

      <div className="fixed w-full bottom-4 z-40 p-2 px-5">
        <InputGroupChatDetail selectedChat={selectedChat} chat_disabled={!isMember} />
      </div>
    </div>
  );
};

export default ConversationWithGroup;
