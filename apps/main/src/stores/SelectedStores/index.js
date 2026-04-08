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

// const selectedMoment = useSelectedStore((s) => s.selectedMoment);
// const setSelectedMoment = useSelectedStore((s) => s.setSelectedMoment);

// const selectedQueue = useSelectedStore((s) => s.selectedQueue);
// const setSelectedQueue = useSelectedStore((s) => s.setSelectedQueue);

// const selectedMomentId = useSelectedStore((s) => s.selectedMomentId);
// const setSelectedMomentId = useSelectedStore((s) => s.setSelectedMomentId);

// const selectedQueueId = useSelectedStore((s) => s.selectedQueueId);
// const setSelectedQueueId = useSelectedStore((s) => s.setSelectedQueueId);

// const selectedFriendUid = useSelectedStore((s) => s.selectedFriendUid);
// const setSelectedFriendUid = useSelectedStore((s) => s.setSelectedFriendUid);
