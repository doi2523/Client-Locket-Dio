import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  X,
  Home,
  Upload,
  User,
  LucideTimer,
  Smartphone,
  Briefcase,
  BookMarked,
  Rocket,
  Info,
  Mail,
  ShieldCheck,
  Wrench,
  Code2,
  BookText,
  UserCircle,
  Clock,
  Link2,
  Bug,
  Braces,
  Settings,
} from "lucide-react";
import { showSuccess, showToast } from "../Toast";
import * as ultils from "../../utils";
import { useApp } from "../../context/AppContext";
import { AuthContext } from "../../context/AuthLocket";
import api from "../../lib/axios";
import { clearMoments } from "../../cache/momentDB";
import { MenuItem } from "./MenuItem";
import { AuthButton } from "./AuthButton";

const Sidebar = () => {
  const { user, setUser, resetAuthContext } = useContext(AuthContext);
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
      api.get(`${ultils.API_URL.LOGOUT_URL}`);
      resetAuthContext(); // Reset context state
      ultils.clearAuthData();
      ultils.removeUser();
      ultils.clearAuthStorage();
      ultils.clearLocalData();

      await clearMoments();

      showSuccess("Đăng xuất thành công!");
      navigate("/login");
    } catch (error) {
      showToast("error", "Đăng xuất thất bại!");
      console.error("❌ Lỗi khi đăng xuất:", error);
    }
  };

  // Menu configurations
  const userMenuItems = [
    { to: "/home", icon: Home, text: "Trang chủ" },
    { to: "/aboutdio", icon: Briefcase, text: "Giới thiệu" },
    { to: "/timeline", icon: LucideTimer, text: "Lịch sử" },
    { to: "/postmoments", icon: Upload, text: "Đăng ảnh, video", badge: "Hot" },
    { to: "/locket", icon: Smartphone, text: "Locket UI", badge: "Hot" },
    { to: "/profile", icon: User, text: "Hồ sơ" },
    { to: "/pricing", icon: Rocket, text: "Gói thành viên", badge: "New" },
    { to: "/tools", icon: Wrench, text: "Công cụ Locket" },
    { to: "/docs", icon: BookMarked, text: "Docs" },
    { to: "/devpage", icon: Code2, text: "Trang lập trình", badge: "New" },
    { to: "/incidents", icon: Bug, text: "Trung tâm sự cố" },
    { to: "/settings", icon: Settings, text: "Cài đặt", badge: "New" },
  ];

  const guestMenuItems = [
    { to: "/", icon: Home, text: "Trang chủ" },
    { to: "/about", icon: Info, text: "Locket Dio" },
    { to: "/about-dio", icon: UserCircle, text: "Về Dio" },
    { to: "/contact", icon: Mail, text: "Liên hệ", badge: "Support" },
    { to: "/docs", icon: BookText, text: "Tài liệu" },
    { to: "/devpage", icon: Code2, text: "Trang lập trình" },
    { to: "/incidents", icon: Bug, text: "Trung tâm sự cố" },
    { to: "/reference", icon: Braces, text: "Tài liệu API" },
    { to: "/privacy", icon: ShieldCheck, text: "Riêng tư" },
    { to: "/timeline", icon: Clock, text: "Lịch sử" },
    { to: "/pricing", icon: Rocket, text: "Gói thành viên", badge: "New" },
    { to: "/settings", icon: Settings, text: "Cài đặt" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed h-screen z-60 inset-0 bg-base-100/10 backdrop-blur-[2px] transition-opacity duration-500 ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed z-60 top-0 right-0 h-full w-60 shadow-xl transition-all duration-500 bg-base-100 flex flex-col ${
          isSidebarOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center py-3 px-5 border-b border-base-300 flex-shrink-0">
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

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto">
          <ul className="menu bg-base-100 text-base-content w-full py-2 px-2 text-md font-semibold space-y-1">
            {(user ? userMenuItems : guestMenuItems).map((item) => (
              <MenuItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                badge={item.badge}
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.text}
              </MenuItem>
            ))}
          </ul>
        </div>

        {/* Auth Button */}
        <AuthButton
          user={user}
          onLogout={handleLogout}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div>
          <p className="text-center text-xs pb-2 text-base-content/70">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold font-lovehouse">Dio</span>. All
            rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
