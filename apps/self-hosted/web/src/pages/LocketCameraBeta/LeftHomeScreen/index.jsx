import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import HeaderOne from "./Layout/HeaderOne";
import InfoUser from "./Layout/InfoUser";
import SegmentedToggle from "./Layout/SegmentedToggle";
import RollcallsPost from "./Views/RollcallsPage";
import StreakLocket from "./Views/CalenderStreak";
import { useAuthStore, useUploadQueueStore } from "@/stores";

const LeftHomeScreen = ({ setIsProfileOpen }) => {
  const { user } = useAuthStore();
  const { navigation } = useApp();
  const { isProfileOpen } = navigation;
  const [posts, setPosts] = useState([]);

  const [active, setActive] = useState("lockets"); // 'rollcall' | 'lockets'

  // useEffect(() => {
  //   document.body.classList.toggle("overflow-hidden", isProfileOpen);
  //   return () => document.body.classList.remove("overflow-hidden");
  // }, [isProfileOpen]);
  const postedMoments = useUploadQueueStore((s) => s.postedMoments);
  // handle toggle bằng true/false
  const handleToggle = (tab) => {
    setActive(tab);
  };

  return (
    <div
      className={`fixed inset-0 w-full grid grid-rows-[auto_1fr] z-50 bg-base-100 text-base-content transition-transform duration-500 overflow-hidden ${
        isProfileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* ==== Header (sticky) ==== */}
      <div className="relative shadow-md">
        <HeaderOne setIsProfileOpen={setIsProfileOpen} />
        <InfoUser user={user} />
      </div>

      {/* ==== Nội dung chính ==== */}
      <div className="flex bg-base-200 overflow-y-auto">
        {active === "rollcall" && (
          <RollcallsPost
            active={active}
            posts={posts}
            setPosts={setPosts}
            isProfileOpen={isProfileOpen}
          />
        )}
        {active === "lockets" && <StreakLocket recentPosts={postedMoments} />}
      </div>
      {/* ==== Bottom Segmented Toggle ==== */}
      <div className="fixed z-60 bottom-4 w-full select-none">
        <SegmentedToggle active={active} setActive={handleToggle} />
      </div>
    </div>
  );
};

export default LeftHomeScreen;
