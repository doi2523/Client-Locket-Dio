// src/hooks/useNavigation.js
import { useState } from "react";

export const useNavigation = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFriendsTabOpen, setFriendsTabOpen] = useState(false);

  return {
    isProfileOpen,
    setIsProfileOpen,
    isHomeOpen,
    setIsHomeOpen,
    isSidebarOpen, 
    setIsSidebarOpen,
    isFilterOpen,
    setIsFilterOpen,
    isBottomOpen, setIsBottomOpen,
    isFriendsTabOpen, setFriendsTabOpen,
  };
};
