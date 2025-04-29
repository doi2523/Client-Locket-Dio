import { ChevronRight, Menu } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import Sidebar from "../../../components/Sidebar";

const Navbar = () => {
  const { navigation } = useApp();
  const { setIsProfileOpen, setIsHomeOpen, setIsSidebarOpen } = navigation;

  return (
    <div className="navbar top-0 left-0 w-full px-4 py-2 flex items-center justify-between bg-base-100 z-50">
      {/* Avatar bên trái */}
      <button
        onClick={() => setIsProfileOpen(true)}
        className="relative flex items-center justify-center w-11 h-11 cursor-pointer"
      >
        {/* Vòng tròn nền */}
        <div className="bg-primary/50 backdrop-blur-3xl opacity-60 w-12 h-12 rounded-full absolute"></div>

        {/* Ảnh nằm trên và căn giữa */}
        <img
          src="/prvlocket.png"
          alt=""
          className="rounded-full h-10 w-10 relative backdrop-blur-3xl"
        />
      </button>

      {/* Nút bên phải */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsHomeOpen(true)}
          className="w-11 h-11 flex items-center justify-center bg-base-200 rounded-full hover:bg-base-300 transition"
        >
          <ChevronRight size={30} strokeWidth={2} />
        </button>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-11 h-11 flex items-center justify-center bg-base-200 rounded-full hover:bg-base-300 transition"
        >
          <Menu size={28} strokeWidth={2} />
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar />
    </div>
  );
};

export default Navbar;
