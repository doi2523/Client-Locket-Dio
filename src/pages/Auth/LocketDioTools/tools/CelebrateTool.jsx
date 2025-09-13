import React, { useState, useEffect } from "react";
import { showInfo, showError } from "@/components/Toast";
import axios from "axios";
import { CONFIG } from "@/config";
import { fetchUserV2 } from "@/services";
import CelebrateItem from "../CelebrateItem";
import { SonnerInfo, SonnerWarning } from "@/components/ui/SonnerToast";

export default function CelebrateTool() {
  const [celebrateList, setCelebrateList] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUid, setNewUid] = useState("");
  const [activeTab, setActiveTab] = useState("friends");

  // --- 1. Lấy danh sách celebrate ban đầu ---
  useEffect(() => {
    const fetchCelebrates = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${CONFIG.api.database}/locketpro/getAllCelebrate`
        );
        setCelebrateList(res.data || []);
      } catch (err) {
        showError("❌ Không thể tải danh sách Celebrate.");
      } finally {
        setLoading(false);
      }
    };
    fetchCelebrates();
  }, []);

  // --- 2. Khi celebrateList thay đổi → fetch chi tiết user ---
  useEffect(() => {
    if (celebrateList.length === 0) {
      setUserDetails([]);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const details = await Promise.all(
          celebrateList.map((item) => fetchUserV2(item.uid))
        );
        setUserDetails(details.filter(Boolean));
      } catch (err) {
        showError("❌ Không thể tải chi tiết user.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [celebrateList]);

  const handleAddUid = async (uid) => {
    if (!uid.trim()) return SonnerInfo("⚠️ Nhập UID trước đã!");

    try {
    //   setCelebrateList([...celebrateList, res.data]);
      SonnerWarning("Thông báo","Chức năng này đang được phát triển!");
    } catch (err) {
      showError("❌ Thêm UID thất bại.");
    }
  };

  // --- Phân loại user ---
  const categorized = {
    friends: userDetails.filter((u) => u.friendship_status === "friends"),
    waitlist: userDetails.filter(
      (u) => u.friendship_status === "follower-waitlist"
    ),
    hasSlot: userDetails.filter(
      (u) => u.celebrity_data.friend_count < u.celebrity_data.max_friends
    ),
    noSlot: userDetails.filter(
      (u) => u.celebrity_data.friend_count >= u.celebrity_data.max_friends
    ),
  };

  // --- Skeleton Loading Component ---
  const SkeletonItem = () => (
    <div className="animate-pulse flex flex-col gap-2 p-3 rounded-md border bg-base-200 m-2">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-gray-300 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="w-32 h-4 bg-gray-300 rounded" />
          <div className="w-20 h-3 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">
        Celebrate Tool
        <span className="badge badge-sm badge-accent ml-2">New</span>
      </h2>
      <p>
        Công cụ này giúp bạn xem được thông tin celebrate hoặc tình trạng slot
        của họ.
      </p>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-3">
        <a
          className={`tab ${activeTab === "friends" ? "tab-active font-semibold" : ""}`}
          onClick={() => setActiveTab("friends")}
        >
          Bạn bè ({categorized.friends.length})
        </a>
        <a
          className={`tab ${activeTab === "waitlist" ? "tab-active font-semibold" : ""}`}
          onClick={() => setActiveTab("waitlist")}
        >
          Chờ kết bạn ({categorized.waitlist.length})
        </a>
        <a
          className={`tab ${activeTab === "hasSlot" ? "tab-active font-semibold" : ""}`}
          onClick={() => setActiveTab("hasSlot")}
        >
          Còn slot ({categorized.hasSlot.length})
        </a>
        <a
          className={`tab ${activeTab === "noSlot" ? "tab-active font-semibold" : ""}`}
          onClick={() => setActiveTab("noSlot")}
        >
          Hết slot ({categorized.noSlot.length})
        </a>
      </div>

      {/* Danh sách user details */}
      <div className="border rounded-lg h-96 overflow-y-auto">
        {loading ? (
          // Hiện skeleton khi loading
          <>
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </>
        ) : categorized[activeTab]?.length > 0 ? (
          categorized[activeTab].map((user) => (
            <CelebrateItem key={user.uid} user={user} onAdd={handleAddUid}/>
          ))
        ) : (
          <p className="text-sm opacity-70 p-3">📭 Không có dữ liệu.</p>
        )}
      </div>
    </div>
  );
}
