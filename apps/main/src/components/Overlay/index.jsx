import { ColorPaletteOverlay } from "./overlays/ColorPaletteOverlay";
import BaseOverlay from "./overlays/BaseOverlay";
import ReviewOverlay from "./overlays/ReviewOverlay";
import MusicOverlay from "./overlays/MusicOverlay";

const OVERLAY_COMPONENTS = {
  caption: BaseOverlay,
  review: ReviewOverlay,
  music: MusicOverlay,
  color_palette: ColorPaletteOverlay,
};

export function OverlayRenderer({
  overlayData,
  momentId,
  isCaptionEditing = false,
}) {
  if (!overlayData) return null;

  const type = overlayData?.type || overlayData?.overlays?.type || "caption";

  const Component = OVERLAY_COMPONENTS[type];

  const overlay_id =
    overlayData?.id || overlayData?.overlay_id || "caption:standard";

  if (overlay_id === "caption:review")
    return <ReviewOverlay currentMoment={overlayData} />;

  if (overlay_id === "caption:color_palette")
    return <ColorPaletteOverlay overlayData={overlayData} />;

  if (!Component) return <BaseOverlay overlayData={overlayData} />;

  return (
    <Component overlayData={overlayData} momentId={momentId} isCaptionEditing={isCaptionEditing} />
  );
}
