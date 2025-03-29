import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  X,
  Home,
  Upload,
  User,
  LogOut,
  LogIn,
  LucideTimer,
  Smartphone,
} from "lucide-react";
import { showToast } from "../Toast";
import * as locketService from "../../services/locketService";
import * as ultils from "../../utils";

const Sidebar = ({ isOpen, setIsOpen, user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await locketService.logout();
      setUser(null);
      ultils.clearAuthData();
      ultils.removeUser();
      showToast("success", "Đăng xuất thành công!");
      navigate("/login");
    } catch (error) {
      showToast("error", "Đăng xuất thất bại!");
      console.error("❌ Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-[55]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed z-60 top-0 right-0 h-full w-65 shadow-xl transform transition-transform duration-300 bg-base-100 border-l border-base-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center py-3 px-5 border-b border-base-300">
          <Link to="/" className="flex items-center gap-1">
            <img
              src="/icons8-heart-100.png"
              alt="Locket icon"
              className="w-8 h-8 object-contain select-none"
              draggable="false"
            />
            <span className="text-lg font-semibold gradient-text select-none">
              Menu
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md transition cursor-pointer btn"
          >
            <X size={24} />
          </button>
        </div>

        <div className="h-[calc(100vh-56px)] overflow-y-auto bg-base-100 text-base-content">
          <ul className="menu bg-base-100 text-base-content w-full py-4 px-2 text-md font-semibold space-y-1">
            {user ? (
              <>
                <li>
                  <Link
                    to="/home"
                    className={`flex items-center px-3 py-3 rounded-lg transition ${location.pathname === "/home" ? "bg-base-300" : "hover:bg-base-200"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Home size={22} /> Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/timeline"
                    className={`flex items-center px-3 py-3 rounded-lg transition ${location.pathname === "/timeline" ? "bg-base-300" : "hover:bg-base-200"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <LucideTimer size={22} /> Timeline
                  </Link>
                </li>
                <li>
                  <Link
                    to="/post"
                    className={`flex items-center px-3 py-3 rounded-lg transition ${location.pathname === "/post" ? "bg-base-300" : "hover:bg-base-200"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Upload size={22} /> Post
                  </Link>
                </li>
                <li>
                  <Link
                    to="/postvideo"
                    className={`flex items-center px-3 py-3 rounded-lg transition ${location.pathname === "/postvideo" ? "bg-base-300" : "hover:bg-base-200"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Upload size={22} /> Post Video
                  </Link>
                </li>
                <li>
                  <Link
                    to="/locket"
                    className={`flex items-center px-3 py-3 rounded-lg transition ${location.pathname === "/locket" ? "bg-base-300" : "hover:bg-base-200"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Smartphone size={22} /> Locket UI
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className={`flex items-center px-3 py-3 rounded-lg transition ${location.pathname === "/profile" ? "bg-base-300" : "hover:bg-base-200"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={22} /> Profile
                  </Link>
                </li>
                <li className="mt-5">
                  <button
                    className="flex items-center w-full px-3 py-3 rounded-lg btn transition"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut size={22} /> Đăng xuất
                  </button>
                </li>
              </>
            ) : (
              <li className="mt-5">
                <Link
                  to="/login"
                  className={`flex items-center w-full px-3 py-3 rounded-lg btn transition ${location.pathname === "/login" ? "bg-base-300" : "hover:bg-base-200"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={22} /> Đăng nhập
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;