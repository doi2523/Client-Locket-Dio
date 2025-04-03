import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { ChevronLeft, Menu } from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import ThemeSelector from "../../../components/Theme/ThemeSelector";
import MailForm from "../../../components/Forms/MailForm";

const RightHomeScreen = ({ isOpen, onClose }) => {
  const { user, setUser } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Khóa / Mở cuộn ngang khi mở sidebar
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 flex flex-col transition-transform duration-500 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} user={user} setUser={setUser} />

      {/* Navbar */}
      <div className="flex items-center shadow-lg justify-between px-4 py-3 text-base-content">
        <button onClick={onClose} className="p-2 rounded-md hover:bg-base-200 transition">
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

    </div>
  );
};

export default RightHomeScreen;
