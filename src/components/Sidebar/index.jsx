import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Home,
  Upload,
  Smartphone,
  Briefcase,
  Rocket,
  Info,
  ShieldCheck,
  Wrench,
  Code2,
  BookText,
  UserCircle,
  Clock,
  Bug,
  Settings,
  Palette,
  UserRound,
  LifeBuoy,
  Package,
  SquareArrowOutUpRight,
  Heart,
} from "lucide-react";
import { showSuccess, showToast } from "../Toast";
import * as ultils from "@/utils";
import { useApp } from "@/context/AppContext";
import { AuthContext } from "@/context/AuthLocket";
import api from "@/lib/axios";
import { clearMoments } from "@/cache/momentDB";
import { MenuItem } from "./MenuItem";
import { AuthButton } from "./AuthButton";
import ThemeToggle from "./ThemeToggle";
import PlanBadge from "../ui/PlanBadge/PlanBadge";

const Sidebar = () => {
  const { user, resetAuthContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const { navigation } = useApp();
  const { isSidebarOpen, setIsSidebarOpen } = navigation;

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isSidebarOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    try {
      api.get(`${ultils.API_URL.LOGOUT_URL}`);
      resetAuthContext();
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

  // Menu chia theo nhóm
  const userMenuSections = [
    {
      title: "Locket Dio",
      items: [
        { to: "/home", icon: Home, text: "Trang chủ" },
        { to: "/aboutdio", icon: Briefcase, text: "Giới thiệu" },
        { to: "/timeline", icon: Clock, text: "Lịch sử Website" },
        {
          to: "/download",
          icon: SquareArrowOutUpRight,
          text: "Cài đặt WebApp",
        },
        { to: "/sponsors", icon: Heart, text: "Ủng hộ dự án" },
      ],
    },
    {
      title: "Tính năng",
      badge: <PlanBadge />,
      items: [
        { to: "/postmoments", icon: Upload, text: "Đăng ảnh, video" },
        { to: "/locket", icon: Smartphone, text: "Locket UI", badge: "Hot" },
        { to: "/manage", icon: Palette, text: "Quản lý Caption", badge: "New" },
        { to: "/tools", icon: Wrench, text: "Công cụ Locket" },
        { to: "/pricing", icon: Rocket, text: "Gói thành viên", badge: "New" },
        { to: "/profile", icon: UserRound, text: "Hồ sơ của bạn" },
      ],
    },
    {
      title: "Hệ thống & Hỗ trợ",
      items: [
        { to: "/devpage", icon: Code2, text: "Trang lập trình", badge: "New" },
        { to: "/incidents", icon: Bug, text: "Trung tâm sự cố" },
        { to: "/contact", icon: LifeBuoy, text: "Liên hệ & Hỗ trợ" },
        { to: "/privacy", icon: ShieldCheck, text: "Chính sách bảo mật" },
        { to: "/settings", icon: Settings, text: "Cài đặt" },
      ],
    },
  ];

  const guestMenuSections = [
    {
      title: "Locket Dio",
      items: [
        { to: "/", icon: Home, text: "Trang chủ" },
        { to: "/about", icon: Info, text: "Locket Dio" },
        { to: "/about-dio", icon: UserCircle, text: "Về Dio" },
        { to: "/timeline", icon: Clock, text: "Lịch sử Website" },
        {
          to: "/download",
          icon: SquareArrowOutUpRight,
          text: "Cài đặt WebApp",
        },
      ],
    },
    {
      title: "Tài nguyên",
      items: [
        { to: "/pricing", icon: Rocket, text: "Gói thành viên", badge: "New" },
        { to: "/collection", icon: Package, text: "Thư viện phiên bản" },
        { to: "/sponsors", icon: Heart, text: "Ủng hộ dự án" },
        { to: "/docs", icon: BookText, text: "Tài liệu" },
      ],
    },
    {
      title: "Hệ thống & Hỗ trợ",
      items: [
        { to: "/devpage", icon: Code2, text: "Trang lập trình", badge: "New" },
        { to: "/incidents", icon: Bug, text: "Trung tâm sự cố" },
        { to: "/contact", icon: LifeBuoy, text: "Liên hệ & Hỗ trợ" },
        { to: "/privacy", icon: ShieldCheck, text: "Chính sách bảo mật" },
        { to: "/settings", icon: Settings, text: "Cài đặt" },
      ],
    },
  ];

  const menuSections = user ? userMenuSections : guestMenuSections;

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
        className={`fixed z-60 top-0 right-0 h-full w-64 shadow-xl transition-all duration-500 bg-base-100 flex flex-col ${
          isSidebarOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center py-3 px-2 border-b border-base-300 flex-shrink-0">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-lg pl-2 font-semibold gradient-text select-none">
              Menu
            </span>
          </Link>
          <ThemeToggle />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-md transition cursor-pointer btn"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto">
          <ul className="menu text-base-content w-full py-2 text-md font-semibold">
            {menuSections.map((section) => (
              <li key={section.title}>
                <h2 className="menu-title flex items-center justify-between">
                  <span>{section.title}</span>
                  {section.badge && <div>{section.badge}</div>}
                </h2>
                <ul>
                  {section.items.map((item) => (
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
              </li>
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
