import React from "react";

export default function BottomToolBar({ tools, activeKey, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-base-100 border-t rounded-t-2xl border-base-300 shadow-md flex justify-around py-4 z-50 md:hidden">
      {tools.map((tool) => (
        <button
          key={tool.key}
          onClick={() => onChange(tool.key)}
          className={`flex flex-col items-center text-xs font-medium
            ${activeKey === tool.key ? "text-primary" : "text-base-content/70 hover:text-primary"}`}
          type="button"
        >
          {React.cloneElement(tool.icon, { size: 22 })}
          <span className="mt-1">{tool.label}</span>
        </button>
      ))}
    </nav>
  );
}
