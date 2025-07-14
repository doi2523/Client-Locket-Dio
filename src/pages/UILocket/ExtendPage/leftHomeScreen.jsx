import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { ChevronRight, Link, Settings } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import LoadingRing from "../../../components/UI/Loading/ring";
import { API_URL } from "../../../utils";
import BadgePlan from "./Badge";

const LeftHomeScreen = () => {
  const { user } = useContext(AuthContext);
  const { navigation, useloading } = useApp();
  const {
    isProfileOpen,
    setIsProfileOpen,
    isSettingTabOpen,
    setSettingTabOpen,
  } = navigation;
  const { imageLoaded, setImageLoaded } = useloading;

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isProfileOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isProfileOpen]);

  return (
    <div
      className={`fixed inset-0 flex flex-col transition-transform duration-500 z-50 bg-base-100 ${
        isProfileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header - luôn hiển thị với chiều cao cố định cho phần chính */}
      <div className="flex flex-col shadow-lg px-4 py-2 text-base-content relative bg-base-100 z-10">
        <div className="flex items-center justify-between relative z-40">
          <BadgePlan />
          <div className="flex items-center gap-3">
            <button onClick={() => setSettingTabOpen(true)}>
              <Settings size={30} />
            </button>
            <button
              onClick={() => setIsProfileOpen(false)}
              className="rounded-lg hover:bg-base-200 transition cursor-pointer"
            >
              <ChevronRight size={40} />
            </button>
          </div>
        </div>

        {/* User info section - thu gọn từ từ theo scroll */}
        <div className="relative overflow-hidden">
          <div className="flex flex-row justify-between items-center text-base-content w-full origin-top">
            <div className="flex flex-col text-center items-start space-y-1">
              <p className="text-2xl font-semibold whitespace-nowrap">
                {user?.displayName || "Name"}
              </p>
              <a
                href={`https://locket.cam/${user?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link underline font-semibold flex items-center justify-between whitespace-nowrap"
              >
                @{user?.username} <Link className="ml-2" size={18} />
              </a>
            </div>
            <div className="avatar w-18 h-18 disable-select flex-shrink-0">
              <div className="rounded-full shadow-md border-4 border-amber-400 p-1 flex justify-items-center">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingRing size={40} stroke={2} color="blue" />
                  </div>
                )}
                <img
                  src={user?.profilePicture || "/prvlocket.png"}
                  alt="Profile"
                  className={`w-19 h-19 transition-opacity duration-300 rounded-full ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts với smooth scrolling */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6"></div>
    </div>
  );
};

export default LeftHomeScreen;
