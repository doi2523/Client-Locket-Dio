import { ColorPaletteOverlay } from "./overlays/ColorPaletteOverlay";
import BaseOverlay from "./overlays/BaseOverlay";
import ReviewOverlay from "./overlays/ReviewOverlay";
import MusicOverlay from "./overlays/MusicOverlay";
import PollOverlay from "./overlays/PollOverlay";

const OVERLAY_COMPONENTS = {
  caption: BaseOverlay,
  review: ReviewOverlay,
  music: MusicOverlay,
  color_palette: ColorPaletteOverlay,
  poll: PollOverlay,
};

export function OverlayRendererV2({
  overlays = [],
  momentId,
  isCaptionEditing = false,
  pollCounts = null,
  pollVariant = "friend",
}) {
  if (!Array.isArray(overlays) || overlays.length === 0) return null;

  // 👉 tìm overlay đầu tiên hợp lệ
  const overlay = overlays.find((o) => o?.overlay_type);

  if (!overlay) return null;

  const data = overlay.data || {};

  const type = data?.type || overlay.overlay_type || "caption";

  const Component = OVERLAY_COMPONENTS[type] || BaseOverlay;

  const overlay_id =
    data?.overlay_id || overlay?.overlay_id || "caption:standard";

  // special override cases
  if (overlay_id === "caption:review") {
    return <ReviewOverlay overlayData={data} />;
  }

  if (overlay_id === "caption:color_palette") {
    return <ColorPaletteOverlay overlayData={data} />;
  }

  return (
    <Component
      overlayData={data}
      momentId={momentId}
      isCaptionEditing={isCaptionEditing}
      pollCounts={type === "poll" ? pollCounts : undefined}
      pollVariant={type === "poll" ? pollVariant : undefined}
    />
  );
}