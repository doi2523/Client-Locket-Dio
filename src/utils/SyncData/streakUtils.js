import { GetLastestMoment } from "@/services";

export const fetchStreak = async (setStreak) => {
  try {
    const data = await GetLastestMoment();
    if (data?.streak) {
      setStreak(data.streak);
      localStorage.setItem("streak", JSON.stringify(data.streak));
    }
  } catch (error) {
    console.error("Error fetching streak:", error);
  }
};
