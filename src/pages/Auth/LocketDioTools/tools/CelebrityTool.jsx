import React, { useState, useEffect } from "react";
import axios from "axios";
import { CONFIG } from "@/config";
import { fetchUserV2 } from "@/services";
import CelebrateItem from "../CelebrateItem";
import { SonnerError, SonnerInfo, SonnerWarning } from "@/components/ui/SonnerToast";
import { RefreshCcw } from "lucide-react";
import api from "@/lib/axios";

export default function CelebrateTool() {
  const [celebrateList, setCelebrateList] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // --- Fetch danh sách celebrate ---
  const fetchCelebrates = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${CONFIG.api.database}/locketpro/getAllCelebrate`
      );
      setCelebrateList(res.data || []);
    } catch (err) {
      SonnerError("❌ Không thể tải danh sách Celebrate.");
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch chi tiết user ---
  const fetchDetails = async (list) => {
    if (list.length === 0) {
      setUserDetails([]);
      return;
    }
    setLoading(true);
    try {
      const details = await Promise.all(
        list.map((item) => fetchUserV2(item.uid))
      );
      setUserDetails(details.filter(Boolean));
    } catch (err) {
      SonnerError("Phiên đăng nhập hết hạn","Vui lòng xoá tab và truy cập lại.");
    } finally {
      setLoading(false);
    }
  };

  // --- Gọi API khi mount ---
  useEffect(() => {
    fetchCelebrates();
  }, []);

  // --- Khi celebrateList thay đổi thì fetch chi tiết ---
  useEffect(() => {
    if (celebrateList.length > 0) {
      fetchDetails(celebrateList);
    }
  }, [celebrateList]);

  const handleAddUid = async (uid) => {
    if (!uid.trim()) return SonnerInfo("⚠️ Nhập UID trước đã!");
    try {
      await api.post(`/locket/sendFriendRequestV2`, {
        data: { friendUid: uid },
      });
      SonnerWarning("Thông báo", "Chức năng này đang được phát triển!");
    } catch (err) {
      SonnerWarning("❌ Thêm UID thất bại.");
    }
  };

  // --- Phân loại user ---
  const categorized = {
    all: userDetails,
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
    <div className="animate-pulse flex flex-col gap-2 p-3 rounded-3xl bg-base-200 m-2">
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
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">
          Celebrity Tool
          <span className="badge badge-sm badge-accent ml-2">New</span>
        </h2>
        {/* Nút làm mới */}
        <button
          onClick={fetchCelebrates}
          className="flex items-center gap-1 text-sm px-2 py-1 rounded-md border hover:bg-base-200"
        >
          <RefreshCcw className="w-4 h-4" /> Làm mới
        </button>
      </div>
      <p className="mb-3 text-sm opacity-80">
        Công cụ này giúp bạn xem được thông tin celebrity hoặc tình trạng slot
        của họ. Click vào username để copy link kết bạn.
      </p>

      {/* Tabs → Chuyển thành nút */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <button
          className={`px-3 py-1 rounded-lg ${
            activeTab === "all" ? "bg-blue-500 text-white" : "bg-base-200"
          }`}
          onClick={() => setActiveTab("all")}
        >
          Tất cả ({categorized.all.length})
        </button>
        <button
          className={`px-3 py-1 rounded-lg ${
            activeTab === "friends" ? "bg-blue-500 text-white" : "bg-base-200"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          Bạn bè ({categorized.friends.length})
        </button>
        <button
          className={`px-3 py-1 rounded-lg ${
            activeTab === "waitlist" ? "bg-blue-500 text-white" : "bg-base-200"
          }`}
          onClick={() => setActiveTab("waitlist")}
        >
          Xếp hàng ({categorized.waitlist.length})
        </button>
        <button
          className={`px-3 py-1 rounded-lg ${
            activeTab === "hasSlot" ? "bg-blue-500 text-white" : "bg-base-200"
          }`}
          onClick={() => setActiveTab("hasSlot")}
        >
          Còn slot ({categorized.hasSlot.length})
        </button>
        <button
          className={`px-3 py-1 rounded-lg ${
            activeTab === "noSlot" ? "bg-blue-500 text-white" : "bg-base-200"
          }`}
          onClick={() => setActiveTab("noSlot")}
        >
          Hết slot ({categorized.noSlot.length})
        </button>
      </div>

      {/* Danh sách user details */}
      <div className="border rounded-sm h-96 overflow-y-auto">
        {loading ? (
          <>
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </>
        ) : categorized[activeTab]?.length > 0 ? (
          categorized[activeTab].map((user) => (
            <CelebrateItem key={user.uid} user={user} onAdd={handleAddUid} />
          ))
        ) : (
          <p className="text-sm opacity-70 p-3">📭 Không có dữ liệu.</p>
        )}
      </div>
    </div>
  );
}
