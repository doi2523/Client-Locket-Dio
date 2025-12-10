import React, { lazy, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthLocket";
import { useApp } from "@/context/AppContext";
import BottomStreak from "./BottomStreak";
const StreaksCalender = lazy(() => import("./Views/StreaksCalender"));
import { getPostedMoments } from "@/process/uploadQueue";
import HeaderOne from "./Layout/HeaderOne";
import InfoUser from "./Layout/InfoUser";

const LeftHomeScreen = ({ setIsProfileOpen }) => {
  const { user } = useContext(AuthContext);
  const { navigation, post } = useApp();
  const { isProfileOpen } = navigation;
  const { recentPosts, setRecentPosts } = post;

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isProfileOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isProfileOpen]);

  useEffect(() => {
    const fetchData = async () => {
      // Lấy các post đã đăng
      const posted = await getPostedMoments();
      setRecentPosts(posted);
    };

    fetchData();
  }, [isProfileOpen]); // chỉ chạy 1 lần khi component mount

  return (
    <div
      className={`fixed inset-0 flex flex-col transition-transform duration-500 z-50 text-base-content ${
        isProfileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header sticky */}
      <div className="sticky top-0 z-10 bg-base-100 shadow-lg">
        <HeaderOne setIsProfileOpen={setIsProfileOpen} />

        {/* User info với hiệu ứng thu gọn */}
        <InfoUser user={user} />
      </div>

      {/* Nội dung cuộn */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-base-200">
        <p>
          Lưu ý: Chuỗi trên web là lấy từ trên máy chủ Locket nên sẽ hiển thị
          nhanh hơn trên app. Khi đăng ảnh/video trên web thành công thì chuỗi
          sẽ nhảy lên 1 số là chuỗi sẽ được giữ.
        </p>
        <p>
          Về phần hiển thị chuỗi ví dụ trên web hiển thị là 5 mà trên app không
          có {"=>"} app bị lỗi chỉ cần đăng một ảnh/video trên app Locket thì
          chuỗi sẽ tự động hiển thị lại số chuỗi tương ứng.
        </p>
        <p className="mb-5">
          Số Locket là số bài đăng trên web khác với thực tế
        </p>
        <StreaksCalender recentPosts={recentPosts} />
        <BottomStreak recentPosts={recentPosts} />
      </div>
    </div>
  );
};

export default LeftHomeScreen;
