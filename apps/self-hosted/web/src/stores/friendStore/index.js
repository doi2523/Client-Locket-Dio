// src/store/friend/useFriendStore.js
import { create } from "zustand";
import {
  getAllFriendDetails,
  addFriendToCache,
  removeFriendToCache,
  putInfobyID,
} from "@/cache/friendsDB";
import { syncFriendsWithServer } from "./friend.sync";
import { addRemovedFriend } from "@/cache/diaryDB";

const sortCelebFirst = (list) =>
  [...list].sort((a, b) => {
    if (a.isCelebrity === b.isCelebrity) return 0;
    return a.isCelebrity ? -1 : 1;
  });

export const useFriendStoreV2 = create((set, get) => ({
  friendList: [],
  friendDetailsMap: {},
  friendRelationsMap: {},
  loading: false,

  // -------------------------
  // LOAD + SYNC (OFFLINE FIRST)
  // -------------------------
  loadFriends: async () => {
    set({ loading: true });

    try {
      // 1️⃣ Load local
      const local = await getAllFriendDetails();
      const sortedLocal = sortCelebFirst(local);

      set({
        friendList: sortedLocal,
        friendDetailsMap: Object.fromEntries(
          sortedLocal.map((f) => [f.uid, f]),
        ),
      });

      // 2️⃣ Sync server
      const { details, friendRelationsMap } = await syncFriendsWithServer();

      const sortedServer = sortCelebFirst(details);

      set({
        friendList: sortedServer, // ✅ QUAN TRỌNG
        friendDetailsMap: Object.fromEntries(
          sortedServer.map((f) => [f.uid, f]),
        ),
        friendRelationsMap: friendRelationsMap,
      });
    } finally {
      set({ loading: false });
    }
  },

  // -------------------------
  // MANUAL ADD
  // -------------------------
  addFriendLocal: async (friend) => {
    if (!friend?.uid) return;

    const createdAt = friend.createdAt || Date.now();

    await addFriendToCache({
      ...friend,
      createdAt,
    });

    set((state) => {
      const updatedMap = {
        ...state.friendDetailsMap,
        [friend.uid]: friend,
      };

      const updatedList = sortCelebFirst(Object.values(updatedMap));

      return {
        friendDetailsMap: updatedMap,
        friendList: updatedList, // ✅ đồng bộ list
        friendRelationsMap: {
          ...state.friendRelationsMap,
          [friend.uid]: { createdAt },
        },
      };
    });
  },

  // -------------------------
  // MANUAL HIDDEN
  // -------------------------
  hiddenUserState: async (uid, hidden) => {
    if (!uid) return;

    set((state) => ({
      friendRelationsMap: {
        ...state.friendRelationsMap,
        [uid]: {
          ...state.friendRelationsMap[uid],
          hidden,
        },
      },
    }));
    await putInfobyID({
      uid: uid,
      hidden: hidden,
    });
  },

  // -------------------------
  // MANUAL REMOVE
  // -------------------------
  removeFriendLocal: async (uid) => {
    await removeFriendToCache(uid);
    await addRemovedFriend(uid);

    set((state) => {
      const { [uid]: _, ...rest } = state.friendDetailsMap;

      const updatedList = sortCelebFirst(Object.values(rest));

      return {
        friendDetailsMap: rest,
        friendList: updatedList, // ✅ update luôn
      };
    });
  },

  clearFriends: () =>
    set({
      friendList: [],
      friendDetailsMap: {},
      friendRelationsMap: {},
    }),
}));
