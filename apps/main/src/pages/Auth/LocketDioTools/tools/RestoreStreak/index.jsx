import React, { useState, useMemo, useEffect } from "react";
import LoadingRing from "@/components/ui/Loading/ring";
import { useFeatureVisible, useGetCode } from "@/hooks/useFeature";
import { Link } from "react-router-dom";
import { formatYYYYMMDD, addDaysToYYYYMMDD } from "@/utils"; // addDaysToYYYYMMDD là helper tăng ngày
import { usePostStore, useStreakStore } from "@/stores";
import { InfoBlock, WarningBlock } from "./WarningBlock";
import LockedFeature from "../../Layout/LockedFeature";
import ReviewFeature from "./ReviewFeature";

export default function RestoreStreak() {
  const hasAccess = useFeatureVisible("restore_streak_tool");
  const codeUser = useGetCode();
  const [confirmDeletedToday, setConfirmDeletedToday] = useState(false);
  const { streak } = useStreakStore();
  const { setRestoreStreak, restoreStreak } = usePostStore();
  const [mode, setMode] = useState("restore"); // "restore" | "continue"
  const [suggestType, setSuggestType] = useState(null);

  const suggestedPastDate = useMemo(() => {
    if (!streak?.past_streak?.last_updated_yyyymmdd) return null;
    return addDaysToYYYYMMDD(streak.past_streak.last_updated_yyyymmdd, 1);
  }, [streak]);

  const suggestedCurrentDate = useMemo(() => {
    if (!streak?.last_updated_yyyymmdd) return null;
    return addDaysToYYYYMMDD(streak.last_updated_yyyymmdd, 1);
  }, [streak]);

  const currentDate = useMemo(() => formatYYYYMMDD(), []);
  const previousDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatYYYYMMDD(d);
  }, []);

  useEffect(() => {
    if (suggestedPastDate && !suggestedCurrentDate) {
      setSuggestType("past");
    } else if (!suggestedPastDate && suggestedCurrentDate) {
      setSuggestType("current");
    }
  }, [suggestedPastDate, suggestedCurrentDate]);

  const restoreStreakDate = useMemo(() => {
    if (suggestType === "past" && suggestedPastDate) return suggestedPastDate;

    if (suggestType === "current" && suggestedCurrentDate)
      return suggestedCurrentDate;

    return mode === "restore" ? previousDate : currentDate;
  }, [
    suggestType,
    suggestedPastDate,
    suggestedCurrentDate,
    mode,
    previousDate,
    currentDate,
  ]);

  // ✅ Xác định xem chuỗi hôm nay đã cập nhật chưa
  const isTodayStreak = streak?.last_updated_yyyymmdd === currentDate;

  const streakUpdated = streak?.last_updated_yyyymmdd === previousDate;

  // Chỉ cho khôi phục khi:
  // - Chuỗi chưa tới hôm nay
  // - Hoặc user xác nhận đã xoá bài hôm nay
  const canRestore = confirmDeletedToday || (!streakUpdated && !isTodayStreak);

  useEffect(() => {
    setConfirmDeletedToday(false);
  }, [isTodayStreak]);

  useEffect(() => {
    setRestoreStreak({
      data: restoreStreakDate,
      mode,
      name:
        mode === "restore" ? "Chế độ khôi phục chuỗi" : "Chế độ nối tiếp chuỗi",
    });
  }, [mode, restoreStreakDate, setRestoreStreak]);

  if (!hasAccess) {
    return (
      <LockedFeature
        toolName="Restore Streak Tool"
        price="5000"
        note="CT"
        codeUser={codeUser}
        description="Vui lòng liên hệ quản trị viên để được cấp quyền."
      />
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
      <div data-tour="introduce-streak">
        <h2 className="text-2xl font-semibold mb-2">
          🔥 Khôi phục chuỗi (Streak)
        </h2>
        <p className="text-sm opacity-70 max-w-2xl">
          Công cụ này giúp bạn khôi phục chuỗi đăng bài (streak) nếu bị gián
          đoạn, hoặc tiếp tục chuỗi hiện tại. Chọn chế độ phù hợp bên dưới để áp
          dụng.
        </p>
      </div>
      <ReviewFeature />
      {/* STREAK INFO */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
        <div
          data-tour="current-streak"
          className="p-3 border border-base-300 rounded-xl bg-base-200 shadow-sm"
        >
          <h3 className="font-semibold mb-2">🔥 Hiện tại</h3>
          <div className="space-y-1 text-sm">
            <p>
              <b>Số ngày:</b> {streak.count ?? 0}
            </p>
            <p>
              <b>Cập nhật gần nhất:</b> {streak.last_updated_yyyymmdd || "—"}
            </p>
          </div>
        </div>

        <div
          data-tour="past-streak"
          className="p-3 border border-base-300 rounded-xl bg-base-200 shadow-sm"
        >
          <h3 className="font-semibold mb-2">🕒 Quá khứ</h3>
          <div className="space-y-1 text-sm">
            <p>
              <b>Số ngày:</b> {streak.past_streak?.count ?? 0}
            </p>
            <p>
              <b>Kết thúc vào:</b>{" "}
              {streak.past_streak?.last_updated_yyyymmdd || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* MODE SELECT */}
      <div className="p-4 border rounded-xl bg-base-200 space-y-4">
        <h3 className="font-semibold text-lg mb-3">📅 Ngày liên quan</h3>
        <div className="space-y-2 text-sm">
          <p data-tour="current-day">
            <b>Hôm nay:</b> {currentDate}
          </p>
          <p data-tour="past-day">
            <b>Ngày trước đó:</b> {previousDate}
          </p>
          {(suggestedPastDate || suggestedCurrentDate) && (
            <InfoBlock title="⚠️ Ngày khôi phục đề xuất">
              <div className="space-y-3 text-sm">
                {suggestedPastDate && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="suggest_type"
                      className="radio radio-info radio-sm mt-1"
                      checked={suggestType === "past"}
                      onChange={() => setSuggestType("past")}
                    />
                    <div>
                      <p className="font-medium">Khôi phục chuỗi quá khứ</p>
                      <p className="opacity-70">
                        Dựa trên chuỗi trước đó đã kết thúc
                      </p>
                      <div className="mt-1 bg-base-300 p-2 rounded-lg font-mono text-center">
                        {suggestedPastDate}
                      </div>
                    </div>
                  </label>
                )}

                {suggestedCurrentDate && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="suggest_type"
                      className="radio radio-info radio-sm mt-1"
                      checked={suggestType === "current"}
                      onChange={() => setSuggestType("current")}
                    />
                    <div>
                      <p className="font-medium">
                        Khôi phục chuỗi hiện tại + 1
                      </p>
                      <p className="opacity-70">Tiếp nối từ chuỗi đang có</p>
                      <div className="mt-1 bg-base-300 p-2 rounded-lg font-mono text-center">
                        {suggestedCurrentDate}
                      </div>
                    </div>
                  </label>
                )}

                <ul className="list-disc list-inside text-xs opacity-80 mt-2 space-y-1">
                  <li>Chỉ chọn khi bạn hiểu rõ cách hoạt động của chuỗi.</li>
                  <li>
                    Nếu chuỗi mới có số ngày quá cao ví dụ 3 hoặc 4 thì tỉ lệ
                    khôi phục thành công chuỗi quá khứ sẽ giảm xuống.
                  </li>
                  <li>Nếu không hiểu thì hãy liên hệ quản trị viên nhé.</li>
                </ul>
              </div>
            </InfoBlock>
          )}
        </div>

        {/* <div className="mt-5 space-y-3">
          <p className="font-medium">🧭 Chọn chế độ khôi phục:</p>

          <fieldset
            disabled={!canRestore}
            className={!canRestore ? "opacity-50 cursor-not-allowed" : ""}
          >
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
        </div> */}

        <div className="mt-5 p-3 bg-base-100 rounded-lg border text-base">
          <p className="opacity-70">
            📦 Giá trị <b>restoreStreakDate</b> được chọn:
          </p>
          <code data-tour="day-value" className="text-primary font-mono">
            {restoreStreakDate}
          </code>
        </div>

        {isTodayStreak && (
          <WarningBlock title="⚠️ Chuỗi đã đúng ngày hiện tại">
            <p className="text-sm opacity-80">
              Chuỗi của bạn đã được cập nhật cho <b>ngày hôm nay</b>.
            </p>

            <p className="text-sm opacity-80 mt-2">
              Việc tiếp tục khôi phục trong trường hợp này có thể làm{" "}
              <b>sai lệch dữ liệu chuỗi</b>.
            </p>

            <p className="text-sm opacity-80 mt-2">
              Nếu bạn chắc chắn muốn khôi phục, hãy đảm bảo rằng{" "}
              <b>tất cả bài đăng của ngày hôm nay đã được xoá</b>.
            </p>
          </WarningBlock>
        )}

        {isTodayStreak && (
          <WarningBlock title="❗Bật chế độ khôi phục nâng cao?">
            <p className="text-sm opacity-80">
              Chuỗi của bạn đã cập nhật vào đúng ngày hôm nay. Nhưng vẫn có thể
              bật chế độ này để cập nhật lại chuỗi vào{" "}
              <b>ngày trước đó và trước đó nữa</b>.
            </p>
            <p className="text-sm opacity-80 mt-2">
              Tôi xác nhận rằng <b>đã xoá toàn bộ bài đăng của ngày hôm nay</b>{" "}
              và hiểu rằng việc khôi phục chuỗi có thể làm sai lệch dữ liệu nếu
              thông tin này không chính xác.
            </p>
            <label className="flex items-center justify-start gap-2 cursor-pointer text-sm mt-2">
              <input
                type="checkbox"
                className="checkbox checkbox-warning checkbox-sm"
                checked={confirmDeletedToday}
                onChange={(e) => setConfirmDeletedToday(e.target.checked)}
              />
              <span className="opacity-80">
                Tôi đồng ý và chấp nhận điều kiện
              </span>
            </label>
          </WarningBlock>
        )}
      </div>

      {/* CONDITIONS */}
      <div
        data-tour="note-streak"
        className="p-5 border border-dashed rounded-xl bg-base-100 space-y-3"
      >
        <h3 className="font-semibold text-lg">⚙️ Điều kiện & hướng dẫn</h3>
        <ul className="list-disc list-inside text-sm space-y-2 opacity-80">
          <li>
            <b>Chế độ khôi phục chuỗi</b>: Chỉ khả dụng nếu bạn{" "}
            <u>chưa đăng bất kỳ bài nào hôm nay</u>. Nếu đã đăng, hãy xóa hết
            bài của ngày hiện tại trước khi thực hiện.
          </li>
          <li>
            <b>Mô tả hoạt động</b>: Khi bật chế độ này, hệ thống sẽ tính bài
            đăng ở <u>ngày hôm qua</u> hoặc ngày gợi ý như một bài đăng hợp lệ
            để khôi phục chuỗi.
          </li>
          <li>
            <b>Cần hỗ trợ?</b> Chuỗi có thể khôi phục vô hạn số lần chỉ với điều
            kiện thực hiện đúng cách, nếu đã đăng bài hiện lên chuỗi 1 hoặc 2
            thì hãy liên hệ quản trị viên để được giúp đỡ.
          </li>
        </ul>
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <Link
          data-tour="restore-btn"
          className={`btn btn-primary ${
            !canRestore ? "btn-disabled opacity-50 cursor-not-allowed" : ""
          }`}
          to={!canRestore ? "#" : "/restore-streak"}
        >
          🚀 Chuyển tới trang đăng bài khôi phục
        </Link>
      </div>
    </div>
  );
}
