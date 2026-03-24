import { getAllOverlayCaption } from "@/services";
import { create } from "zustand";

/* Check overlay có đang active không */
const isOverlayActive = (item) => {
  const now = new Date();

  if (item.start_at && new Date(item.start_at) > now) return false;
  if (item.end_at && new Date(item.end_at) < now) return false;

  if (item.daily_start_hour != null && item.daily_end_hour != null) {
    const hour = now.getHours() + now.getMinutes() / 60;
    if (hour < item.daily_start_hour || hour > item.daily_end_hour) {
      return false;
    }
  }

  return true;
};

export const useOverlayDataStore = create((set, get) => ({
  sectionOverlays: [],
  isLoading: false,
  error: null,

  fetchCaptionOverlays: async () => {
    if (get().sectionOverlays.length > 0) return;

    set({ isLoading: true, error: null });

    try {
      const cached = sessionStorage.getItem("overlaySections");
      if (cached) {
        set({
          sectionOverlays: JSON.parse(cached),
          isLoading: false,
        });
        return;
      }

      const result = await getAllOverlayCaption();

      // filter theo thời gian
      const sections = result.map((section) => ({
        ...section,
        items: section.items.filter(isOverlayActive),
      }));

      sessionStorage.setItem("overlaySections", JSON.stringify(sections));

      set({
        sectionOverlays: sections,
        isLoading: false,
      });
    } catch (err) {
      console.error(err);
      set({ error: err, isLoading: false });
    }
  },
}));