import { create } from "zustand";

const defaultPostOverlay = {
  overlay_id: "standard",
  color_top: "",
  color_bottom: "",
  text_color: "#FFFFFF",
  icon: "",
  caption: "",
  type: "default",
  background: [],
};

export const useCaptionEditorStore = create((set) => ({
  overlayData: { ...defaultPostOverlay },

  updateOverlay: (data) =>
    set((state) => ({
      overlayData: { ...state.overlay, ...data },
    })),

  resetOverlay: () =>
    set({
      overlayData: { ...defaultPostOverlay },
    }),
}));
