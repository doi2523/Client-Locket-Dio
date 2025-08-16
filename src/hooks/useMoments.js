// hooks/useMoments.js
import { useState, useEffect } from "react";
import {
  bulkAddMoments,
  clearMoments,
  getAllMoments,
  getMomentsByUser,
} from "@/cache/momentDB";
import api from "@/lib/axios";
import { showError, showSuccess } from "@/components/Toast";

export function useMoments(userUid = null, initialLimit = 50) {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(
    localStorage.getItem("nextPageToken") || null
  );
  const [lastFetchedTime, setLastFetchedTime] = useState(
    localStorage.getItem("lastFetchedTime") || null
  );

  const fetchFromCache = async () => {
    const data = userUid
      ? await getMomentsByUser(userUid)
      : await getAllMoments();
    const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setMoments(sorted);
  };

  const fetchFromAPI = async () => {
    try {
      setLoading(true);
      const res = await api.post("/locket/getMomentV2", {
        pageToken: nextPageToken,
        // userUid,
        limit: initialLimit,
      });

      const data = res.data.data || [];
      const token = res.data.nextPageToken;

      if (data.length > 0) {
        await bulkAddMoments(data);
        await fetchFromCache(); // reload cache
      }

      setNextPageToken(token || null);
      const now = new Date().toISOString();
      setLastFetchedTime(now);
      localStorage.setItem("lastFetchedTime", now);
    } catch (err) {
      console.error("❌ Lỗi fetchFromAPI:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshLatest = async () => {
    try {
      setLoading(true);
      let stop = false;
      let token = null;
      const newMoments = [];

      const cachedIds = new Set(moments.map((m) => m.id));

      let fetchCount = 0;
      const MAX_LOOP = 10; // để tránh gọi vô hạn

      while (!stop && fetchCount < MAX_LOOP) {
        const res = await api.post("/locket/getMomentV2", {
          limit: initialLimit,
          pageToken: token,
          userUid,
        });

        const data = res.data.data || [];
        token = res.data.nextPageToken || null;
        fetchCount++;

        if (data.length === 0) break;

        for (const item of data) {
          if (cachedIds.has(item.id)) {
            stop = true;
            break;
          }
          newMoments.push(item);
        }

        if (!token) break;
      }

      if (newMoments.length > 0) {
        await bulkAddMoments(newMoments);
        await fetchFromCache();
        showSuccess(`Đã làm mới ${newMoments.length} bài viết mới!`);
      } else {
        showSuccess("Không có bài mới nào.");
      }

      const now = new Date().toISOString();
      setLastFetchedTime(now);
      localStorage.setItem("lastFetchedTime", now);
      localStorage.setItem("nextPageToken", token || "");
    } catch (err) {
      console.error("❌ refreshLatest:", err);
      showError("Đã xảy ra lỗi khi làm mới bài viết.");
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    await clearMoments();
    localStorage.removeItem("nextPageToken");
    localStorage.removeItem("lastFetchedTime");
    setMoments([]);
    setNextPageToken(null);
    setLastFetchedTime(null);
  };

  useEffect(() => {
    fetchFromCache();
  }, [userUid]);

  return {
    moments,
    loading,
    fetchFromAPI,
    refreshLatest,
    clearCache,
    lastFetchedTime,
    nextPageToken,
  };
}
