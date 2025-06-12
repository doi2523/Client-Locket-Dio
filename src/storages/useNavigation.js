import { useEffect, useState } from "react";

const checkIfRunningAsPWA = () => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true || // iOS
    document.referrer.includes("android-app://")
  );
};

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
