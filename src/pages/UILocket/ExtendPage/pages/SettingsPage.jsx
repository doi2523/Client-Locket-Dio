import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthLocket";
import { ChevronLeft, Menu } from "lucide-react";
import MailForm from "../../../../components/UI/SupportForms/MailForm";
import { useApp } from "../../../../context/AppContext";
import FeatureList from "../../../../components/UI/FeatureList";
import BadgePlan from "../Badge";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  const { user, setUser } = useContext(AuthContext);
  // Khóa / Mở cuộn ngang khi mở sidebar
  // useEffect(() => {
  //   document.body.classList.toggle("overflow-hidden", isHomeOpen);
  //   return () => document.body.classList.remove("overflow-hidden");
  // }, [isHomeOpen]);

  return (
    <div
      className={`fixed inset-0 flex flex-col transition-transform duration-500 z-50 bg-base-100 overflow-hidden`} // ❌ Không cuộn div to
    >
      <div className="relative flex items-center shadow-lg justify-between px-4 py-2 text-base-content">
        <Link
          to={"/locket"}
          //   onClick={() => navigation()}
          className="btn p-1 border-0 rounded-full hover:bg-base-200 transition cursor-pointer z-10"
        >
          <ChevronLeft size={30} />
        </Link>
        <BadgePlan />
      </div>

      {/* Nội dung */}
      <div className="flex flex-col flex-1 px-4 py-6 overflow-y-scroll space-y-5 justify-start items-center">
        <FeatureList />
        <MailForm />
        {/* <ThemeSelector /> */}
      </div>
    </div>
  );
};

export default SettingsPage;
