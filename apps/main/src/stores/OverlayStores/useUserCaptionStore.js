import { getCollabCaption } from "@/services";
import { create } from "zustand";

const USER_CAPTION_KEY = "Yourcaptions";

export const useOverlayUserStore = create((set, get) => ({
  /* ===============================
   *  USER CAPTIONS KANADE (LOCAL)
   * =============================== */
  userCaptions: JSON.parse(localStorage.getItem(USER_CAPTION_KEY) || "[]"),

  loadUserCaptions: () => {
    const saved = JSON.parse(localStorage.getItem(USER_CAPTION_KEY) || "[]");
    set({ userCaptions: saved });
  },

  addUserCaptionById: async (captionId) => {
    try {
      const result = await getCollabCaption(captionId);

      if (!result) throw new Error("Caption not found");

      const current = get().userCaptions;

      const updated = [result, ...current.filter((c) => c.id !== result.id)];

      localStorage.setItem(USER_CAPTION_KEY, JSON.stringify(updated));
      set({ userCaptions: updated });

      return { success: true };
    } catch (error) {
      console.error("Lỗi khi thêm caption:", error);
      return { success: false, error };
    }
  },

  removeUserCaption: (id) => {
    const updated = get().userCaptions.filter((c) => c.id !== id);
    localStorage.setItem(USER_CAPTION_KEY, JSON.stringify(updated));
    set({ userCaptions: updated });
  },

  clearUserCaptions: () => {
    localStorage.removeItem(USER_CAPTION_KEY);
    set({ userCaptions: [] });
  },
}));
