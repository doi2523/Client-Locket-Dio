import React from "react";
import { listWeeksOfYear } from "@/utils";

function WeekNavigator({ year, week, onChange }) {
  const weeks = listWeeksOfYear(year);

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm opacity-70">Tuần:</label>

      <select
        value={week}
        onChange={(e) => onChange(Number(e.target.value), year)}
        className="select select-bordered"
      >
        {weeks.map((w) => (
          <option key={w.week} value={w.week}>
            Tuần {w.week} ({w.label})
          </option>
        ))}
      </select>
    </div>
  );
}

export default WeekNavigator;
