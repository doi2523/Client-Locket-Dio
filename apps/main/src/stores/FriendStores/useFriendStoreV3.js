import { create } from "zustand";
import {
  getAllFriendDetails,
  addFriendToCache,
  removeFriendToCache,
  putInfobyID,
} from "@/cache/friendsDB";
import { syncFriendsWithServer } from "./syncFriends";
import { addRemovedFriend } from "@/cache/diaryDB";
import { buildFriendDetailsMap } from "./buildFriendData";
import { sortFriends } from "./sortFriendData";

export const useFriendStoreV3 = create((set, get) => ({
  friendList: [],
  friendDetailsMap: {},
  friendRelationsMap: {},
  loading: false,

  // -------------------------
  // 🔥 REBUILD (OPTIMIZED)
  // -------------------------
  rebuildFriendList: () => {
    const { friendDetailsMap, friendRelationsMap, friendList } = get();

    const merged = Object.keys(friendDetailsMap).map((uid) => ({
      uid,
      isCelebrity: friendRelationsMap[uid]?.isCelebrity ?? false,
      hidden: friendRelationsMap[uid]?.hidden ?? false,
      createdAt: friendRelationsMap[uid]?.createdAt ?? 0,
    }));

    const newList = sortFriends(merged).map((f) => f.uid);

    // ✅ tránh set nếu không đổi (giảm re-render)
    if (
      newList.length === friendList.length &&
      newList.every((id, i) => id === friendList[i])
    ) {
      return;
    }

    set({ friendList: newList });
  },

  // -------------------------
  // ⚡ LOAD LOCAL ONLY
  // -------------------------
  loadFriendsLocalOnly: async () => {
    set({ loading: true });

    try {
      const localDetails = await getAllFriendDetails();

      const detailsMap = buildFriendDetailsMap(localDetails);

      const relationsMap = {};
      for (const f of localDetails) {
        relationsMap[f.uid] = {
          hidden: f.hidden ?? false,
          sharedHistoryOn: f.sharedHistoryOn ?? null,
          isCelebrity: f.isCelebrity ?? false,
          createdAt: f.createdAt ?? 0,
          updatedAt: f.updatedAt ?? null,
        };
      }

      set({
        friendDetailsMap: detailsMap,
        friendRelationsMap: relationsMap,
      });

      get().rebuildFriendList();
    } finally {
      set({ loading: false });
    }
  },

  // -------------------------
  // 🔄 LOAD + BACKGROUND SYNC
  // -------------------------
  loadFriends: async () => {
    // ⚡ load local trước (không block UI)
    get().loadFriendsLocalOnly();

    try {
      const res = await syncFriendsWithServer();

      // ❗ nếu fallback thì bỏ qua sync
      if (!res || res.isFallback) return;

      const { details, friendRelationsMap } = res;

      const newDetailsMap = buildFriendDetailsMap(details);

      set((state) => ({
        friendDetailsMap: {
          ...state.friendDetailsMap,
          ...newDetailsMap,
        },
        friendRelationsMap: {
          ...state.friendRelationsMap,
          ...friendRelationsMap,
        },
      }));

      get().rebuildFriendList();
    } catch (err) {
      console.error("syncFriends error:", err);
    }
  },

  // -------------------------
  // ADD
  // -------------------------
  addFriendLocal: async (friend) => {
    if (!friend?.uid) return;

    const createdAt = friend.createdAt || Date.now();

    await addFriendToCache({ ...friend, createdAt });

    set((state) => ({
      friendDetailsMap: {
        ...state.friendDetailsMap,
        [friend.uid]: friend,
      },
      friendRelationsMap: {
        ...state.friendRelationsMap,
        [friend.uid]: { createdAt },
      },
    }));

    get().rebuildFriendList();
  },

  // -------------------------
  // HIDDEN
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

    await putInfobyID({ uid, hidden });

    //chỉ rebuild nếu hidden ảnh hưởng sort
    get().rebuildFriendList();
  },

  // -------------------------
  // REMOVE
  // -------------------------
  removeFriendLocal: async (uid) => {
    await removeFriendToCache(uid);
    await addRemovedFriend(uid);

    set((state) => {
      const { [uid]: _, ...restDetails } = state.friendDetailsMap;
      const { [uid]: __, ...restRelations } = state.friendRelationsMap;

      return {
        friendDetailsMap: restDetails,
        friendRelationsMap: restRelations,
      };
    });

    get().rebuildFriendList();
  },

  // -------------------------
  // CLEAR
  // -------------------------
  clearFriends: () =>
    set({
      friendList: [],
      friendDetailsMap: {},
      friendRelationsMap: {},
    }),
}));
