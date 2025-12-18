// src/store/momentsStore.js
import { create } from "zustand";
import { GetAllMoments } from "@/services";
import { MOMENTS_CONFIG } from "@/config/configAlias";
import {
  bulkAddMoments,
  deleteMomentById,
  getAllMoments,
  getMomentsByUser,
} from "@/cache/momentDB";

const { initialVisible, loadMoreLimit } = MOMENTS_CONFIG;

export const useMomentsStore = create((set, get) => ({
  moments: [],
  loading: false,
  hasMore: true,
  visibleCount: initialVisible,
  isLoadingMore: false,

  // -------------------------------------------------------
  // 1️⃣ Fetch ban đầu: Local → API
  // -------------------------------------------------------
  fetchMoments: async (user, selectedFriendUid = null) => {
    if (!user) return;

    set({ loading: true });

    try {
      // Load từ local DB
      let localData = selectedFriendUid
        ? await getMomentsByUser(selectedFriendUid)
        : await getAllMoments();

      if (localData?.length > 0) {
        set({
          moments: [...localData].sort((a, b) => b.createTime - a.createTime),
        });
      } else {
        set({ moments: [] });
      }

      // Sync API
      const apiData = await GetAllMoments({
        timestamp: Math.floor(Date.now() / 1000),
        friendId: selectedFriendUid,
        limit: initialVisible,
      });

      if (apiData?.length > 0) {
        const sortedApi = [...apiData].sort(
          (a, b) => b.createTime - a.createTime
        );
        set({ moments: sortedApi });
        await bulkAddMoments(apiData);
      }
    } catch (err) {
      console.error("❌ Fetch moments error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // -------------------------------------------------------
  // 2️⃣ Load thêm bài cũ
  // -------------------------------------------------------
  loadMoreOlder: async (selectedFriendUid = null) => {
    const { isLoadingMore, hasMore, moments } = get();
    if (isLoadingMore || !hasMore || !moments.length) return;

    set({ isLoadingMore: true });

    try {
      const lastCreateTime = moments[moments.length - 1].createTime;

      const older = await GetAllMoments({
        timestamp: lastCreateTime,
        friendId: selectedFriendUid,
        limit: loadMoreLimit,
      });

      if (!older || older.length === 0) {
        set({ hasMore: false });
        return;
      }

      const existingIds = new Set(moments.map((m) => m.id));
      const filtered = older.filter((m) => !existingIds.has(m.id));

      if (filtered.length === 0) {
        set({ hasMore: false });
        return;
      }

      set({ moments: [...moments, ...filtered] });
      await bulkAddMoments(filtered);

      if (older.length < loadMoreLimit) {
        set({ hasMore: false });
      }
    } catch (err) {
      console.error("Load more error:", err);
    } finally {
      set({ isLoadingMore: false });
    }
  },

  // -------------------------------------------------------
  // 3️⃣ Add moment mới từ realtime
  // -------------------------------------------------------
  addNewMoment: async (newMoments) => {
    const items = Array.isArray(newMoments) ? newMoments : [newMoments];
    const { moments } = get();

    const filtered = items.filter((m) => !moments.some((p) => p.id === m.id));
    if (filtered.length === 0) return;

    set({
      moments: [...filtered, ...moments].sort(
        (a, b) => b.createTime - a.createTime
      ),
    });
    await bulkAddMoments(items);
  },

  // -------------------------------------------------------
  // 4️⃣ Reset visibleCount
  // -------------------------------------------------------
  resetVisible: () => set({ visibleCount: initialVisible }),

  // -------------------------------------------------------
  // 5️⃣ Remove moment
  // -------------------------------------------------------
  removeMoment: async (momentId) => {
    if (!momentId) return;

    const { moments } = get();
    set({ moments: moments.filter((m) => m.id !== momentId) });

    await deleteMomentById(momentId);
  },

  // -------------------------------------------------------
  // 6️⃣ Tăng visibleCount khi scroll / xem thêm
  // -------------------------------------------------------
  increaseVisibleCount: () => {
    const { visibleCount, moments } = get();
    if (visibleCount < moments.length) {
      set({
        visibleCount: Math.min(visibleCount + initialVisible, moments.length),
      });
    }
  },
}));
