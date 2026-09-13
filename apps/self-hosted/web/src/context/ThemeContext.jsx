import React, { createContext, useEffect, useState } from "react";
import { applyTheme } from "@/utils/theme/themeUtils";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme); // chỉ cần gọi ở đây thôi
  };

  useEffect(() => {
    applyTheme(theme);
  }, []); // chỉ chạy 1 lần khi mount

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
