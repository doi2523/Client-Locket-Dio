import React from "react";
import { Link } from "react-router-dom";
// Helper components
export const MenuItem = ({ to, icon: Icon, children, badge, onClick }) => (
  <li>
    <Link
      to={to}
      className={`flex items-center px-3 py-2.5 mb-1 rounded-lg transition ${
        location.pathname === to ? "bg-base-300" : "hover:bg-base-200"
      }`}
      onClick={onClick}
    >
      <Icon size={22} /> {children}
      {badge && (
        <div className="badge badge-sm badge-secondary ml-auto">{badge}</div>
      )}
    </Link>
  </li>
);
