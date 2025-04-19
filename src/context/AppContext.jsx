// src/context/AppContext.jsx
import { createContext, useContext } from "react";
import { useNavigation } from "../storages/useNavigation";
import { useCamera } from "../storages/useCamera";
import { useLoading } from "../storages/useLoading";
import { usePost } from "../storages/usePost";

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
