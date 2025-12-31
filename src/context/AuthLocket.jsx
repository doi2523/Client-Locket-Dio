import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useContext,
} from "react";
import PropTypes from "prop-types";
import * as utils from "@/utils";
import { GetUserData, updateUserInfo } from "@/services";
import { useFriendStore } from "@/stores/useFriendStore";
import { showDevWarning } from "@/utils/logging/devConsole";
import { useStreakStore } from "@/stores";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(utils.getUser());
  const [authTokens, setAuthTokens] = useState(() => utils.getToken());
  const [loading, setLoading] = useState(false);

  const hasFetchedPlan = useRef(false);

  const [userPlan, setUserPlan] = useState(null);
  const [uploadStats, setUploadStats] = useState(null);

  const { loadFriends } = useFriendStore();
  const { syncStreak } = useStreakStore();

  useEffect(() => {
    showDevWarning();
  }, []);

  // 🔹 Fetch user plan
  useEffect(() => {
    if (!user || !authTokens?.idToken || !authTokens?.localId) return;

    const init = async () => {
      if (!hasFetchedPlan.current) {
        const userData = await GetUserData();
        setUserPlan(userData);
        setUploadStats(userData?.upload_stats);
        loadFriends();
        syncStreak();
      }
      await updateUserInfo(user);
    };

    init();
  }, [user, authTokens?.idToken, authTokens?.localId]);

  // 🔹 Reset context
  const resetAuthContext = () => {
    setUser(null);
    setAuthTokens(null);
    setUserPlan(null);
    setUploadStats(null);

    hasFetchedPlan.current = false;

    utils.removeUser();
    utils.removeToken();
  };

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      loading,
      userPlan,
      setUserPlan,
      authTokens,
      setAuthTokens,
      resetAuthContext,
      uploadStats,
      setUploadStats,
    }),
    [user, loading, userPlan, authTokens, uploadStats]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return useContext(AuthContext);
}
