export const getStreakToday = () => {
  try {
    const streakRaw = localStorage.getItem("streak");
    if (!streakRaw) return false;

    const streak = JSON.parse(streakRaw);
    if (!streak.last_updated_yyyymmdd) return false;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayNumber = Number(`${yyyy}${mm}${dd}`);

    return streak.last_updated_yyyymmdd === todayNumber;
  } catch (err) {
    console.error("Error parsing streak from localStorage:", err);
    return false;
  }
};
