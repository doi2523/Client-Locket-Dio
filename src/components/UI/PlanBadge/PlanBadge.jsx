import React, { useContext } from "react";
import { AuthContext } from "@/context/AuthLocket";

const PlanBadge = ({ className = "" }) => {
  const { userPlan } = useContext(AuthContext);

  const badge = userPlan?.plan_info?.ui?.badge;
  const gradient = userPlan?.plan_info?.ui?.gradient;

  if (!badge) return null; // Không có badge thì không hiển thị

  const combinedClasses =
    "px-2.5 py-1.5 text-xs rounded-full font-semibold shadow-md ml-2 " +
    className;

  return (
    <span
      className={combinedClasses}
      style={{
        background: gradient,
        color: userPlan?.plan_info?.ui?.highlight_color,
      }}
    >
      {badge}
    </span>
  );
};

export default PlanBadge;
