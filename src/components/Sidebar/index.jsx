import React, { useContext, useEffect } from "react";
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
import { useApp } from "../../context/AppContext";
import { AuthContext } from "../../context/AuthLocket";

const Sidebar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { navigation } = useApp();

  const { isSidebarOpen, setIsSidebarOpen } = navigation;

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isSidebarOpen]);

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
      {/* Overlay */}
      <div
        className={`fixed z-60 inset-0 bg-base-100/10 backdrop-blur-[2px] transition-opacity duration-500 ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed z-60 top-0 right-0 h-full w-60 shadow-xl transform transition-transform duration-300 bg-base-100 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
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
            onClick={() => setIsSidebarOpen(false)}
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
                    className={`flex items-center px-3 py-3 rounded-lg transition ${
                      location.pathname === "/home"
                        ? "bg-base-300"
                        : "hover:bg-base-200"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Home size={22} /> Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/timeline"
                    className={`flex items-center px-3 py-3 rounded-lg transition ${
                      location.pathname === "/timeline"
                        ? "bg-base-300"
                        : "hover:bg-base-200"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <LucideTimer size={22} /> Lịch sử
                  </Link>
                </li>
                <li>
                  <Link
                    to="/post"
                    className={`flex items-center px-3 py-3 rounded-lg transition ${
                      location.pathname === "/post"
                        ? "bg-base-300"
                        : "hover:bg-base-200"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Upload size={22} /> Đăng ảnh
                  </Link>
                </li>
                <li>
                  <Link
                    to="/postvideo"
                    className={`flex items-center px-3 py-3 rounded-lg transition ${
                      location.pathname === "/postvideo"
                        ? "bg-base-300"
                        : "hover:bg-base-200"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Upload size={22} /> Đăng Video
                  </Link>
                </li>
                <li>
                  <Link
                    to="/locket"
                    className={`flex items-center px-3 py-3 rounded-lg transition ${
                      location.pathname === "/locket"
                        ? "bg-base-300"
                        : "hover:bg-base-200"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Smartphone size={22} /> Locket UI
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className={`flex items-center px-3 py-3 rounded-lg transition ${
                      location.pathname === "/profile"
                        ? "bg-base-300"
                        : "hover:bg-base-200"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <User size={22} /> Hồ sơ
                  </Link>
                </li>
                <li className="mt-5">
                  <button
                    className="flex items-center w-full px-3 py-3 rounded-lg btn transition"
                    onClick={() => {
                      handleLogout();
                      setIsSidebarOpen(false);
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
                  className={`flex items-center w-full px-3 py-3 rounded-lg btn transition ${
                    location.pathname === "/login"
                      ? "bg-base-300"
                      : "hover:bg-base-200"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
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
