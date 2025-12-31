// src/store/useFriendStore.js
import { create } from "zustand";
import { addFriendToCache, getAllFriendDetails } from "@/cache/friendsDB";
import { fetchAndSyncFriendDetails } from "@/utils/SyncData/friendSyncUtils";

/**
 * friendDetails shape (V2):
 * {
 *   [uid]: { uid, displayName, profilePic, ... }
 * }
 */

export const useFriendStore = create((set, get) => ({
  friendDetails: {}, // ✅ OBJECT MAP
  loading: false,

  // ---------- helpers ----------
  _arrayToMap: (friends = []) =>
    Object.fromEntries(friends.map((f) => [f.uid, f])),

  // ---------- setters ----------
  setFriendDetails: (friends) =>
    set({
      friendDetails: Object.fromEntries(
        friends.map((f) => [f.uid, f])
      ),
    }),

  // ---------- load & sync ----------
  loadFriends: async (user, authTokens) => {
    if (!user || !authTokens?.idToken) return;

    set({ loading: true });

    try {
      // 1️⃣ Load local (IndexedDB)
      const localFriends = await getAllFriendDetails();
      set({
        friendDetails: Object.fromEntries(
          localFriends.map((f) => [f.uid, f])
        ),
      });

      // 2️⃣ Sync server (background)
      const updated = await fetchAndSyncFriendDetails();
      set({
        friendDetails: Object.fromEntries(
          updated.map((f) => [f.uid, f])
        ),
      });
    } catch (err) {
      console.error("⚠️ Sync friends failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  // ---------- mutations ----------
  addFriend: async (friend) => {
    await addFriendToCache(friend);

    set((state) => ({
      friendDetails: {
        ...state.friendDetails,
        [friend.uid]: friend,
      },
    }));
  },

  clearFriends: () =>
    set({
      friendDetails: {},
    }),
}));
