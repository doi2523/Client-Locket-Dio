import React, { useState, useEffect, useCallback } from "react";
import { getFriendDetail } from "@/cache/friendsDB";
import { getRollcallPosts } from "@/services";
import RollcallCard from "./RollcallCard";
import { saveRollcalls } from "@/cache/rollcallDb";
import { getISOWeek, getWeekRange } from "@/utils";
import WeekNavigator from "./WeekNavigator";

function RollcallsPost({ active, posts, setPosts, isProfileOpen }) {
  const { week: currentWeek, year: currentYear } = getISOWeek();

  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(false);

  // reset visible khi đổi tab
  useEffect(() => {
    if (active === "lockets") setVisibleCount(5);
  }, [active]);

  // reset visible khi đổi tuần
  useEffect(() => {
    setVisibleCount(2);
  }, [selectedWeek, selectedYear, isProfileOpen]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRollcallPosts({
        selectWeek: selectedWeek,
        selectYear: selectedYear,
      });

      const postsWithUser = await Promise.all(
        data.map(async (post) => {
          const userDetail = await getFriendDetail(post.user);
          return { ...post, userDetail };
        })
      );

      await saveRollcalls(data);
      setPosts(data || []);
    } catch (err) {
      console.error("Failed to load rollcall posts:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedWeek, selectedYear, setPosts]);

  // 🔥 luôn fetch khi đổi tuần / năm
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setVisibleCount((prev) => Math.min(prev + 5, posts.length));
    }
  };

  return (
    <div
      className="h-full p-4 w-full flex flex-col gap-4 overflow-y-auto pb-24"
      onScroll={handleScroll}
    >
      {/* 🔥 Week navigator */}
      <WeekNavigator
        week={selectedWeek}
        year={selectedYear}
        onChange={(w, y) => {
          setSelectedWeek(w);
          setSelectedYear(y);
        }}
      />

      <h2 className="text-xl font-bold">
        Rollcalls – {getWeekRange(selectedWeek, selectedYear)}
      </h2>

      {loading && <div className="opacity-60">Loading...</div>}

      {!loading &&
        posts
          .slice(0, visibleCount)
          .map((post) => <RollcallCard key={post.uid} post={post} />)}
    </div>
  );
}

export default RollcallsPost;
