import { MdSlowMotionVideo } from "react-icons/md";
import { useEffect, useMemo, useRef } from "react";
import { useStreak } from "@/hooks/useStreak";

// Parse date dạng "04:44:00, 30/7/2025"
// Parse date an toàn, hỗ trợ nhiều định dạng
function parseCustomDate(str) {
  if (!str) return null;

  // Nếu là Date object
  if (str instanceof Date && !isNaN(str)) return str;

  // Nếu là timestamp số
  if (!isNaN(str) && String(str).length >= 10) {
    const d = new Date(Number(str));
    if (!isNaN(d)) return d;
  }

  // Xóa dấu phẩy và khoảng trắng dư
  str = String(str).replace(",", "").trim();

  // Thử parse mặc định của JS (hỗ trợ ISO 8601: 2025-07-30T04:44:00Z)
  let d = new Date(str);
  if (!isNaN(d)) return d;

  // Regex: HH:mm:ss DD/MM/YYYY hoặc DD/MM/YYYY
  let match;
  const timeDate = /^(\d{1,2}):(\d{1,2}):(\d{1,2})\s+(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/;
  const dateOnly = /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/;
  const timeOnly = /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/;

  if ((match = str.match(timeDate))) {
    const [, hh, mm, ss, day, month, year] = match.map(Number);
    return new Date(year, month - 1, day, hh, mm, ss);
  }

  if ((match = str.match(dateOnly))) {
    const [, day, month, year] = match.map(Number);
    return new Date(year, month - 1, day);
  }

  if ((match = str.match(timeOnly))) {
    const [, hh, mm, ss] = match.map(Number);
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hh, mm, ss);
  }

  return null; // Không parse được
}

// Tạo key tháng từ chuỗi date
function getMonthKeyFromCustomDate(str) {
  const d = parseCustomDate(str);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
}

// Lấy ngày cuối tháng
function getLastDayOfMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Convert từ yyyymmdd sang Date
function yyyymmddToDate(num) {
  const str = num.toString();
  const year = +str.slice(0, 4);
  const month = +str.slice(4, 6) - 1;
  const day = +str.slice(6, 8);
  return new Date(year, month, day);
}

// Tính ngày bắt đầu streak
function getStreakStartDate(streak) {
  if (!streak || !streak.count || !streak.last_updated_yyyymmdd) return null;
  const lastDate = yyyymmddToDate(streak.last_updated_yyyymmdd);
  const startDate = new Date(lastDate);
  startDate.setDate(startDate.getDate() - (streak.count - 1));
  return startDate;
}

