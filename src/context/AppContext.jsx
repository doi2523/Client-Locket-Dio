// src/context/AppContext.jsx
import React, { createContext, useContext } from "react";
import {
  useCamera,
  useLoading,
  useNavigation,
  usePost,
  useThemes,
} from "../stores";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Sử dụng custom hooks
  const navigation = useNavigation();
  const camera = useCamera();
  const useloading = useLoading();
  const post = usePost();
  const captiontheme = useThemes();

  return (
    <AppContext.Provider
      value={{
        navigation,
        camera,
        useloading,
        post,
        captiontheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
