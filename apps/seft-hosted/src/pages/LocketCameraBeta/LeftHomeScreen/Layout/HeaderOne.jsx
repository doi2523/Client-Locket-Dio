import { ChevronRight } from "lucide-react";
import React from "react";

function HeaderOne({ setIsProfileOpen }) {
  return (
    <div className="flex items-center justify-between px-4 py-1">
      <div className="font-lovehouse shadow/40 select-none backdrop-blur-2xl text-xl px-3 pt-1.5 border-3 border-amber-400 rounded-xl">
        Locket Dio
      </div>
      <button
        onClick={() => setIsProfileOpen(false)}
        className="btn btn-circle p-1 border-0 hover:bg-base-200 transition cursor-pointer"
      >
        <ChevronRight size={40} />
      </button>
    </div>
  );
}

export default HeaderOne;