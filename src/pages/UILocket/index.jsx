import React, { useContext } from "react";

import { AuthContext } from "../../context/AuthLocket.jsx";

import LeftHomeScreen from "./ExtendPage/leftHomeScreen.jsx";
import RightHomeScreen from "./ExtendPage/rightHomeScreen.jsx";
import MainHomeScreen from "./ExtendPage/mainHomeScreen.jsx";

import BottomHomeScreen from "./ExtendPage/bottomHomeScreen.jsx";
import Sidebar from "../../components/Sidebar/index.jsx";
import FriendsContainer from "./ExtendPage/Container/FriendsContainer.jsx";
import ScreenCustomeStudio from "./ExtendPage/Container/CustomeStudio.jsx";

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
      <BottomHomeScreen />

      <ScreenCustomeStudio />

      <FriendsContainer />

      <Sidebar />
    </>
  );
};

export default CameraCapture;
