import { useContext } from "react";
import { AuthContext } from "@/context/AuthLocket";

export const useStreak = () => {
  const { streak } = useContext(AuthContext);

  return streak;
};

export const useStreakToDay = () => {
  const { streak } = useContext(AuthContext);

  if (!streak || !streak.last_updated_yyyymmdd) return false;

  // Lấy ngày hôm nay ở dạng yyyymmdd kiểu số
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = (today.getMonth() + 1).toString().padStart(2, "0");
  const dd = today.getDate().toString().padStart(2, "0");
  const todayNumber = Number(`${yyyy}${mm}${dd}`);

  return streak.last_updated_yyyymmdd === todayNumber;
};