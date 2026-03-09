import React from "react";
import { useAuthStore } from "@/stores";

const PlanBadge = ({ className = "" }) => {
  const badge = useAuthStore((s) => s.userPlan?.plan?.badge);
  if (!badge) return null; // Không có badge thì không hiển thị

  const combinedClasses =
    "px-2.5 py-1.5 text-xs rounded-full font-semibold shadow-md ml-2 " +
    className;

  return (
    <span
      className={combinedClasses}
      style={{
        background: badge?.gradient,
        color: badge?.highlight_color,
      }}
    >
      {badge?.text}
    </span>
  );
};

export default PlanBadge;
