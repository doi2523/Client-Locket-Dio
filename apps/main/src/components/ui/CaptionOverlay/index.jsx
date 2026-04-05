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

  if (!Component) return null;

  return <Component currentMoment={moment} />;
}
