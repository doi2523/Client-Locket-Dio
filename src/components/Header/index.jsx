import React, { useState, useContext } from "react";
import "./header.css";
import { Menu } from "lucide-react";
import { AuthContext } from "../../context/AuthLocket";
import ThemeDropdown from "../Theme";
import Sidebar from "../Sidebar";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="navbar fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 shadow-xsm bg-base-100 text-base-content border-base-300">
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
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-md transition cursor-pointer btn"
          >
            <Menu size={28} strokeWidth={2} />
          </button>
        </div>
      </header>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} user={user} setUser={setUser} />
    </>
  );
};

export default Header;
