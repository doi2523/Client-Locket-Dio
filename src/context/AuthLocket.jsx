import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import PropTypes from "prop-types";
import * as utils from "@/utils";
import { GetUserData, updateUserInfo } from "@/services";
import { fetchAndSyncFriendDetails } from "@/utils/SyncData/friendSyncUtils";
import { fetchStreak } from "@/utils/SyncData/streakUtils";
import { getAllFriendDetails } from "@/cache/friendsDB";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(utils.getUser());
  const [authTokens, setAuthTokens] = useState(() => utils.getToken());
  const [loading, setLoading] = useState(false);

  const hasFetchedPlan = useRef(false);

  const [friendDetails, setFriendDetails] = useState([]);

  const [userPlan, setUserPlan] = useState(null);
  const [uploadStats, setUploadStats] = useState(null);
  const [streak, setStreak] = useState(() =>
    JSON.parse(localStorage.getItem("streak") || "null")
  );

  useEffect(() => {
    localStorage.removeItem("failedUploads");
    localStorage.removeItem("friendsList");
    localStorage.removeItem("uploadedMoments");
    localStorage.removeItem("uploadedPayloads");
  }, []);

  useEffect(() => {
    const loadFriends = async () => {
      if (!user || !authTokens?.idToken) return;

      // 1. Lấy dữ liệu local trước để hiển thị ngay
      const localFriends = await getAllFriendDetails();
      setFriendDetails(localFriends);

      // 2. Sau đó đồng bộ với server (background update)
      const updatedDetails = await fetchAndSyncFriendDetails();
      setFriendDetails(updatedDetails);
    };

    loadFriends();
  }, [user, authTokens?.idToken]);

  // 🔹 Fetch user plan
  useEffect(() => {
    if (!user || !authTokens?.idToken || !authTokens?.localId) return;

    const init = async () => {
      if (!hasFetchedPlan.current) {
        const userData = await GetUserData();
        setUserPlan(userData);
        setUploadStats(userData?.upload_stats);
        fetchStreak(setStreak);
      }
      await updateUserInfo(user);
    };

    init();
  }, [user, authTokens?.idToken, authTokens?.localId]);

  // 🔹 Reset context
  const resetAuthContext = () => {
    setUser(null);
    setAuthTokens(null);
    setFriendDetails([]);
    setUserPlan(null);
    setUploadStats(null);

    hasFetchedPlan.current = false;

    utils.removeUser();
    utils.removeToken();
    localStorage.removeItem("friendsList");
    localStorage.removeItem("userPlan");
    localStorage.removeItem("uploadStats");
  };

  const refreshStreak = (newStreak) => {
    setStreak(newStreak);
    localStorage.setItem("streak", JSON.stringify(newStreak));
  };

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      loading,
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
      fetchStreak,
      refreshStreak,
    }),
    [user, loading, friendDetails, userPlan, authTokens, uploadStats, streak]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
