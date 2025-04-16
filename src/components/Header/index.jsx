import React, { useState, useContext } from "react";
import "./header.css";
import { Menu } from "lucide-react";
import Sidebar from "../Sidebar";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const Header = () => {
  const { navigation } = useApp();

  const { setIsSidebarOpen } = navigation;

  return (
    <>
      <header className="fixed z-50 shadow-md bg-base-100 navbar flex items-center justify-between px-6 py-3 text-base-content border-base-300">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-semibold gradient-text disable-select">
            Locket Pro
          </span>
          <img
            src="/icons8-heart-100.png"
            alt="Locket icon"
            className="w-7 h-7 object-contain -ml-1 disable-select"
            draggable="false"
          />
        </Link>

        <div className="flex items-center gap-2">
          {/* <ThemeDropdown /> */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md transition cursor-pointer btn"
          >
            <Menu size={28} strokeWidth={2} />
          </button>
        </div>
      </header>

      <Sidebar />
    </>
  );
};

export default Header;
