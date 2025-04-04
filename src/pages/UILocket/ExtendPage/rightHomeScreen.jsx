import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { ChevronLeft, Menu } from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import ThemeSelector from "../../../components/Theme/ThemeSelector";
import MailForm from "../../../components/Forms/MailForm";
import { useApp } from "../../../context/AppContext";

const RightHomeScreen = () => {
  const { user, setUser } = useContext(AuthContext);
  const { navigation } = useApp();

  const { isHomeOpen, setIsHomeOpen, setIsSidebarOpen } = navigation;
  // Khóa / Mở cuộn ngang khi mở sidebar
  // useEffect(() => {
  //   document.body.classList.toggle("overflow-hidden", isHomeOpen);
  //   return () => document.body.classList.remove("overflow-hidden");
  // }, [isHomeOpen]);

  return (
    <div
      className={`fixed inset-0 flex flex-col transition-transform duration-500 z-50 ${
        isHomeOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Navbar */}
      <div className="flex items-center shadow-lg justify-between px-4 py-3 text-base-content">
        <button
          onClick={() => setIsHomeOpen(false)}
          className="p-2 rounded-md hover:bg-base-200 transition"
        >
          <ChevronLeft size={30} />
        </button>
        <div className="font-lovehouse text-2xl font-semibold px-4 pt-1.5 border rounded-xl">
          Locket Pro
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg bg-base-200 hover:bg-base-300 transition"
        >
          <Menu size={30} />
        </button>
      </div>
      {/* Nội dung */}
      <div className="flex flex-col flex-1 px-4 py-6 overflow-y-auto space-y-5 justify-start items-center">
        {/* <MailForm /> */}
        <ThemeSelector />
      </div>
      {/* Sidebar */}
      <Sidebar/>
    </div>
  );
};

export default RightHomeScreen;
