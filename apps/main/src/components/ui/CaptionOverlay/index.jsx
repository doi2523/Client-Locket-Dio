import { ColorPaletteOverlay } from "@/components/OverlayRender/ColorPaletteOverlay";
import BaseOverlay from "./overlays/BaseOverlay";
import ReviewOverlay from "./overlays/ReviewOverlay";

const OVERLAY_COMPONENTS = {
  caption: BaseOverlay,
};

export function OverlayRenderer({ moment }) {
  const type = moment?.overlays?.type || "caption";
  const Component = OVERLAY_COMPONENTS[type];

  const overlay_id = moment?.overlays?.id || "caption:standard";

  if (overlay_id === "caption:review")
    return <ReviewOverlay currentMoment={moment} />;

  if (overlay_id === "caption:color_palette")
    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <ColorPaletteOverlay overlayData={moment?.overlays} />
      </div>
    );

  if (!Component) return null;

  return <Component currentMoment={moment} />;
}
