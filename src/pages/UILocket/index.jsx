import React, { useContext } from "react";

import { AuthContext } from "../../context/AuthLocket.jsx";

import LeftHomeScreen from "./ExtendPage/leftHomeScreen.jsx";
import RightHomeScreen from "./ExtendPage/rightHomeScreen.jsx";
import MainHomeScreen from "./ExtendPage/mainHomeScreen.jsx";

import ScreenCustomeStudio from "./ExtendPage/ScreenCustomeStudio.jsx";
import BottomHomeScreen from "./ExtendPage/bottomHomeScreen.jsx";

const CameraCapture = () => {
  const { user, setUser } = useContext(AuthContext);
  
  return (
    <>
      <MainHomeScreen />
      {/* left */}
      <LeftHomeScreen />
      {/* right */}
      <RightHomeScreen />
      {/* Cái này là giao diện phía dưới chứa các bài viết đã hoặc đăng */}
      <BottomHomeScreen/>
      <ScreenCustomeStudio/>
    </>
  );
};

export default CameraCapture;
