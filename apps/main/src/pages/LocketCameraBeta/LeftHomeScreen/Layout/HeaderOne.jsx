import SettingPoup from "@/features/PoupScreen/SettingPoup";
import { ChevronRight, Settings } from "lucide-react";
import React, { useState } from "react";

function HeaderOne({ setIsProfileOpen }) {
  const [openSettingModal, setOpenSettingModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-1">
        <div className="font-lovehouse shadow/40 select-none backdrop-blur-2xl text-xl px-3 pt-1.5 border-3 border-amber-400 rounded-xl">
          Locket Dio
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenSettingModal(true)}
            className="btn btn-circle p-2 border-0 hover:bg-base-200 transition"
          >
            <Settings size={22} />
          </button>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="btn btn-circle p-1 border-0 hover:bg-base-200 transition cursor-pointer"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      </div>
      <SettingPoup
        open={openSettingModal}
        onClose={() => setOpenSettingModal(false)}
      />
    </>
  );
}

export default HeaderOne;
