import { useEffect, useState } from "react";
import { checkIfRunningAsPWA } from "@/utils/logic/checkIfRunningAsPWA";

export const useNavigation = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFriendsTabOpen, setFriendsTabOpen] = useState(false);
  const [isSettingTabOpen, setSettingTabOpen] = useState(false);
  const [isFullview, setIsFullview] = useState(() => {
    const saved = localStorage.getItem("isFullview");
    return saved === "true";
  });
  const [isPWA, setIsPWA] = useState(() => {
    const saved = localStorage.getItem("isPWA");
    return saved === "true";
  });

  // Lưu vào localStorage khi isFullview thay đổi
  useEffect(() => {
    localStorage.setItem("isFullview", isFullview);
    localStorage.setItem("isPWA", isPWA);
  }, [isFullview, isPWA]);

  // Tự động phát hiện nếu đang chạy dưới dạng PWA
  useEffect(() => {
    const isPWA = checkIfRunningAsPWA();
    if (isPWA) {
      setIsFullview(true);
      setIsPWA(true);
    }
  }, []);

  const [showFlyingEffect, setShowFlyingEffect] = useState(false);
  const [flyingEmojis, setFlyingEmojis] = useState(null);

  return {
    isProfileOpen,
    setIsProfileOpen,
    isHomeOpen,
    setIsHomeOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    isFilterOpen,
    setIsFilterOpen,
    isBottomOpen,
    setIsBottomOpen,
    isFriendsTabOpen,
    setFriendsTabOpen,
    isFullview,
    setIsFullview,
    isSettingTabOpen,
    setSettingTabOpen,
    showFlyingEffect,
    setShowFlyingEffect,
    flyingEmojis,
    setFlyingEmojis,
    isPWA, setIsPWA
  };
};
