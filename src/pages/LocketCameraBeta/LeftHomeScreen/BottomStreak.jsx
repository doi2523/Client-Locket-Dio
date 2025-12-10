import { Flame, Heart } from "lucide-react";
import { useStreak } from "../../../hooks/useStreak";

export default function BottomStreak({ recentPosts = [] }) {
  const streak = useStreak();

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex items-center gap-4 bg-base-300 px-6 py-2 rounded-3xl backdrop-blur-sm font-semibold">
        <span className="flex items-center gap-1">
          <Heart className="w-5 h-5" color="orange" strokeWidth={3}/>
          {recentPosts.length || "???"} Locket
        </span>

        <div className="w-[2px] h-6 bg-black rounded-sm" />

        <span className="flex items-center gap-1">
          <Flame className="w-5 h-5" color="orange" strokeWidth={3}/>
          {streak?.count || "0"}d chuỗi
        </span>
      </div>
    </div>
  );
}
