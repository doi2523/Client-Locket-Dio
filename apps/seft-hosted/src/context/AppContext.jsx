// src/context/AppContext.jsx
import React, { createContext, useContext } from "react";
import {
  useCamera,
  useLoading,
  useNavigation,
  usePost,
} from "../stores";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Sử dụng custom hooks
  const navigation = useNavigation();
  const camera = useCamera();
  const useloading = useLoading();
  const post = usePost();

  return (
    <AppContext.Provider
      value={{
        navigation,
        camera,
        useloading,
        post,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
