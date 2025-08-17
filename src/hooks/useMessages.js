// hooks/useMessages.js
import { GetAllMessage } from "@/services/LocketDioService/ChatServices";
import { useState, useEffect, useCallback } from "react";

export function useMessages(initialLimit = 20) {
  const [messages, setMessages] = useState([]);
  const [pageToken, setPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // 📌 Hàm fetch
  const fetchMessages = useCallback(
    async (isLoadMore = false) => {
      if (loading || (!hasMore && isLoadMore)) return;
      setLoading(true);
      try {
        const res = await GetAllMessage(pageToken, initialLimit);
        if (res?.data?.length) {
          setMessages((prev) =>
            isLoadMore ? [...prev, ...res.data] : res.data
          );
          setPageToken(res.nextPageToken || null);
          setHasMore(!!res.nextPageToken);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [pageToken, initialLimit, loading, hasMore]
  );

  // 📌 Tải lần đầu
  useEffect(() => {
    fetchMessages(false);
  }, []);

  return {
    messages,
    loading,
    error,
    hasMore,
    loadMore: () => fetchMessages(true),
    reload: () => {
      setPageToken(null);
      setHasMore(true);
      fetchMessages(false);
    },
  };
}
