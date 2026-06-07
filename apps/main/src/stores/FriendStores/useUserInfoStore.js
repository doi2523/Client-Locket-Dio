import { create } from "zustand";
import { fetchUserById } from "@/services";
import { normalizeFriendDataV2 } from "@/utils";
import { putUserInfo, getAllUserInfo } from "@/cache/userInfoDB";

export const useUserInfoStore = create((set, get) => ({
  userInfoMap: {},
  loadingSet: new Set(),

  init: async () => {
    const cached = await getAllUserInfo();
    const map = Object.fromEntries(
      cached.filter(Boolean).map((u) => [u.uid, u]),
    );
    set({ userInfoMap: map });
  },

  ensureUserInfo: async (uid) => {
    if (!uid) return null;
    const { userInfoMap, loadingSet } = get();

    if (userInfoMap[uid]) return userInfoMap[uid];
    if (loadingSet.has(uid)) return null;

    loadingSet.add(uid);
    set({ loadingSet: new Set(loadingSet) });

    try {
      const data = await fetchUserById(uid);
      if (data) {
        const normalized = normalizeFriendDataV2(data);
        set((s) => ({
          userInfoMap: { ...s.userInfoMap, [uid]: normalized },
        }));
        putUserInfo(normalized);
        return normalized;
      }
    } catch (err) {
      console.error("Failed to fetch user:", uid, err);
    } finally {
      loadingSet.delete(uid);
      set({ loadingSet: new Set(loadingSet) });
    }

    return null;
  },

  ensureUsers: async (uids) => {
    const { userInfoMap } = get();
    const missing = uids.filter(
      (uid) => uid && !userInfoMap[uid],
    );
    if (missing.length === 0) return;
    await Promise.allSettled(missing.map((uid) => get().ensureUserInfo(uid)));
  },
}));
