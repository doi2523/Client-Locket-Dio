import React, { useState, useMemo, useEffect } from "react";
import LoadingRing from "@/components/ui/Loading/ring";
import { useFeatureVisible } from "@/hooks/useFeature";
import { useStreak } from "@/hooks/useStreak";
import { useApp } from "@/context/AppContext";
import { Link } from "react-router-dom";

const formatYYYYMMDD = (date = new Date()) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return Number(`${yyyy}${mm}${dd}`);
};

export default function RestoreStreak() {
  const hasAccess = useFeatureVisible("restore_streak_tool");
  const streak = useStreak();
  const { restoreStreak, setRestoreStreak } = useApp().post;
  const [mode, setMode] = useState("restore"); // "restore" | "continue"

  const currentDate = useMemo(() => formatYYYYMMDD(), []);
  const previousDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatYYYYMMDD(d);
  }, []);

  const restoreStreakDate = mode === "restore" ? previousDate : currentDate;

  // ✅ Xác định xem chuỗi hôm nay đã cập nhật chưa
  const isTodayStreak = streak?.last_updated_yyyymmdd === currentDate;

  useEffect(() => {
    setRestoreStreak({
      data: restoreStreakDate,
      mode,
      name:
        mode === "restore"
          ? "Chế độ khôi phục chuỗi"
          : "Chế độ nối tiếp chuỗi",
    });
  }, [mode, restoreStreakDate, setRestoreStreak]);

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-10">
        <div className="text-6xl">🔒</div>
        <h3 className="text-xl font-semibold">Tính năng bị khóa</h3>
        <p className="text-sm opacity-70 max-w-md">
          Bạn không có quyền truy cập vào <b>Restore Streak Tool</b>. Vui lòng
          liên hệ quản trị viên để được cấp quyền.
        </p>
      </div>
    );
  }

  if (!streak) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingRing />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">🔥 Khôi phục chuỗi (Streak)</h2>
        <p className="text-sm opacity-70 max-w-2xl">
          Công cụ này giúp bạn khôi phục chuỗi đăng bài (streak) nếu bị gián đoạn, 
          hoặc tiếp tục chuỗi hiện tại. Chọn chế độ phù hợp bên dưới để áp dụng.
        </p>
      </div>

      {/* STREAK INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-3 border border-base-300 rounded-xl bg-base-200 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">🔥 Chuỗi hiện tại</h3>
          <div className="space-y-1">
            <p><b>Số ngày:</b> {streak.count ?? 0}</p>
            <p><b>Cập nhật gần nhất:</b> {streak.last_updated_yyyymmdd || "—"}</p>
          </div>
        </div>

        <div className="p-3 border border-base-300 rounded-xl bg-base-200 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">🕒 Chuỗi trước đó</h3>
          <div className="space-y-1">
            <p><b>Số ngày:</b> {streak.past_streak?.count ?? 0}</p>
            <p><b>Kết thúc vào:</b> {streak.past_streak?.last_updated_yyyymmdd || "—"}</p>
          </div>
        </div>
      </div>

      {/* MODE SELECT */}
      <div className="p-5 border rounded-xl bg-base-200">
        <h3 className="font-semibold text-lg mb-3">📅 Ngày liên quan</h3>
        <div className="space-y-2 text-sm">
          <p><b>Hôm nay:</b> {currentDate}</p>
          <p><b>Ngày trước đó:</b> {previousDate}</p>
        </div>

        <div className="mt-5 space-y-3">
          <p className="font-medium">🧭 Chọn chế độ khôi phục:</p>

          <fieldset disabled={isTodayStreak} className={isTodayStreak ? "opacity-50 cursor-not-allowed" : ""}>
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="radio"
                name="restore_mode"
                className="radio radio-sm"
                checked={mode === "restore"}
                onChange={() => setMode("restore")}
              />
              <span className="text-sm">
                Khôi phục chuỗi bị đứt (sử dụng <b>ngày trước đó</b>)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="restore_mode"
                className="radio radio-sm"
                checked={mode === "continue"}
                onChange={() => setMode("continue")}
              />
              <span className="text-sm">
                Nối tiếp chuỗi hiện tại (sử dụng <b>ngày hôm nay</b>)
              </span>
            </label>
          </fieldset>
        </div>

        <div className="mt-5 p-3 bg-base-100 rounded-lg border text-sm">
          <p className="opacity-70">📦 Giá trị <b>restoreStreakDate</b> được chọn:</p>
          <code className="text-primary font-mono">{restoreStreakDate}</code>
        </div>

        {isTodayStreak && (
          <div className="mt-4 text-xs text-error font-medium">
            ⚠️ Hôm nay bạn đã cập nhật chuỗi — không thể khôi phục hoặc thay đổi.
          </div>
        )}
      </div>

      {/* CONDITIONS */}
      <div className="p-5 border border-dashed rounded-xl bg-base-100 space-y-3">
        <h3 className="font-semibold text-lg">⚙️ Điều kiện & hướng dẫn</h3>
        <ul className="list-disc list-inside text-sm space-y-2 opacity-80">
          <li>
            <b>Chế độ khôi phục chuỗi</b>: Chỉ khả dụng nếu bạn <u>chưa đăng bất kỳ bài nào hôm nay</u>. 
            Nếu đã đăng, hãy xóa hết bài của ngày hiện tại trước khi thực hiện.
          </li>
          <li>
            <b>Mô tả hoạt động</b>: Khi bật chế độ này, hệ thống sẽ tính bài đăng
            ở <u>ngày hôm qua</u> như một bài đăng hợp lệ để khôi phục chuỗi.
          </li>
        </ul>
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <Link
          className={`btn btn-primary ${isTodayStreak ? "btn-disabled opacity-50 cursor-not-allowed" : ""}`}
          to={isTodayStreak ? "#" : "/restore-streak"}
        >
          🚀 Chuyển tới trang đăng bài khôi phục
        </Link>
      </div>
    </div>
  );
}
