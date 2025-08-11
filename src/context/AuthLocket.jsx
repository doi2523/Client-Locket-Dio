import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import PropTypes from "prop-types";
import * as utils from "@/utils";
import {
  getListIdFriends,
  GetUserData,
  loadFriendDetails,
  updateUserInfo,
  GetLastestMoment,
} from "@/services";

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

  const [friendDetails, setFriendDetails] = useState([]);

  const [userPlan, setUserPlan] = useState(null);

  const [uploadStats, setUploadStats] = useState(() => {
    const saved = localStorage.getItem("uploadStats");
    return saved ? JSON.parse(saved) : null;
  });

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "default"
  );

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("streak");
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
      } catch (error) {
        console.error("❌ Lỗi khi fetch friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user, authTokens?.idToken, friends.length]);

  //Lấy thông tin hiện tại của người dùng
  useEffect(() => {
    if (!user || !authTokens?.idToken || !authTokens?.localId) return;

    const init = async () => {
      if (!hasFetchedPlan.current) {
        const userData = await GetUserData();

        setUserPlan(userData);
        setUploadStats(userData?.upload_stats);

        const data = await GetLastestMoment();
        if (data?.streak) {
          setStreak(data.streak);
          localStorage.setItem("streak", JSON.stringify(data.streak));
        }
      }

      await updateUserInfo(user); // Gọi sau khi fetchPlan hoàn tất
    };

    init();
  }, [user, authTokens?.idToken, authTokens?.localId]);

  // Load friend details và cache thông minh
  useEffect(() => {
    const fetchDetails = async () => {
      const data = await loadFriendDetails(friends);
      setFriendDetails(data);
    };

    fetchDetails();
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
  }, [user?.uid]); // Chỉ reset khi user ID thay đổi

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
      streak,
      setStreak,
    }),
    [
      user,
      loading,
      friends,
      friendDetails,
      userPlan,
      authTokens,
      uploadStats,
      streak,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
