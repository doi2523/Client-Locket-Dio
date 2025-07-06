import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import PropTypes from "prop-types";
import * as utils from "../utils";
import { showInfo } from "../components/Toast";
import {
  fetchUser,
  fetchUserPlan,
  getListIdFriends,
  getUserUploadStats,
  registerFreePlan,
} from "../services";
import api from "../lib/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(utils.getUser());
  const [authTokens, setAuthTokens] = useState(() => utils.getToken());
  const [loading, setLoading] = useState(true);

  // Refs để tracking trạng thái fetch
  const hasFetchedFriends = useRef(false);
  const hasFetchedPlan = useRef(false);
  const hasFetchedUploadStats = useRef(false);
  const isConnected = useRef(false);

  const [friends, setFriends] = useState(() => {
    const saved = localStorage.getItem("friendsList");
    return saved ? JSON.parse(saved) : [];
  });

  const [friendDetails, setFriendDetails] = useState(() => {
    const saved = localStorage.getItem("friendDetails");
    return saved ? JSON.parse(saved) : [];
  });

  const [userPlan, setUserPlan] = useState(() => {
    const saved = localStorage.getItem("userPlan");
    return saved ? JSON.parse(saved) : null;
  });

  const [uploadStats, setUploadStats] = useState(() => {
    const saved = localStorage.getItem("uploadStats");
    return saved ? JSON.parse(saved) : null;
  });

  // Chỉ ping API một lần khi component mount
  // useEffect(() => {
  //   if (!isConnected.current) {
  //     api
  //       .get("/")
  //       .then(() => {
  //         console.log("✅ Connected");
  //         isConnected.current = true;
  //       })
  //       .catch((err) => console.warn("❌ Ping lỗi", err));
  //   }
  // }, []);

  useEffect(() => {
    localStorage.removeItem("failedUploads");
  }, []);

  // Fetch friends chỉ khi cần thiết
  useEffect(() => {
    const fetchFriends = async () => {
      // Kiểm tra điều kiện cần thiết để fetch
      if (!user || !authTokens?.idToken || friends.length > 0) {
        setLoading(false);
        return;
      }

      // Kiểm tra localStorage trước
      const savedFriends = localStorage.getItem("friendsList");
      if (savedFriends) {
        try {
          const parsed = JSON.parse(savedFriends);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFriends(parsed);
            hasFetchedFriends.current = true;
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("❌ Parse friendsList error:", error);
        }
      }

      // Fetch từ API
      try {
        const friendsList = await getListIdFriends();
        setFriends(friendsList);
        localStorage.setItem("friendsList", JSON.stringify(friendsList));
        hasFetchedFriends.current = true;

        // Fetch plan sau khi có friends
        if (!hasFetchedPlan.current) {
          fetchPlan(user, authTokens.idToken);
        }
      } catch (error) {
        console.error("❌ Lỗi khi fetch friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user, authTokens?.idToken, friends.length]);

  // Fetch plan với cache, điều kiện và retry logic
  const fetchPlan = async (user, idToken) => {
    if (hasFetchedPlan.current || !user || !idToken) return;

    try {
      // Kiểm tra cache với timestamp
      const cachedPlan = localStorage.getItem("userPlan");
      const planTimestamp = localStorage.getItem("userPlanTimestamp");
      const PLAN_CACHE_DURATION = 5 * 60 * 60 * 1000; // 5 phút

      if (cachedPlan && planTimestamp) {
        try {
          const parsed = JSON.parse(cachedPlan);
          const timestamp = parseInt(planTimestamp);
          const now = Date.now();

          // Cache còn hạn và có valid data
          if (parsed && parsed.id && now - timestamp < PLAN_CACHE_DURATION) {
            setUserPlan(parsed);
            hasFetchedPlan.current = true;
            return;
          }
        } catch (error) {
          console.error("❌ Parse userPlan cache error:", error);
          // Clear corrupted cache
          localStorage.removeItem("userPlan");
          localStorage.removeItem("userPlanTimestamp");
        }
      }

      // Fetch plan từ API
      let plan = null;
      try {
        plan = await fetchUserPlan();
      } catch (error) {
        console.error("❌ fetchUserPlan failed:", error);
      }

      // Nếu không có plan, register free plan
      if (!plan) {
        try {
          const res = await registerFreePlan(user, idToken);
          if (res?.data) {
            plan = res.data;
          }
        } catch (error) {
          console.error("❌ registerFreePlan failed:", error);
          // Set default free plan nếu API fail
          plan = {
            id: "free_default",
            type: "free",
            name: "Free Plan",
            limits: { storage: 100, uploads: 10 },
          };
        }
      }

      // Lưu plan với timestamp
      if (plan) {
        setUserPlan(plan);
        localStorage.setItem("userPlan", JSON.stringify(plan));
        localStorage.setItem("userPlanTimestamp", Date.now().toString());
        hasFetchedPlan.current = true;
      }
    } catch (err) {
      console.error("❌ Critical error in fetchPlan:", err);
      // Fallback: set basic free plan
      const fallbackPlan = {
        id: "free_fallback",
        type: "free",
        name: "Free Plan",
        limits: { storage: 100, uploads: 10 },
      };
      setUserPlan(fallbackPlan);
      hasFetchedPlan.current = true;
    }
  };

  // Fetch upload stats với cache
  useEffect(() => {
    const fetchUploadStats = async () => {
      if (!authTokens?.localId || hasFetchedUploadStats.current) return;

      // Kiểm tra cache trước
      const cachedStats = localStorage.getItem("uploadStats");
      if (cachedStats) {
        try {
          const parsed = JSON.parse(cachedStats);
          if (parsed) {
            setUploadStats(parsed);
            hasFetchedUploadStats.current = true;
            return;
          }
        } catch (error) {
          console.error("❌ Parse uploadStats error:", error);
        }
      }

      try {
        const data = await getUserUploadStats(authTokens.localId);
        if (data) {
          localStorage.setItem("uploadStats", JSON.stringify(data));
          setUploadStats(data);
          hasFetchedUploadStats.current = true;
        }
      } catch (error) {
        console.error("❌ Lỗi khi fetch upload stats:", error);
      }
    };

    fetchUploadStats();
  }, [authTokens?.localId]);

  // Load friend details với debounce và cache thông minh
  useEffect(() => {
    const loadFriendDetails = async () => {
      const savedDetails = localStorage.getItem("friendDetails");

      if (savedDetails) {
        try {
          const parsedDetails = JSON.parse(savedDetails);
          setFriendDetails(parsedDetails);
        } catch (error) {
          console.error("❌ Parse friendDetails error:", error);
        }
      }

      if (!friends || friends.length === 0) {
        return; // Không fetch nếu không có bạn bè
      }

      const savedUids = JSON.parse(savedDetails || "[]")
        .map((f) => f.uid)
        .sort();
      const currentUids = friends.map((f) => f.uid).sort();

      const isSameList =
        savedUids.length === currentUids.length &&
        savedUids.every((uid, idx) => uid === currentUids[idx]);

      if (isSameList) {
        return; // ✅ Cache hợp lệ rồi
      }

      // Tiến hành fetch chi tiết
      const batchSize = 10;
      const allResults = [];

      for (let i = 0; i < friends.length; i += batchSize) {
        const batch = friends.slice(i, i + batchSize);
        try {
          const results = await Promise.allSettled(
            batch.map((friend) =>
              fetchUser(friend?.uid).then((res) =>
                utils.normalizeFriendData(res.data)
              )
            )
          );

          const successResults = results
            .filter((result) => result.status === "fulfilled" && result.value)
            .map((result) => result.value);

          allResults.push(...successResults);
          if (i + batchSize < friends.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        } catch (err) {
          console.error("❌ Lỗi khi xử lý batch:", err);
        }
      }

      setFriendDetails(allResults);
      try {
        localStorage.setItem("friendDetails", JSON.stringify(allResults));
      } catch (error) {
        console.error("❌ Lỗi khi lưu vào localStorage:", error);
      }
    };

    loadFriendDetails();
  }, [friends]);

  // Reset context và refs
  const resetAuthContext = () => {
    setUser(null);
    setAuthTokens(null);
    setFriends([]);
    setFriendDetails([]);
    setUserPlan(null);
    setUploadStats(null);

    // Reset refs
    hasFetchedFriends.current = false;
    hasFetchedPlan.current = false;
    hasFetchedUploadStats.current = false;
    isConnected.current = false;

    // Clear storage với timestamp
    utils.removeUser();
    utils.removeToken();
    localStorage.removeItem("friendsList");
    localStorage.removeItem("friendDetails");
    localStorage.removeItem("friendDetailsTimestamp");
    localStorage.removeItem("userPlan");
    localStorage.removeItem("userPlanTimestamp");
    localStorage.removeItem("uploadStats");
  };

  // Reset refs khi user thay đổi
  useEffect(() => {
    hasFetchedFriends.current = false;
    hasFetchedPlan.current = false;
    hasFetchedUploadStats.current = false;
    setFriendDetails([]);
  }, [user?.uid]); // Chỉ reset khi user ID thay đổi

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "default"
  );

  // Cập nhật theme khi thay đổi
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    // Lấy màu thực tế từ biến CSS
    const computedStyle = getComputedStyle(document.documentElement);
    const baseColor =
      computedStyle.getPropertyValue("--color-base-100")?.trim() || "#ffffff";

    // Cập nhật meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", baseColor);
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "theme-color";
      newMeta.content = baseColor;
      document.head.appendChild(newMeta);
    }
  }, [theme]);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      loading,
      friends,
      setFriends,
      friendDetails,
      setFriendDetails,
      userPlan,
      setUserPlan,
      authTokens,
      setAuthTokens,
      resetAuthContext,
      uploadStats,
      setUploadStats,
    }),
    [user, loading, friends, friendDetails, userPlan, authTokens, uploadStats]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
