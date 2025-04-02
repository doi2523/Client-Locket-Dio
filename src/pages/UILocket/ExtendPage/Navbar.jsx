import { useState } from "react";
import { Menu } from "lucide-react";

const Navbar = ({ setIsProfileOpen, setIsHomeOpen }) => {
  return (
    <div className="navbar top-0 left-0 flex items-center justify-between px-6">
      <button
        onClick={() => setIsProfileOpen(true)}
        className="relative flex items-center justify-center w-12 h-12"
      >
        {/* Vòng tròn nền */}
        <div className="bg-base-content/20 w-12 h-12 rounded-full absolute"></div>

        {/* Ảnh nằm trên và căn giữa */}
        <img
          src="/prvlocket.png"
          alt=""
          className="rounded-full h-10 w-10 relative"
        />
      </button>
      <div className="flex items-center">
        {/* <ThemeDropdown /> */}
        <button
          onClick={() => setIsHomeOpen(true)}
          className="flex items-center justify-center p-2 transition cursor-pointer rounded-full bg-base-200 w-12 h-12"
        >
          <Menu size={30} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;