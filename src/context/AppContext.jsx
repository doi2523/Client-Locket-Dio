// src/context/AppContext.jsx
import { createContext, useContext } from "react";
import { useNavigation } from "../hooks/useNavigation";
import { useCamera } from "../hooks/useCamera";
import { useLoading } from "../hooks/useLoading";
import { usePost } from "../hooks/usePost";

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
        post
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
