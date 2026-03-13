// stores/useOverlayStore.js
import { create } from "zustand";
import { getAllOverlayCaption, getCollabCaption } from "@/services";

const USER_CAPTION_KEY = "Yourcaptions";

const sortByOrderIndex = (themes) => {
  return [...themes].sort(
    (a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999)
  );
};

const groupThemesByType = (themes) => ({
  decorative: sortByOrderIndex(themes.filter((t) => t.type === "decorative")),
  custome: sortByOrderIndex(themes.filter((t) => t.type === "custome")),
  background: sortByOrderIndex(themes.filter((t) => t.type === "background")),
  image_icon: sortByOrderIndex(themes.filter((t) => t.type === "image_icon")),
  image_gif: sortByOrderIndex(themes.filter((t) => t.type === "image_gif")),
  special: sortByOrderIndex(themes.filter((t) => t.type === "special")),
});

export const useOverlayStore = create((set, get) => ({
  captionOverlays: {
    decorative: [],
    custome: [],
    background: [],
    image_icon: [],
    image_gif: [],
    special: [],
  },
  isLoading: false,
  error: null,

  fetchCaptionOverlays: async () => {
    // tránh gọi API nhiều lần
    if (get().captionOverlays.decorative.length > 0) return;

    set({ isLoading: true, error: null });

    try {
      // check sessionStorage
      const cached = sessionStorage.getItem("captionOverlays");
      if (cached) {
        set({
          captionOverlays: JSON.parse(cached),
          isLoading: false,
        });
        return;
      }

      const result = await getAllOverlayCaption();
      const grouped = groupThemesByType(result);

      sessionStorage.setItem("captionOverlays", JSON.stringify(grouped));

      set({
        captionOverlays: grouped,
        isLoading: false,
      });
    } catch (err) {
      console.error("Lỗi khi fetch themes:", err);
      set({
        error: err,
        isLoading: false,
      });
    }
  },

  // optional: clear cache khi cần
  clearCaptionOverlays: () => {
    sessionStorage.removeItem("captionOverlays");
    set({
      captionOverlays: {
        decorative: [],
        custome: [],
        background: [],
        image_icon: [],
        image_gif: [],
        special: [],
      },
    });
  },

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

      const updated = [
        result,
        ...current.filter((c) => c.id !== result.id),
      ];

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
