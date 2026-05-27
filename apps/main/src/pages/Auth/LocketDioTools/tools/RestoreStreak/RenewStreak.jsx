import { useStreakStore } from "@/stores";

export function RenewStreak() {
  const loading = useStreakStore((s) => s.loading);
  const fetchStreak = useStreakStore((s) => s.fetchStreak);

  return (
    <button
      className="btn btn-sm btn-info mx-2"
      onClick={fetchStreak}
      disabled={loading}
    >
      Làm mới chuỗi
    </button>
  );
}
