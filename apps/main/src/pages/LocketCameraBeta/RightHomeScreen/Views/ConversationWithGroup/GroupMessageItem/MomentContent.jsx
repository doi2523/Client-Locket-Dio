import React from "react";
import { OverlayRendererV2 } from "@/components/OverlayRender";

export const MomentContent = ({ moment }) => {
  if (!moment?.thumbnail_url) return null;
  return (
    <div className="mt-2">
      <div className="relative rounded-4xl overflow-hidden border border-base-300">
        <img src={moment.thumbnail_url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <OverlayRendererV2 overlays={moment.overlays} />
        </div>
      </div>
    </div>
  );
};
