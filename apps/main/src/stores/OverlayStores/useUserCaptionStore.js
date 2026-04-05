import { create } from "zustand";
import { getCollabCaption } from "@/services";

const USER_CAPTION_KEY = "Yourcaptions";

/* ===============================
 * Format + Migrate Caption
 * =============================== */
function formatCaption(item) {
  if (!item) return null;

  // Nếu đã là format overlay mới
  if (item.overlay_id && item.background) return item;

  // Convert từ server hoặc local format cũ
  return {
    overlay_id: item.overlay_id || `caption:${item.id}`,
    id: item.id,
    text: item.text || "",
    caption: item.caption || item.text || "",
    text_color: item.text_color || item.color || "#FFFFFF",

    icon:
      item.icon?.url || item.icon_url
        ? {
            data: item.icon?.url || item.icon_url,
            type: item.icon?.type || item.icon_type || "image",
            source: "url",
          }
        : {},

    type: item.type || "caption_icon",

    background: {
      colors:
        item.background?.colors ||
        (item.colortop && item.colorbottom
          ? [item.colortop, item.colorbottom]
          : []),
    },
    is_editable: true,
    color_top: item.color_top || item.colortop || "",
    color_bottom: item.color_bottom || item.colorbottom || "",
  };
}

/* ===============================
 * Load + Migrate LocalStorage
 * =============================== */
function loadAndMigrateCaptions() {
  try {
    const saved = JSON.parse(localStorage.getItem(USER_CAPTION_KEY) || "[]");

    const formatted = saved.map(formatCaption).filter(Boolean);

    // Chỉ save lại nếu data đã bị convert (migrate)
    const isDifferent =
      JSON.stringify(saved) !== JSON.stringify(formatted);

    if (isDifferent) {
      localStorage.setItem(USER_CAPTION_KEY, JSON.stringify(formatted));
      console.log("📦 Migrated captions to new format");
    }

    return formatted;
  } catch (err) {
    console.error("Load captions error:", err);
    return [];
  }
}

/* ===============================
 * Store
 * =============================== */
export const useOverlayUserStore = create((set, get) => ({
  userCaptions: loadAndMigrateCaptions(),

  loadUserCaptions: () => {
    const formatted = loadAndMigrateCaptions();
    set({ userCaptions: formatted });
  },

  addUserCaptionById: async (captionId) => {
    try {
      const result = await getCollabCaption(captionId);
      if (!result) throw new Error("Caption not found");

      const overlayCaption = formatCaption(result);
      const current = get().userCaptions;

      const updated = [
        overlayCaption,
        ...current.filter((c) => c.id !== overlayCaption.id),
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
    const updated = get().userCaptions.filter(
      (c) => c.id !== id,
    );
    localStorage.setItem(USER_CAPTION_KEY, JSON.stringify(updated));
    set({ userCaptions: updated });
  },

  clearUserCaptions: () => {
    localStorage.removeItem(USER_CAPTION_KEY);
    set({ userCaptions: [] });
  },
}));
