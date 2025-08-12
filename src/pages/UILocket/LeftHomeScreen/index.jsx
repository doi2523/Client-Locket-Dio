import React, { lazy, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthLocket";
import { ChevronRight, Link } from "lucide-react";
import { useApp } from "@/context/AppContext";
import BadgePlan from "../ExtendPage/Badge";
import BottomStreak from "./BottomStreak";
const StreaksCalender = lazy(() => import("./Views/StreaksCalender"));
import LoadingRing from "@/components/ui/Loading/ring";

const LeftHomeScreen = () => {
  const { user } = useContext(AuthContext);
  const { navigation, useloading, post } = useApp();
  const {
    isProfileOpen,
    setIsProfileOpen,
    isSettingTabOpen,
    setSettingTabOpen,
  } = navigation;
  const { imageLoaded, setImageLoaded } = useloading;
  const { recentPosts } = post;

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
      {/* Header sticky */}
      <div className="sticky top-0 z-10 bg-base-100 shadow-lg">
        <div className="flex items-center justify-between px-4 py-2">
          <BadgePlan />
          <button
            onClick={() => setIsProfileOpen(false)}
            className="rounded-lg btn btn-square hover:bg-base-200 transition cursor-pointer"
          >
            <ChevronRight size={40} />
          </button>
        </div>

        {/* User info với hiệu ứng thu gọn */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-row justify-between items-center px-4 pb-2">
            <div className="flex flex-col items-start space-y-1">
              <p className="text-2xl font-semibold whitespace-nowrap">
                {user?.displayName || "Name"}
              </p>
              <a
                href={`https://locket.cam/${user?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link underline font-semibold flex items-center"
              >
                @{user?.username} <Link className="ml-2" size={18} />
              </a>
            </div>
            <div className="avatar w-18 h-18 disable-select flex-shrink-0">
              <div className="rounded-full shadow-md border-4 border-amber-400 p-1">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingRing size={40} stroke={2} color="blue" />
                  </div>
                )}
                <img
                  src={user?.profilePicture || "/prvlocket.png"}
                  alt="Profile"
                  className={`w-19 h-19 rounded-full transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung cuộn */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-base-200">
        <p>
          Lưu ý: Chuỗi trên web là lấy từ trên máy chủ Locket nên sẽ hiển thị
          nhanh hơn trên app ( trên app trong 5-10p sẽ cập nhật chuỗi). Nhưng để
          chắc chắn có chuỗi cho ngày hôm đó mọi người phải check trong app cho
          chắc chắn. Ví dụ: hôm qua chuỗi 9 đến hôm nay đăng phải là chuỗi 10
          thì trên app cũng phải cũng hiển thị số 10 ở cùng vị trí ô
        </p>
        <p className="mb-5">Số Locket là số bài đăng trên web khác với thực tế</p>
        <StreaksCalender recentPosts={recentPosts} />
        <BottomStreak recentPosts={recentPosts} />
      </div>
    </div>
  );
};

export default LeftHomeScreen;
