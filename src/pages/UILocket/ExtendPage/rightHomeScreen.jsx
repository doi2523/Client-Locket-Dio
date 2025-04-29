import { useContext } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { ChevronLeft, Menu } from "lucide-react";
import ThemeSelector from "../../../components/Theme/ThemeSelector";
import MailForm from "../../../components/UI/SupportForms/MailForm";
import { useApp } from "../../../context/AppContext";
import FeatureList from "../../../components/UI/FeatureList";

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
      className={`fixed inset-0 flex flex-col transition-transform duration-500 z-50 bg-base-100 ${
        isHomeOpen ? "translate-x-0" : "translate-x-full"
      } overflow-hidden`} // ❌ Không cuộn div to
    >
      <div className="relative flex items-center shadow-lg justify-between px-4 py-2 text-base-content">
        <button
          onClick={() => setIsHomeOpen(false)}
          className="btn p-1 border-0 rounded-full hover:bg-base-200 transition cursor-pointer z-10"
        >
          <ChevronLeft size={30} />
        </button>

        <div className="absolute left-1/2 transform -translate-x-1/2 font-lovehouse text-2xl font-semibold px-4 pt-1.5 border rounded-xl">
          Locket Pro
        </div>
      </div>

      {/* Nội dung */}
      <div className="flex flex-col flex-1 px-4 py-6 overflow-y-scroll space-y-5 justify-start items-center">
        <FeatureList />
        <MailForm />
        <ThemeSelector />
      </div>
    </div>
  );
};

export default RightHomeScreen;
