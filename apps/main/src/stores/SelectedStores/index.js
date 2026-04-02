import { create } from "zustand";

export const useSelectedStore = create((set) => ({
  selectedMoment: null,
  setSelectedMoment: (moment) => set({ selectedMoment: moment }),

  selectedMomentId: null,
  setSelectedMomentId: (id) => set({ selectedMomentId: id }),

  selectedQueue: null,
  setSelectedQueue: (queue) => set({ selectedQueue: queue }),

  selectedQueueId: null,
  setSelectedQueueId: (id) => set({ selectedQueueId: id }),

  selectedFriendUid: null,
  setSelectedFriendUid: (uid) => set({ selectedFriendUid: uid }),

  showEmojiPicker: false,
  setShowEmojiPicker: (val) => set({ showEmojiPicker: val }),
}));
