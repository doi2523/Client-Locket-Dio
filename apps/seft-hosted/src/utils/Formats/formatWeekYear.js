function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDate(date) {
  return `${pad(date.getDate())} Thg ${pad(
    date.getMonth() + 1
  )} ${date.getFullYear()}`;
}

/**
 * 👉 Trả về: "Ng dd Thg mm yyyy -> Ng dd Thg mm yyyy"
 * ISO week (Thứ 2 → Chủ nhật)
 */
export function getWeekRange(week, year) {
  // ngày đại diện của tuần
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const dow = simple.getUTCDay();

  // ISO week start (Thứ 2)
  const start = new Date(simple);
  if (dow <= 4) {
    start.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
  } else {
    start.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
  }

  // ISO week end (Chủ nhật)
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  return `${formatDate(start)} -> ${formatDate(end)}`;
}

/**
 * Lấy ISO week number (Thứ 2 → CN)
 */
export function getISOWeek(date = new Date()) {
  const input = new Date(date);

  // ISO: Monday = 1, Sunday = 7
  const isoDay = input.getDay() === 0 ? 7 : input.getDay();

  // Nếu chưa hết tuần (chưa tới Chủ nhật) => lùi về tuần trước
  if (isoDay < 7) {
    input.setDate(input.getDate() - 7);
  }

  const d = new Date(
    Date.UTC(input.getFullYear(), input.getMonth(), input.getDate())
  );

  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);

  return {
    week,
    year: d.getUTCFullYear(),
  };
}

export function listWeeksOfYear(year = new Date().getFullYear()) {
  const now = new Date();
  const { week: currentWeek, year: currentYear } = getISOWeek(now);

  // Nếu là năm hiện tại → chỉ list tới tuần hiện tại
  // Nếu là năm quá khứ → list full năm
  const lastWeek =
    year === currentYear
      ? currentWeek
      : getISOWeek(new Date(Date.UTC(year, 11, 28))).week;

  return Array.from({ length: lastWeek }, (_, i) => {
    const week = i + 1;
    return {
      week,
      year,
      label: getWeekRange(week, year),
    };
  });
}

