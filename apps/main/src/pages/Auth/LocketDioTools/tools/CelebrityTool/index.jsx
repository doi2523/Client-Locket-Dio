import React, { useState, useEffect } from "react";
import { CONFIG } from "@/config";
import {
  fetchUserById,
  getListCelebrityV2,
  SendRequestToCelebrity,
} from "@/services";
import CelebrateItem from "./components/CelebrateItem";
import SkeletonItem from "./components/SkeletonItem";
import FilterButton from "./components/FilterButton";
import {
  SonnerError,
  SonnerInfo,
  SonnerPromise,
  SonnerSuccess,
  SonnerWarning,
} from "@/components/ui/SonnerToast";
import { Copy, RefreshCcw } from "lucide-react";
import { useFeatureVisible, useGetCode } from "@/hooks/useFeature";
import { PiExport } from "react-icons/pi";
import LockedFeature from "../../Layout/LockedFeature";
import { useAuthStore } from "@/stores";
import { useNavigate } from "react-router-dom";

export default function CelebrateTool() {
  const isCelebrityFeature = useFeatureVisible("celebrity_tool");
  const codeUser = useGetCode();
  const navigate = useNavigate();
  const fetchUserData = useAuthStore((s) => s.fetchUserData);
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [processingUid, setProcessingUid] = useState(null);

  const [celebrateList, setCelebrateList] = useState({});
  const [userMap, setUserMap] = useState({});
  // 🔥 load country từ localStorage
  const [countryCode, setCountryCode] = useState(() => {
    return localStorage.getItem("celebrate_country") || "ALL";
  });

  // 🔥 lưu lại khi đổi country
  useEffect(() => {
    localStorage.setItem("celebrate_country", countryCode);
  }, [countryCode]);

  const fetchCelebrates = async () => {
    setLoading(true);

    try {
      const cacheKey = "celebrate_cache";
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);

        const now = Date.now();
        const threeHours = 3 * 60 * 60 * 1000;

        if (data && now - timestamp < threeHours) {
          setCelebrateList(data);
          setLoading(false);
          return;
        }
      }

      const result = await getListCelebrityV2();

      setCelebrateList(result || {});

      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: result,
          timestamp: Date.now(),
        }),
      );
    } catch (err) {
      SonnerError("Không thể tải danh sách Celebrate.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (list) => {
    if (!list?.length) return;

    setLoading(true);

    try {
      const details = await Promise.all(
        list.map((item) => fetchUserById(item?.uid)),
      );

      const validUsers = details.filter(Boolean);

      // 🔥 merge vào cache
      setUserMap((prev) => {
        const newMap = { ...prev };

        validUsers.forEach((user) => {
          newMap[user.uid] = user;
        });

        return newMap;
      });

      // 🔥 build lại danh sách hiện tại
      let currentList = [];

      if (countryCode === "ALL") {
        currentList = Object.values(celebrateList).flat();
      } else {
        currentList = celebrateList[countryCode] || [];
      }

      setUserDetails(
        currentList
          .map((item) => {
            return (
              validUsers.find((u) => u.uid === item.uid) || userMap[item.uid]
            );
          })
          .filter(Boolean),
      );
    } catch (err) {
      SonnerError(
        "Phiên đăng nhập hết hạn",
        "Vui lòng xoá tab và truy cập lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    const refreshPromise = (async () => {
      // lấy list mới
      const result = await getListCelebrityV2();

      setCelebrateList(result || {});

      localStorage.setItem(
        "celebrate_cache",
        JSON.stringify({
          data: result,
          timestamp: Date.now(),
        }),
      );

      // chỉ lấy country hiện tại
      let currentList = [];

      if (countryCode === "ALL") {
        currentList = Object.values(result || {}).flat();
      } else {
        currentList = result?.[countryCode] || [];
      }

      // fetch users
      const details = await Promise.all(
        currentList.map((item) => fetchUserById(item?.uid)),
      );

      const validUsers = details.filter(Boolean);

      // update cache map
      setUserMap((prev) => {
        const newMap = { ...prev };

        validUsers.forEach((user) => {
          newMap[user.uid] = user;
        });

        return newMap;
      });

      // update UI
      setUserDetails(validUsers);

      return {
        total: validUsers.length,
        country: countryCode,
      };
    })();

    setLoading(true);

    try {
      SonnerPromise(refreshPromise, {
        loading: "Đang làm mới dữ liệu...",
        success: (data) =>
          `Đã làm mới ${data?.total || 0} tài khoản (${data?.country})`,
        error: (error) => {
          const status = error?.status || error?.response?.status;

          switch (status) {
            case 401:
              return "Phiên đăng nhập đã hết hạn!";
            case 429:
              return "Bạn thao tác quá nhanh. Vui lòng thử lại sau!";
            case 500:
              return "Lỗi hệ thống. Vui lòng thử lại!";
            default:
              return error?.message || "Không thể làm mới dữ liệu.";
          }
        },
      });

      await refreshPromise;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isCelebrityFeature) {
      fetchCelebrates();
    }
  }, [isCelebrityFeature]);

  useEffect(() => {
    if (!isCelebrityFeature) return;

    let currentList = [];

    if (countryCode === "ALL") {
      currentList = Object.values(celebrateList).flat();
    } else {
      currentList = celebrateList[countryCode] || [];
    }

    const missingUsers = currentList.filter((item) => !userMap[item.uid]);

    // 🔥 nếu đã có đủ thì chỉ set local
    if (missingUsers.length === 0) {
      setUserDetails(
        currentList.map((item) => userMap[item.uid]).filter(Boolean),
      );

      return;
    }

    // 🔥 chỉ fetch những uid chưa có
    fetchDetails(missingUsers);
  }, [celebrateList, countryCode, isCelebrityFeature]);

  const handleAddUid = async (uid) => {
    if (!uid || !uid.trim()) {
      return SonnerInfo("Nhập UID trước đã!");
    }

    if (processingUid === uid) return;

    setProcessingUid(uid);

    try {
      const res = await SendRequestToCelebrity(uid);

      if (res?.success) {
        SonnerSuccess(
          "Đã gửi yêu cầu thành công!",
          "Đang cập nhật trạng thái...",
        );

        const updatedUser = await fetchUserById(uid);

        if (updatedUser) {
          setUserDetails((prev) =>
            prev.map((u) => (u.uid === uid ? { ...u, ...updatedUser } : u)),
          );
        }
      } else {
        SonnerWarning("UID không hợp lệ hoặc đã tồn tại!");
      }
    } catch (err) {
      SonnerError("❌ Thêm UID thất bại.");
    } finally {
      setProcessingUid(null);
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

  const categorized = {
    all: userDetails,
    friends: userDetails.filter((u) => u?.friendship_status === "friends"),
    waitlist: userDetails.filter(
      (u) => u?.friendship_status === "follower-waitlist",
    ),
    waitaccept: userDetails.filter(
      (u) => u?.friendship_status === "outgoing-follow-request",
    ),
    hasSlot: userDetails.filter(
      (u) => u?.celebrity_data?.friend_count < u?.celebrity_data?.max_friends,
    ),
    noSlot: userDetails.filter(
      (u) => u?.celebrity_data?.friend_count >= u?.celebrity_data?.max_friends,
    ),
  };

  const tabs = [
    {
      key: "all",
      label: "Tất cả",
      count: categorized.all.length,
    },
    {
      key: "friends",
      label: "Bạn bè",
      count: categorized.friends.length,
    },
    {
      key: "waitlist",
      label: "Xếp hàng",
      count: categorized.waitlist.length,
    },
    {
      key: "hasSlot",
      label: "Còn slot",
      count: categorized.hasSlot.length,
    },
    {
      key: "noSlot",
      label: "Hết slot",
      count: categorized.noSlot.length,
    },
    {
      key: "waitaccept",
      label: "Chờ chấp nhận",
      count: categorized.waitaccept.length,
    },
  ];

  // Nếu không có quyền truy cập
  if (!isCelebrityFeature) {
    return (
      <div className="rounded-xl border p-4 text-center flex flex-col items-center gap-3">
        <div className="text-6xl">🔒</div>

        <h3 className="text-xl font-semibold">Tính năng bị khóa</h3>

        <p className="text-sm text-gray-500">
          Đăng ký gói để kích hoạt tính năng này
        </p>

        <button
          onClick={() => navigate("/pricing")}
          className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90 transition"
        >
          Xem ngay
        </button>
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
            onClick={handleRefresh}
            className="flex items-center gap-1 text-sm px-2 py-1 rounded-md border hover:bg-base-200"
            disabled={loading}
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
        của họ. Click vào username để copy link kết bạn. Bấm thêm để gửi kết bạn
        tới họ nhé!
      </p>
      <div className="mb-3 text-sm opacity-80 leading-relaxed space-y-1">
        <p>1. Chỉ cần làm mới khi cần thiết.</p>
        <p>2. Không spam yêu cầu quá nhiều để tránh ảnh hưởng tới tài khoản.</p>
      </div>
      <h3 className="font-semibold text-sm uppercase opacity-70">
        Danh mục quốc gia
      </h3>

      <div className="flex gap-2 mb-3 flex-wrap">
        <FilterButton
          label="ALL"
          count={Object.values(celebrateList).flat().length}
          active={countryCode === "ALL"}
          activeClass="bg-green-500 text-white"
          onClick={() => setCountryCode("ALL")}
        />

        {Object.keys(celebrateList).map((code) => (
          <FilterButton
            key={code}
            label={code}
            count={celebrateList[code]?.length || 0}
            active={countryCode === code}
            activeClass="bg-green-500 text-white"
            onClick={() => setCountryCode(code)}
          />
        ))}
      </div>

      <h3 className="font-semibold text-sm uppercase opacity-70">
        Bộ lọc nhanh
      </h3>

      <div className="flex gap-2 mb-3 flex-wrap">
        {tabs.map((tab) => (
          <FilterButton
            key={tab.key}
            label={tab.label}
            count={tab.count}
            active={activeTab === tab.key}
            activeClass="bg-blue-500 text-white"
            onClick={() => setActiveTab(tab.key)}
          />
        ))}
      </div>
      {/* Danh sách user details */}
      <div className="border rounded-sm h-96 overflow-y-auto">
        {loading ? (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonItem key={index} />
            ))}
          </>
        ) : categorized[activeTab]?.length > 0 ? (
          categorized[activeTab].map((user) => (
            <CelebrateItem
              key={user?.uid}
              user={user}
              slotdata={user?.celebrity_data}
              onAdd={handleAddUid}
              loadingUid={processingUid}
            />
          ))
        ) : (
          <p className="text-sm opacity-70 p-3">📭 Không có dữ liệu.</p>
        )}
      </div>
    </div>
  );
}
