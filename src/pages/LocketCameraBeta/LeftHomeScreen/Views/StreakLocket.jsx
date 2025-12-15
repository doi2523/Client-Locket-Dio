import React, { lazy } from "react";
const StreaksCalender = lazy(() => import("./StreaksCalender"));
import BottomStreak from "../Layout/BottomStreak";

function StreakLocket({ recentPosts }) {
  return (
    <>
      <div className="p-4 w-full flex flex-col gap-4">
        <p>
          Lưu ý: Chuỗi trên web là lấy từ trên máy chủ Locket nên sẽ hiển thị
          nhanh hơn trên app. Khi đăng ảnh/video trên web thành công thì chuỗi
          sẽ nhảy lên 1 số là chuỗi sẽ được giữ.
        </p>

        <p>
          Về phần hiển thị chuỗi ví dụ trên web hiển thị là 5 mà trên app không
          có {"=>"} app bị lỗi, chỉ cần đăng một ảnh/video trên app Locket thì
          chuỗi sẽ tự động hiển thị lại số chuỗi tương ứng.
        </p>

        <p className="mb-6">
          Số Locket là số bài đăng trên web khác với thực tế.
        </p>

        <StreaksCalender recentPosts={recentPosts} />
        <BottomStreak recentPosts={recentPosts} />
      </div>
    </>
  );
}

export default StreakLocket;
