import React, { lazy, Suspense } from "react";
import { useApp } from "@/context/AppContext";

import HeaderHome from "./Layout/HeaderHome";
import BottomMenu from "../BottomHomeScreen/Layout/BottomMenu";
import HistoryArrow from "./Layout/HistoryButton";
import ActionControls from "./ActionControls";
import MediaPreview from "./Layout/MediaPreview";

const BottomHomeScreen = lazy(() => import("../BottomHomeScreen"));
const SelectFriendsList = lazy(() => import("./Layout/SelectFriends"));

export default function MainHomeScreen() {
  const { navigation, camera, useloading, post } = useApp();

  const {
    isHomeOpen,
    isProfileOpen,
    isBottomOpen,
    isFullview,
    setIsHomeOpen,
    setIsProfileOpen,
    setIsBottomOpen,
    setFriendsTabOpen,
    setIsSidebarOpen,
    setOptionModalOpen,
    isFriendHistoryOpen,
    setFriendHistoryOpen,
  } = navigation;
  const { selectedFile } = post;

  return (
    <>
      <div
        className={`relative transition-all duration-500 flex flex-col justify-center items-center w-full h-[100vh] text-base-content ${
          isProfileOpen
            ? "translate-x-full"
            : isHomeOpen
            ? "-translate-x-full"
            : "translate-x-0"
        }`}
      >
        <HeaderHome
          setIsHomeOpen={setIsHomeOpen}
          setIsProfileOpen={setIsProfileOpen}
          setFriendsTabOpen={setFriendsTabOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isBottomOpen={isBottomOpen}
          setFriendHistoryOpen={setFriendHistoryOpen}
          isFriendHistoryOpen={isFriendHistoryOpen}
          selectedFile={selectedFile}
        />
        <div
          className={`w-full h-full flex flex-1 flex-col transition-all duration-500 justify-center items-center ${
            isBottomOpen ? "translate-x-0" : "fixed translate-y-full"
          }`}
        >
          <div className="w-full h-full overflow-y-auto">
            <div className="h-16" />
            <Suspense fallback={null}>
              <BottomHomeScreen />
            </Suspense>
          </div>
          {/* Click để đóng lịch sử */}
          <BottomMenu
            setIsBottomOpen={setIsBottomOpen}
            setOptionModalOpen={setOptionModalOpen}
          />
        </div>
        <div
          className={`w-full h-full flex flex-col transition-all duration-500 justify-evenly items-center ${
            isBottomOpen ? "fixed -translate-y-full" : "translate-x-0"
          }`}
        >
          <div className="h-10" />
          <MediaPreview />
          <ActionControls />
          {/* Click để mở lịch sử */}
          <div className="relative w-full">
            {/* SelectFriendsList */}
            <div
              className={`
              transition-all duration-300
              ${
                selectedFile
                  ? "opacity-100 visible"
                  : "opacity-0 invisible hidden"
              }
            `}
            >
              <Suspense fallback={null}>
                <SelectFriendsList />
              </Suspense>
            </div>

            {/* HistoryArrow */}
            <div
              className={`
              transition-all duration-300
              ${
                !selectedFile
                  ? "opacity-100 visible"
                  : "opacity-0 invisible hidden"
              }
            `}
            >
              <HistoryArrow setIsBottomOpen={setIsBottomOpen} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
