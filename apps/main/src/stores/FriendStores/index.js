// src/store/friend/useFriendStoreV2.js
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

// state = {
//   friendList: ["uid1", "uid2", "uid3"], // chỉ UID (order)
//   friendDetailsMap: { uid1: {...} },    // info user
//   friendRelationsMap: { uid1: {...} }   // hidden, createdAt...
// }

export const useFriendStoreV2 = create((set, get) => ({
  friendList: [],
  friendDetailsMap: {},
  friendRelationsMap: {},
  loading: false,

  // -------------------------
  // 🔥 REBUILD LIST UID (SORT ORDER)
  // -------------------------
  rebuildFriendList: () => {
    const { friendDetailsMap, friendRelationsMap } = get();

    const merged = Object.keys(friendDetailsMap).map((uid) => ({
      uid,
      isCelebrity: friendRelationsMap[uid]?.isCelebrity ?? false,
      hidden: friendRelationsMap[uid]?.hidden ?? false,
      createdAt: friendRelationsMap[uid]?.createdAt ?? 0,
    }));

    const sorted = sortFriends(merged);

    // ⭐ chỉ lưu UID
    set({ friendList: sorted.map((f) => f.uid) });
  },

  // -------------------------
  // LOAD + SYNC
  // -------------------------
  loadFriends: async () => {
    set({ loading: true });

    try {
      // 1️⃣ Load local (offline first)
      const localDetails = await getAllFriendDetails();
      const detailsMap = buildFriendDetailsMap(localDetails);

      set({ friendDetailsMap: detailsMap });

      // build list từ local trước
      get().rebuildFriendList();

      // 2️⃣ Sync server
      const { details, friendRelationsMap } = await syncFriendsWithServer();

      const newDetailsMap = buildFriendDetailsMap(details);

      set({
        friendDetailsMap: newDetailsMap,
        friendRelationsMap: friendRelationsMap,
      });

      // rebuild lại order sau khi sync
      get().rebuildFriendList();
    } finally {
      set({ loading: false });
    }
  },

  // -------------------------
  // ADD FRIEND
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

    // ⭐ rebuild để sort lại
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

    // hidden có thể ảnh hưởng sort → rebuild
    // get().rebuildFriendList();
  },

  // -------------------------
  // REMOVE FRIEND
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

    // rebuild list UID
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
