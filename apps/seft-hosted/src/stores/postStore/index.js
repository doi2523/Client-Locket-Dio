import { create } from "zustand";
import { defaultPostOverlay } from "./defaultOverlay";

export const usePostStore = create((set) => ({
  caption: "",
  setCaption: (c) => set({ caption: c }),

  selectedColors: { top: "", bottom: "", text: "#FFFFFF" },
  setSelectedColors: (colors) => set({ selectedColors: colors }),

  selectedFile: null,
  setSelectedFile: (file) => set({ selectedFile: file }),

  imageToCrop: null,
  setImageToCrop: (img) => set({ imageToCrop: img }),

  preview: null,
  setPreview: (p) => set({ preview: p }),

  isTextColor: null,
  setTextColor: (val) => set({ isTextColor: val }),

  isSizeMedia: null,
  setSizeMedia: (val) => set({ isSizeMedia: val }),

  postOverlay: defaultPostOverlay,
  setPostOverlay: (overlay) => set({ postOverlay: overlay }),

  audience: "all",
  setAudience: (val) => set({ audience: val }),

  selectedRecipients: [],
  setSelectedRecipients: (recipients) =>
    set({ selectedRecipients: recipients }),

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

  reactionInfo: { emoji: "💛", moment_id: null, intensity: 1000 },
  setReactionInfo: (info) => set({ reactionInfo: info }),

  restoreStreak: null,
  setRestoreStreak: (val) => set({ restoreStreak: val }),
}));
