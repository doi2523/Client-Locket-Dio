import { useEffect, useState, useCallback } from "react";
import { GetAllMoments } from "@/services";
import { MOMENTS_CONFIG } from "@/config/configAlias";
import {
  bulkAddMoments,
  getAllMoments,
  getMomentsByUser,
} from "@/cache/momentDB";

export const useMoments = (user, selectedFriendUid, deps = []) => {
  const [moments, setMoments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(
    MOMENTS_CONFIG.initialVisible
  );
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // -------------------------------------------------------
  // 🎯 1) Fetch ban đầu: Local → API
  // -------------------------------------------------------
  useEffect(() => {
    const fetchMoments = async () => {
      if (!user) return;

      setLoading(true);

      try {
        let localData = [];

        // Load từ local
        localData =
          selectedFriendUid !== null
            ? await getMomentsByUser(selectedFriendUid)
            : await getAllMoments();

        if (localData?.length > 0) {
          setMoments(
            [...localData].sort((a, b) => b.createTime - a.createTime)
          );
        } else {
          setMoments([]);
        }

        // Sync API
        const apiData = await GetAllMoments({
          timestamp: Math.floor(Date.now() / 1000),
          friendId: selectedFriendUid,
          limit: MOMENTS_CONFIG.initialVisible,
        });

        if (!apiData) return;

        const sortedApi = [...apiData].sort(
          (a, b) => b.createTime - a.createTime
        );

        setMoments(sortedApi);
        await bulkAddMoments(apiData);
      } catch (err) {
        console.error("❌ Fetch moments error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoments();
  }, [user, selectedFriendUid]);

  // -------------------------------------------------------
  // 🎯 2) Load thêm bài cũ
  // -------------------------------------------------------
  const loadMoreOlder = useCallback(async () => {
    if (isLoadingMore || !hasMore || !moments.length) return;

    setIsLoadingMore(true);

    try {
      const lastCreateTime = moments[moments.length - 1].createTime;

      const older = await GetAllMoments({
        timestamp: lastCreateTime,
        friendId: selectedFriendUid,
        limit: MOMENTS_CONFIG.loadMoreLimit,
      });

      if (!older || older.length === 0) {
        setHasMore(false);
        return;
      }

      const existingIds = new Set(moments.map((m) => m.id));
      const filtered = older.filter((m) => !existingIds.has(m.id));

      if (filtered.length === 0) {
        setHasMore(false);
        return;
      }

      setMoments((prev) => [...prev, ...filtered]);
      await bulkAddMoments(filtered);

      if (older.length < MOMENTS_CONFIG.loadMoreLimit) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Load more error:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [moments, isLoadingMore, hasMore, selectedFriendUid]);

  // -------------------------------------------------------
  // 🎯 3) Add moment mới từ realtime
  // -------------------------------------------------------
  const addNewMoment = useCallback(async (newMoments) => {
    // newMoments có thể là mảng hoặc object, chuẩn hóa thành mảng
    const items = Array.isArray(newMoments) ? newMoments : [newMoments];

    setMoments((prev) => {
      // Lọc bỏ các moment trùng id
      const filtered = items.filter((m) => !prev.some((p) => p.id === m.id));
      if (filtered.length === 0) return prev;

      const updated = [...filtered, ...prev].sort(
        (a, b) => b.createTime - a.createTime
      );
      return updated;
    });

    await bulkAddMoments(items);
  }, []);

  // -------------------------------------------------------
  // 🎯 4) Reset visibleCount khi đổi người/bottom/profile/home
  // -------------------------------------------------------
  const resetVisible = () => {
    setVisibleCount(MOMENTS_CONFIG.initialVisible);
  };

  // -------------------------------------------------------
  // 🎯 5) Remove moment (state + local DB)
  // -------------------------------------------------------
  const removeMoment = useCallback(async (momentId) => {
    if (!momentId) return;

    setMoments((prev) => prev.filter((m) => m.id !== momentId));

    await deleteMomentById(momentId);
  }, []);

  return {
    moments,
    setMoments,
    loading,
    hasMore,
    visibleCount,
    setVisibleCount,
    loadMoreOlder,
    addNewMoment,
    removeMoment,
    resetVisible,
  };
};
