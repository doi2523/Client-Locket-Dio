import { create } from "zustand";

const defaultPostOverlay = {
  overlay_id: "standard",
  text: "",
  text_color: "#FFFFFF",
  icon: {},
  type: "default",
  background: {
    colors: [],
  },
  payload: {},

  caption: "",
  color_top: "",
  color_bottom: "",
};

export const useOverlayEditorStore = create((set) => ({
  overlayData: { ...defaultPostOverlay },

  updateOverlayEditor: (data) =>
    set((state) => ({
      overlayData: { ...state.overlayData, ...data },
    })),

  resetOverlayEditor: () =>
    set({
      overlayData: { ...defaultPostOverlay },
    }),
}));
