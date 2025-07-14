// src/context/AppContext.jsx
import React, { createContext, useContext } from "react";
import {
  ModalState,
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
  const modal = ModalState();

  return (
    <AppContext.Provider
      value={{
        navigation,
        camera,
        useloading,
        post,
        captiontheme,
        modal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
