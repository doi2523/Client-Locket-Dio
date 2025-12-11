import React, { lazy, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthLocket";
import { useApp } from "@/context/AppContext";
import { getPostedMoments } from "@/process/uploadQueue";
import HeaderOne from "./Layout/HeaderOne";
import InfoUser from "./Layout/InfoUser";
import SegmentedToggle from "./Layout/SegmentedToggle";
import RollcallsPost from "./Views/RollcallsPage";
import StreakLocket from "./Views/StreakLocket";

const LeftHomeScreen = ({ setIsProfileOpen }) => {
  const { user } = useContext(AuthContext);
  const { navigation, post } = useApp();
  const { isProfileOpen } = navigation;
  const { recentPosts, setRecentPosts } = post;

  const [active, setActive] = useState("lockets"); // 'rollcall' | 'lockets'

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isProfileOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isProfileOpen]);

  useEffect(() => {
    const fetchData = async () => {
      const posted = await getPostedMoments();
      setRecentPosts(posted);
    };
    fetchData();
  }, [isProfileOpen]);

  // handle toggle bằng true/false
  const handleToggle = (tab) => {
    setActive(tab);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-base-100 text-base-content transition-transform duration-500 ${
        isProfileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* ==== Header (sticky) ==== */}
      <div className="sticky top-0 z-10 bg-base-100 shadow-md">
        <HeaderOne setIsProfileOpen={setIsProfileOpen} />
        <InfoUser user={user} />
      </div>

      {/* ==== Nội dung chính ==== */}
      <div className="flex-1 bg-base-200">
        <div
          className={`fixed h-full w-full overflow-y-auto transition-all duration-500 ${
            active === "rollcall" ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <RollcallsPost active={active}/>
        </div>
        <div
          className={`fixed h-full w-full overflow-y-auto transition-all duration-500 ${
            active === "lockets" ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <StreakLocket recentPosts={recentPosts} />
        </div>
        {/* {active === "rollcall" && } */}
        {/* {active === "lockets" && <StreakLocket recentPosts={recentPosts} />} */}
      </div>

      {/* ==== Bottom Segmented Toggle ==== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-base-100">
        <SegmentedToggle active={active} setActive={handleToggle} />
      </div>
    </div>
  );
};

export default LeftHomeScreen;
