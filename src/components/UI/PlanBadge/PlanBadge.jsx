import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthLocket';

const PlanBadge = ({ className = "" }) => {
  const { userPlan } = useContext(AuthContext);
  
  const planConfig = {
    free: {
      label: "Free",
      style: "bg-gray-400 text-gray-800",
      gradient: null
    },
    pro: {
      label: "Pro",
      style: "text-white",
      gradient: "linear-gradient(45deg, #3B82F6, #1D4ED8)" // Blue gradient
    },
    pro_plus: {
      label: "Pro Plus",
      style: "text-white", 
      gradient: "linear-gradient(45deg, #10B981, #059669)" // Green gradient
    },
    premium: {
      label: "Premium",
      style: "text-white",
      gradient: "linear-gradient(45deg, #7C3AED, #5B21B6)" // Purple gradient
    },
    default: {
      label: "No Plan",
      style: "bg-gray-300 text-gray-600",
      gradient: null
    }
  };

  const planId = userPlan?.plan_info?.id;
  const config = planConfig[planId] || planConfig.default;

  const baseClasses = "px-2 py-0.5 text-xs rounded-full font-semibold shadow-md ml-2";
  const combinedClasses = `${baseClasses} ${config.style} ${className}`;

  return (
    <span
      className={combinedClasses}
      style={config.gradient ? { backgroundImage: config.gradient } : {}}
    >
      {config.label}
    </span>
  );
};

export default PlanBadge;

// Usage example:
// import PlanBadge from './PlanBadge';
// 
// <PlanBadge />