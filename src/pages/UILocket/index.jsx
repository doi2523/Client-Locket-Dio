import React, { useContext, lazy, Suspense } from "react";
import { AuthContext } from "../../context/AuthLocket.jsx";

// Giữ nguyên (không lazy)
import MainHomeScreen from "./ExtendPage/mainHomeScreen.jsx";
import BottomHomeScreen from "./ExtendPage/bottomHomeScreen.jsx";
import Sidebar from "../../components/Sidebar/index.jsx";
import Loading from "../../components/Loading/index.jsx";
import ScreenCustomeStudio from "./ExtendPage/Container/CustomeStudio.jsx";

// Lazy-load các component nặng
const FriendsContainer = lazy(() => import("./ExtendPage/Container/FriendsContainer.jsx"));
const SettingContainer = lazy(() => import("./ExtendPage/Container/SettingContainer.jsx"));
const LeftHomeScreen = lazy(() => import("./ExtendPage/leftHomeScreen.jsx"));
const RightHomeScreen = lazy(() => import("./ExtendPage/rightHomeScreen.jsx"));

const CameraCapture = () => {
  const { user, setUser } = useContext(AuthContext);

  return (
    <>
      <MainHomeScreen />
      <BottomHomeScreen />

      <Suspense fallback={<Loading/>}>
        <LeftHomeScreen />
        <RightHomeScreen />
      </Suspense>

      <Suspense fallback={<Loading/>}>
        <FriendsContainer />
        <SettingContainer />
        <ScreenCustomeStudio/>
      </Suspense>
      
      <Sidebar />
    </>
  );
};

export default CameraCapture;