const MonthCalendar = ({ monthKey, postsInMonth }) => {
  const streak = useStreak();

  const streakStartDate = getStreakStartDate(streak);

  const [yearStr, monthStr] = monthKey.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr) - 1;

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month, getLastDayOfMonth(year, month));

  // Gom bài viết theo ngày
  const postsByDate = useMemo(() => {
    const map = {};
    postsInMonth.forEach((post) => {
      const d = parseCustomDate(post.date);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
      if (!map[key]) map[key] = [];
      map[key].push(post);
    });
    return map;
  }, [postsInMonth]);

  // Tạo mảng ngày trong tháng
  const daysArray = useMemo(() => {
    const arr = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      arr.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return arr;
  }, [startDate, endDate]);

  // Tên tháng đẹp
  const monthName = startDate.toLocaleString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  const daysMobile = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const daysDesktop = [
    "CN",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "CN",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
  ];

  return (
    <div className="mb-8 bg-base-300 rounded-3xl shadow-lg overflow-hidden">
      <h2
        className="text-xl font-bold mb-0 w-full rounded-t-3xl bg-base-100 text-base-content
               py-3 px-6 shadow-md select-none"
      >
        {monthName}
      </h2>
      <div className="grid grid-cols-7 md:grid-cols-14 gap-1 md:gap-3 p-6">
        {/* Tiêu đề cho mobile (7 cột) */}
        {daysMobile.map((d) => (
          <div
            key={"mobile-" + d}
            className="block text-center font-medium text-sm border-b pb-1 md:hidden"
          >
            {d}
          </div>
        ))}

        {/* Tiêu đề cho màn to (14 cột) */}
        {daysDesktop.map((d, i) => (
          <div
            key={"desktop-" + i}
            className="hidden md:block text-center font-medium text-sm border-b pb-1"
          >
            {d}
          </div>
        ))}

        {/* Ô trống căn chỉnh ngày đầu tháng */}
        {Array(startDate.getDay())
          .fill(null)
          .map((_, i) => (
            <div key={"empty-" + i} className="aspect-square" />
          ))}

        {/* Các ngày trong tháng */}
        {daysArray.map((day) => {
          const dayKey = `${day.getFullYear()}-${(day.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${day.getDate().toString().padStart(2, "0")}`;
          const posts = postsByDate[dayKey] || [];

          // Kiểm tra ngày này có nằm trong streak không
          const isInStreak =
            streakStartDate &&
            day >= streakStartDate &&
            day <= yyyymmddToDate(streak.last_updated_yyyymmdd);

          // Kiểm tra có phải hôm nay không
          const today = new Date();
          const isToday =
            day.getFullYear() === today.getFullYear() &&
            day.getMonth() === today.getMonth() &&
            day.getDate() === today.getDate();

          const showPlusIcon =
            streak && streak.count > 0 && isToday && !isInStreak;

          return (
            <div
              key={dayKey}
              className={`aspect-square rounded-xl border p-1 flex flex-col overflow-hidden cursor-pointer group relative
        ${
          isInStreak
            ? "border-yellow-400 border-3 bg-base-200"
            : "border-gray-300 bg-base-100"
        }
      `}
              title={
                posts.length > 0
                  ? posts[0].date // dùng nguyên chuỗi gốc
                  : dayKey
              }
            >
              <div className="text-xs font-semibold mb-1 text-center select-none relative">
                {day.getDate()}
              </div>
              {showPlusIcon && (
                <span
                  className="absolute inset-0 flex justify-center items-center text-green-600 text-3xl font-bold select-none"
                  aria-hidden="true"
                >
                  +
                </span>
              )}
              {posts.length === 0 ? (
                <div className="flex-1" />
              ) : (
                <div className="grid grid-cols-2 gap-0.5 flex-1 overflow-hidden">
                  {posts.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="relative rounded-md overflow-hidden"
                      title={item.captions?.[0]?.text || item.date}
                    >
                      {item.video_url ? (
                        <>
                          <img
                            src={item.thumbnail_url}
                            alt="video thumbnail"
                            className="object-cover w-full h-full"
                            loading="lazy"
                          />
                          <div className="absolute top-1 right-1 bg-primary/80 rounded-full p-0.5">
                            <MdSlowMotionVideo className="text-white text-xs" />
                          </div>
                        </>
                      ) : (
                        <img
                          src={item.thumbnail_url || item.image_url}
                          alt={item.captions?.[0]?.text || "Image"}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      )}
                    </div>
                  ))}
                  {isInStreak &&
                    day.getTime() ===
                      yyyymmddToDate(
                        streak.last_updated_yyyymmdd
                      ).getTime() && (
                      <div className="absolute bg-yellow-400 text-black text-[10px] px-1 font-bold bottom-0 right-0 rounded-tl-sm">
                        {streak?.count}
                      </div>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StreaksCalender = ({ recentPosts = [] }) => {
  const postsByMonth = useMemo(() => {
    const map = {};
    recentPosts.forEach((post) => {
      const monthKey = getMonthKeyFromCustomDate(post.date);
      if (!map[monthKey]) map[monthKey] = [];
      map[monthKey].push(post);
    });
    return map;
  }, [recentPosts]);

  const monthsSorted = useMemo(() => {
    return Object.keys(postsByMonth).sort();
  }, [postsByMonth]);

  const lastMonthRef = useRef(null);

  useEffect(() => {
    if (lastMonthRef.current) {
      lastMonthRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [monthsSorted]);

  if (recentPosts.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-lg text-base-content font-semibold">
        Không có gì ở đây :(
      </div>
    );
  }

  return (
    <div>
      {monthsSorted.map((monthKey, idx) => {
        const isLast = idx === monthsSorted.length - 1;
        return (
          <div key={monthKey} ref={isLast ? lastMonthRef : null}>
            <MonthCalendar
              monthKey={monthKey}
              postsInMonth={postsByMonth[monthKey]}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StreaksCalender;
