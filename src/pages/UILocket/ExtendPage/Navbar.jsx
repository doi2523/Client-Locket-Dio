import { ChevronRight, Menu } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import Sidebar from "../../../components/Sidebar";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthLocket";

const Navbar = () => {
  const { navigation } = useApp();
  const { user } = useContext(AuthContext);
  const { setIsProfileOpen, setIsHomeOpen, setIsSidebarOpen, setFriendsTabOpen } = navigation;

  const handleClick = () => {
    // alert(
    //   "Sắp ra mắt!\n\nChức năng 'Bạn bè' đang được phát triển.\nHãy ủng hộ để giúp duy trì và phát triển trang web nhé ❤️\n\nDio"
    // );
    setFriendsTabOpen(false);
  };
  const friendCount = "??"; // hoặc props.friendCount

  return (
    <div className="navbar top-0 left-0 w-full px-4 py-2 flex items-center justify-between bg-base-100 z-50 relative">
      {/* Avatar bên trái */}
      <button
        onClick={() => setIsProfileOpen(true)}
        className="relative flex items-center justify-center w-11 h-11 cursor-pointer"
      >
        <div className="bg-primary/50 backdrop-blur-3xl opacity-60 w-11 h-11 rounded-full absolute"></div>
        <img
          src={user?.profilePicture || "/prvlocket.png"}
          alt=""
          className="rounded-full h-10 w-10 relative backdrop-blur-3xl"
        />
      </button>

      <button
        className="absolute flex justify-center items-center flex-row gap-2 left-1/2 transform -translate-x-1/2 text-lg font-semibold text-base-content bg-base-300 hover:bg-base-300 px-3 py-1.5 rounded-3xl"
        onClick={() => setFriendsTabOpen(true)}
      >
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
            clipRule="evenodd"
          />
        </svg>
        <span>{friendCount}</span> người bạn
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

      <Sidebar />
    </div>
  );
};

export default Navbar;
