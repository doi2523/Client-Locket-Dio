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

/* --------------------------------------------------
 * Default bucket
 * -------------------------------------------------- */
const defaultBucket = () => ({
  items: [],
  loading: false,
  hasMore: true,
  isLoadingMore: false,
  visibleCount: initialVisible,
});

/* --------------------------------------------------
 * Store
 * -------------------------------------------------- */
export const useMomentsStoreV2 = create((set, get) => ({
  momentsByUser: {},

  /* --------------------------------------------------
   * 🔧 Ensure bucket (SAFE – no race condition)
   * -------------------------------------------------- */
  ensureBucket: (key) => {
    set((state) => {
      if (state.momentsByUser[key]) return state;
      return {
        momentsByUser: {
          ...state.momentsByUser,
          [key]: defaultBucket(),
        },
      };
    });
  },

  /* --------------------------------------------------
   * 1️⃣ Fetch initial (Local → API)
   * -------------------------------------------------- */
  fetchMoments: async (user, selectedFriendUid = null) => {
    if (!user) return;

    const key = selectedFriendUid ?? "all";
    get().ensureBucket(key);

    // loading = true
    set((state) => {
      const bucket = state.momentsByUser[key] ?? defaultBucket();
      return {
        momentsByUser: {
          ...state.momentsByUser,
          [key]: {
            ...bucket,
            loading: true,
            hasMore: true,
            visibleCount: initialVisible,
          },
        },
      };
    });

    try {
      /* ---------- Local DB ---------- */
      const localData = selectedFriendUid
        ? await getMomentsByUser(selectedFriendUid)
        : await getAllMoments();

      if (localData?.length) {
        set((state) => {
          const bucket = state.momentsByUser[key] ?? defaultBucket();
          return {
            momentsByUser: {
              ...state.momentsByUser,
              [key]: {
                ...bucket,
                items: [...localData].sort(
                  (a, b) => b.createTime - a.createTime
                ),
              },
            },
          };
        });
      }

      /* ---------- API sync ---------- */
      const apiData = await GetAllMoments({
        timestamp: Math.floor(Date.now() / 1000),
        friendId: selectedFriendUid,
        limit: initialVisible,
      });

      if (apiData?.length) {
        set((state) => {
          const bucket = state.momentsByUser[key] ?? defaultBucket();
          const existingIds = new Set(bucket.items.map((i) => i.id));

          const merged = [
            ...bucket.items,
            ...apiData.filter((i) => !existingIds.has(i.id)),
          ].sort((a, b) => b.createTime - a.createTime);

          return {
            momentsByUser: {
              ...state.momentsByUser,
              [key]: {
                ...bucket,
                items: merged,
              },
            },
          };
        });

        await bulkAddMoments(apiData);
      }
    } catch (err) {
      console.error("❌ fetchMoments error:", err);
    } finally {
      set((state) => {
        const bucket = state.momentsByUser[key];
        if (!bucket) return state;
        return {
          momentsByUser: {
            ...state.momentsByUser,
            [key]: {
              ...bucket,
              loading: false,
            },
          },
        };
      });
    }
  },

  /* --------------------------------------------------
   * 2️⃣ Load more older
   * -------------------------------------------------- */
  loadMoreOlder: async (selectedFriendUid = null) => {
    const key = selectedFriendUid ?? "all";
    const bucket = get().momentsByUser[key];
    if (!bucket) return;

    if (bucket.isLoadingMore || !bucket.hasMore || !bucket.items.length) {
      return;
    }

    // set loading more
    set((state) => {
      const b = state.momentsByUser[key];
      if (!b) return state;
      return {
        momentsByUser: {
          ...state.momentsByUser,
          [key]: {
            ...b,
            isLoadingMore: true,
          },
        },
      };
    });

    try {
      const lastCreateTime = bucket.items[bucket.items.length - 1].createTime;

      const older = await GetAllMoments({
        timestamp: lastCreateTime,
        friendId: selectedFriendUid,
        limit: loadMoreLimit,
      });

      if (!older?.length) {
        set((state) => {
          const b = state.momentsByUser[key];
          if (!b) return state;
          return {
            momentsByUser: {
              ...state.momentsByUser,
              [key]: {
                ...b,
                hasMore: false,
              },
            },
          };
        });
        return;
      }

      set((state) => {
        const b = state.momentsByUser[key];
        if (!b) return state;

        const existingIds = new Set(b.items.map((i) => i.id));
        const filtered = older.filter((m) => !existingIds.has(m.id));

        return {
          momentsByUser: {
            ...state.momentsByUser,
            [key]: {
              ...b,
              items: [...b.items, ...filtered],
              hasMore: older.length === loadMoreLimit,
            },
          },
        };
      });

      await bulkAddMoments(older);
    } catch (err) {
      console.error("❌ loadMoreOlder error:", err);
    } finally {
      set((state) => {
        const b = state.momentsByUser[key];
        if (!b) return state;
        return {
          momentsByUser: {
            ...state.momentsByUser,
            [key]: {
              ...b,
              isLoadingMore: false,
            },
          },
        };
      });
    }
  },

  /* --------------------------------------------------
   * 3️⃣ Realtime add moment (Socket)
   * -------------------------------------------------- */
  addNewMoment: async (payload) => {
    const items = Array.isArray(payload) ? payload : [payload];
    if (!items.length) return;

    const dbQueue = [];

    set((state) => {
      const next = { ...state.momentsByUser };

      for (const m of items) {
        if (!m?.id) continue;

        const ownerUid = m.userUid || m.user || m.owner;
        const keys = [ownerUid ?? "all", "all"]; // 👈 add vào feed + all

        for (const key of keys) {
          if (!key) continue;

          const bucket = next[key] ?? defaultBucket();

          // ❌ duplicate
          if (bucket.items.some((i) => i.id === m.id)) continue;

          next[key] = {
            ...bucket,
            items: [m, ...bucket.items].sort(
              (a, b) => b.createTime - a.createTime
            ),
          };
        }

        dbQueue.push(m);
      }

      return { momentsByUser: next };
    });

    if (dbQueue.length) {
      await bulkAddMoments(dbQueue);
    }
  },

  syncMomentsSnapshot: async (snapshot) => {
    if (!Array.isArray(snapshot)) return;

    const snapshotIds = new Set(snapshot.map((m) => m.id));

    /* ---------- Update STORE ---------- */
    set((state) => {
      const next = { ...state.momentsByUser };

      const bucket = next["all"] ?? defaultBucket();

      next["all"] = {
        ...bucket,
        items: bucket.items.filter((m) => snapshotIds.has(m.id)),
      };

      return { momentsByUser: next };
    });

    /* ---------- Update IndexedDB ---------- */
    const local = await getAllMoments();
    const localIds = new Set(local.map((m) => m.id));

    const deletedIds = [...localIds].filter((id) => !snapshotIds.has(id));

    if (deletedIds.length) {
      await Promise.all(deletedIds.map(deleteMomentById));
    }

    await bulkAddMoments(snapshot);
  },

  /* --------------------------------------------------
   * 4️⃣ Remove moment
   * -------------------------------------------------- */
  removeMoment: async (momentId, ownerUid = null) => {
    const key = ownerUid ?? "all";
    const bucket = get().momentsByUser[key];
    if (!bucket) return;

    set((state) => ({
      momentsByUser: {
        ...state.momentsByUser,
        [key]: {
          ...bucket,
          items: bucket.items.filter((m) => m.id !== momentId),
        },
      },
    }));

    await deleteMomentById(momentId);
  },

  /* --------------------------------------------------
   * 5️⃣ Visible count
   * -------------------------------------------------- */
  increaseVisibleCount: (selectedFriendUid = null) => {
    const key = selectedFriendUid ?? "all";
    const bucket = get().momentsByUser[key];
    if (!bucket) return;

    if (bucket.visibleCount < bucket.items.length) {
      set((state) => ({
        momentsByUser: {
          ...state.momentsByUser,
          [key]: {
            ...bucket,
            visibleCount: Math.min(
              bucket.visibleCount + initialVisible,
              bucket.items.length
            ),
          },
        },
      }));
    }
  },

  resetVisible: (selectedFriendUid = null) => {
    const key = selectedFriendUid ?? "all";
    const bucket = get().momentsByUser[key];
    if (!bucket) return;

    set((state) => ({
      momentsByUser: {
        ...state.momentsByUser,
        [key]: {
          ...bucket,
          visibleCount: initialVisible,
        },
      },
    }));
  },
}));
