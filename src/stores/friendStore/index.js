// src/store/friend/useFriendStore.js
import { create } from "zustand";
import {
  getAllFriendDetails,
  addFriendToCache,
  removeFriendToCache,
} from "@/cache/friendsDB";
import { syncFriendsWithServer } from "./friend.sync";
import { addRemovedFriend } from "@/cache/diaryDB";

export const useFriendStoreV2 = create((set) => ({
  friendDetailsMap: {},
  friendshipMap: {},
  loading: false,

  // -------------------------
  // LOAD + SYNC (OFFLINE FIRST)
  // -------------------------
  loadFriends: async () => {
    set({ loading: true });

    try {
      // 1️⃣ Render local trước
      const local = await getAllFriendDetails();
      set({
        friendDetailsMap: Object.fromEntries(local.map((f) => [f.uid, f])),
      });

      // 2️⃣ Sync server
      const { details, friendshipMap } = await syncFriendsWithServer();
      set({
        friendDetailsMap: Object.fromEntries(details.map((f) => [f.uid, f])),
        friendshipMap,
      });
    } finally {
      set({ loading: false });
    }
  },

  // -------------------------
  // MANUAL ADD (SYNC STATE + CACHE)
  // -------------------------
  addFriendLocal: async (friend) => {
    if (!friend?.uid) return;

    const createdAt = friend.createdAt || Date.now();

    // 1️⃣ Save to cache (ID + detail)
    await addFriendToCache({
      ...friend,
      createdAt,
    });

    // 2️⃣ Sync to Zustand state
    set((state) => ({
      friendDetailsMap: {
        ...state.friendDetailsMap,
        [friend.uid]: friend,
      },
      friendshipMap: {
        ...state.friendshipMap,
        [friend.uid]: { createdAt },
      },
    }));
  },

  // -------------------------
  // MANUAL REMOVE
  // -------------------------
  removeFriendLocal: async (uid) => {
    await removeFriendToCache(uid);
    await addRemovedFriend(uid);
    set((state) => {
      const { [uid]: _, ...rest } = state.friendDetailsMap;
      return { friendDetailsMap: rest };
    });
  },

  clearFriends: () => set({ friendDetailsMap: {} }),
}));
