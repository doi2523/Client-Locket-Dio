import { useEffect, useState } from "react";
import { checkIfRunningAsPWA } from "../utils/logic/checkIfRunningAsPWA";

export const useNavigation = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("isSidebarOpen");
    return saved === "true";
  });  
  const [isFriendsTabOpen, setFriendsTabOpen] = useState(false);
  const [isSettingTabOpen, setSettingTabOpen] = useState(false);
  const [isFullview, setIsFullview] = useState(() => {
    const saved = localStorage.getItem("isFullview");
    return saved === "true";
  });
  useEffect(() => {
    localStorage.setItem("isSidebarOpen", isSidebarOpen);
  }, [isSidebarOpen]);  
  // Lưu vào localStorage khi isFullview thay đổi
  useEffect(() => {
    localStorage.setItem("isFullview", isFullview);
  }, [isFullview]);

  // Tự động phát hiện nếu đang chạy dưới dạng PWA
  useEffect(() => {
    const isPWA = checkIfRunningAsPWA();
    if (isPWA) {
      setIsFullview(true);
    }
  }, []);

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
  };
};
