import React, { useState, useEffect } from "react";
import axios from "axios";
import { CONFIG } from "@/config";
import { fetchUserV2 } from "@/services";
import CelebrateItem from "../CelebrateItem";
import {
  SonnerError,
  SonnerInfo,
  SonnerSuccess,
  SonnerWarning,
} from "@/components/ui/SonnerToast";
import { Copy, RefreshCcw } from "lucide-react";
import api from "@/lib/axios";
import { useFeatureVisible, useGetCode } from "@/hooks/useFeature";
import { PiExport } from "react-icons/pi";

export default function CelebrateTool() {
  const isCelebrityFeature = useFeatureVisible("celebrity_tool");
  const codeUser = useGetCode();
  const [celebrateList, setCelebrateList] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // --- Fetch danh sách celebrate (cache 7 ngày trong localStorage) ---
  const fetchCelebrates = async () => {
    setLoading(true);
    try {
      const cacheKey = "celebrate_cache";
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const now = Date.now();
        const sevenDays = 3 * 60 * 60 * 1000;

        // Kiểm tra hạn cache + dữ liệu hợp lệ
        if (data && data.length > 0 && now - timestamp < sevenDays) {
          setCelebrateList(data);
          setLoading(false);
          return;
        }
      }

      // Nếu chưa có cache, cache hết hạn, hoặc data rỗng thì gọi API
      const res = await axios.get(
        `${CONFIG.api.database}/locketpro/getAllCelebrate`
      );
      const data = res.data || [];

      setCelebrateList(data);

      // Lưu cache kèm timestamp
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      SonnerError("Không thể tải danh sách Celebrate.");
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
      SonnerError(
        "Phiên đăng nhập hết hạn",
        "Vui lòng xoá tab và truy cập lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Gọi API khi mount ---
  useEffect(() => {
    if (isCelebrityFeature) {
      fetchCelebrates();
    }
  }, [isCelebrityFeature]);

  // --- Khi celebrateList thay đổi thì fetch chi tiết ---
  useEffect(() => {
    if (celebrateList.length > 0 && isCelebrityFeature) {
      fetchDetails(celebrateList);
    }
  }, [celebrateList, isCelebrityFeature]);

  const handleAddUid = async (uid) => {
    if (!uid.trim()) return SonnerInfo("⚠️ Nhập UID trước đã!");
    try {
      // await api.post(`/locket/sendFriendRequestV2`, {
      //   data: { friendUid: uid },
      // });
      SonnerWarning("Thông báo", "Chức năng này đang được phát triển!");
    } catch (err) {
      SonnerWarning("❌ Thêm UID thất bại.");
    }
  };

  const exportPDF = async () => {
    const res = await fetch(`${CONFIG.api.exportApi}/generate-pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: userDetails,
      }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "danh_sach.pdf";
    link.click();
  };

  // --- Phân loại user ---
  const categorized = {
    all: userDetails,
    friends: userDetails.filter((u) => u.friendship_status === "friends"),
    waitlist: userDetails.filter(
      (u) => u.friendship_status === "follower-waitlist"
    ),
    waitaccept: userDetails.filter(
      (u) => u.friendship_status === "outgoing-follow-request"
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

  // Nếu không có quyền truy cập
  if (!isCelebrityFeature) {
    const handleCopy = (text) => {
      navigator.clipboard.writeText(text);
      SonnerSuccess("Đã copy vào clipboard");
    };

    return (
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="text-6xl">🔒</div>
        <h3 className="text-xl font-semibold">Tính năng bị khóa</h3>
        <p className="text-sm opacity-70 max-w-md">
          Bạn không có quyền truy cập vào <b>Celebrity Tool</b>. Để mở khóa, vui
          lòng quét mã QR hoặc chuyển khoản theo thông tin bên dưới.
        </p>
        <p className="text-sm opacity-70 max-w-md">
          {" "}
          <span className="block">
            • Vui lòng nhập đúng nội dung yêu cầu.
          </span>{" "}
          <span className="block">• Gói sẽ được kích hoạt sau 1–2 phút.</span>{" "}
          <span className="block">• Hỗ trợ qua trang liên hệ.</span>{" "}
        </p>

        {/* QR code */}
        <img
          src={CONFIG.app.bankInfo.urlImg}
          alt="QR Thanh toán"
          className="w-40 h-40 border rounded-lg shadow-md"
        />

        {/* Thông tin chuyển khoản */}
        <div className="bg-base-200 rounded-lg p-3 text-sm leading-relaxed w-80 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <p>
              <b>Ngân hàng:</b> {CONFIG.app.bankInfo.bankName}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p>
              <b>Số tài khoản:</b> {CONFIG.app.bankInfo.accountNumber}
            </p>
            <button
              onClick={() => handleCopy(CONFIG.app.bankInfo.accountNumber)}
              className="p-1 hover:bg-base-300 rounded"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p>
              <b>Chủ tài khoản:</b> {CONFIG.app.bankInfo.accountName}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p>
              <b>Nội dung:</b> {codeUser} CT
            </p>
            <button
              onClick={() => handleCopy(`${codeUser} CT`)}
              className="p-1 hover:bg-base-300 rounded"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p>
              <b>Số tiền:</b> 5.000 VND
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">
          Celebrity Tool
          <span className="badge badge-sm badge-accent ml-2">New</span>
        </h2>
        {/* Nút làm mới */}
        <div className="flex gap-2 flex-row">
          <button
            onClick={fetchCelebrates}
            className="flex items-center gap-1 text-sm px-2 py-1 rounded-md border hover:bg-base-200"
          >
            <RefreshCcw className="w-4 h-4" /> Làm mới
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-1 text-sm px-2 py-1 rounded-md border hover:bg-base-200"
          >
            <PiExport className="w-4 h-4" /> Xuất PDF
          </button>
        </div>
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
                <button
          className={`px-3 py-1 rounded-lg ${
            activeTab === "waitaccept" ? "bg-blue-500 text-white" : "bg-base-200"
          }`}
          onClick={() => setActiveTab("waitaccept")}
        >
          Chờ chấp nhận ({categorized.waitaccept.length})
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
