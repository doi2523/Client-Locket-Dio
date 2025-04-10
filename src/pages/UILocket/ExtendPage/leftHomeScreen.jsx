import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { ChevronRight, Settings } from "lucide-react";
import React from "react";
import LoadingRing from "../../../components/UI/Loading/ring";
import { useApp } from "../../../context/AppContext";

const LeftHomeScreen = () => {
  const { user, setUser } = useContext(AuthContext);
  
  const { navigation, useloading } = useApp();
  const { isProfileOpen, setIsProfileOpen } = navigation;
  const { imageLoaded, setImageLoaded} = useloading;
  // Khóa / Mở cuộn ngang khi component mở hoặc đóng
  useEffect(() => {
    if (isProfileOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden"); // Cleanup khi unmount
    };
  }, [isProfileOpen]);

  return (
    <div
      className={`fixed inset-0 h-screen flex flex-col transition-transform duration-500 z-50 ${
        isProfileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Navbar */}
      <div className="flex items-center shadow-lg justify-between px-4 pt-2 pb-4 text-base-content">
        <div className="font-lovehouse text-2xl font-semibold px-3 pt-1 border-base-content border rounded-xl">
          Locket Pro
        </div>
        <div className="flex items-center gap-3">
          <button>
            <Settings size={30} />
          </button>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="rounded-lg hover:bg-base-200 transition cursor-pointer"
          >
            <ChevronRight size={40} className="" />
          </button>
        </div>
      </div>

      {/* Nội dung */}
      <div className="flex flex-col items-center justify-start flex-1 px-4 overflow-y-scroll py-6 space-y-6">
        {/* Thông tin cơ bản */}
        <div className="flex flex-row items-center bg-base-200/50 border-base-300 text-base-content p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <div className="avatar relative w-24 h-24 disable-select">
            <div className=" rounded-full shadow-md outline-4 outline-amber-400 flex justify-items-center">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingRing size={40} stroke={2} color="blue" />
                </div>
              )}
              <img
                src={user?.profilePicture || "/default-avatar.png"}
                alt="Profile"
                className={`w-24 h-24 transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
          <div className="flex flex-col pl-5 text-center items-start space-y-1">
            <h2 className="text-2xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="font-semibold">{user?.email || "Không có email"}</p>
            <a
              href={`https://locket.cam/${user?.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link underline font-semibold"
            >
              https://locket.cam/{user?.username}
            </a>
          </div>
        </div>
        <h1 className="text-4xl">Helo qứoa</h1>
        <h1 className="text-4xl">Helo qứoa</h1>
        <h1 className="text-4xl">Helo qứoa</h1>
        <h1 className="text-4xl">Helo qứoa</h1>
        <h1 className="text-4xl">Helo qứoa</h1>
        <h1 className="text-4xl">Helo qứoa</h1>
        <h1 className="text-4xl">Helo qứoa</h1>
        <h1 className="text-4xl">Helo qứoa</h1>
        <h1 className="text-4xl">Helo qứoa</h1>
        <h1 className="text-4xl">Helo qứoa</h1>
        <h1 className="text-4xl">Helo qứoa</h1>
      </div>
    </div>
  );
};

export default LeftHomeScreen;
