import { create } from "zustand";

const defaultState = {
  selectedFile: null,
  imageToCrop: null,
  preview: null,
  isSizeMedia: null,
  audience: "all",
  selectedRecipients: [],
  restoreStreakData: null,
  selectedGroupId: null,
};

export const usePostStore = create((set) => ({
  ...defaultState,

  setSelectedFile: (file) => set({ selectedFile: file }),
  setImageToCrop: (img) => set({ imageToCrop: img }),
  setPreview: (p) => set({ preview: p }),
  setSizeMedia: (val) => set({ isSizeMedia: val }),
  setAudience: (val) => set({ audience: val }),
  setSelectedRecipients: (recipients) =>
    set({ selectedRecipients: recipients }),
  setRestoreStreakData: (val) => set({ restoreStreakData: val }),
  setSelectedGroupId: (val) => set({ selectedGroupId: val }),

  resetPostStore: () => set(defaultState),
}));