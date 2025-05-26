import React, { createContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import * as utils from "../utils";
import { showInfo, showToast } from "../components/Toast";
import { fetchAndStoreFriends, fetchUser } from "../services";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(utils.getUser()); //Thong tin User
  const [authTokens, setAuthTokens] = useState(() => utils.getToken()); //Thong tin Token

  const [loading, setLoading] = useState(false);

  const [friends, setFriends] = useState(() => {
    const saved = localStorage.getItem("friendsList");
    return saved ? JSON.parse(saved) : [];
  });

  // Thêm state friendDetails vào context
  const [friendDetails, setFriendDetails] = useState(() => {
    const saved = localStorage.getItem("friendDetails");
    return saved ? JSON.parse(saved) : [];
  });
  // Load userPlan từ localStorage ngay khi component mount
  const [userPlan, setUserPlan] = useState(() => {
    const saved = localStorage.getItem("userPlan");
    return saved ? JSON.parse(saved) : null;
  });

  // ✅ Auto refresh token mỗi 50 phút hoặc khi token hết hạn
  useEffect(() => {
    let isMounted = true;
    const refreshInterval = 50 * 60 * 1000; // 50 phút

    const autoRefresh = async () => {
      const { idToken, refreshToken } = authTokens || {};

      if (
        !refreshToken ||
        typeof refreshToken !== "string" ||
        refreshToken.trim() === ""
      ) {
        console.warn("⚠️ Không có refreshToken hợp lệ, tiến hành logout.");
        if (isMounted) {
          setUser(null);
          setAuthTokens(null);
          utils.removeUser();
          utils.removeToken();
        }
        return;
      }

      // Nếu idToken rỗng hoặc hết hạn thì mới làm mới
      const idTokenIsValid =
        idToken &&
        typeof idToken === "string" &&
        idToken.trim() !== "" &&
        !utils.isIdTokenExpired(idToken);

      if (!idTokenIsValid) {
        try {
          const newTokens = await utils.refreshIdToken(refreshToken);
          if (isMounted && newTokens) {
            setAuthTokens(newTokens); // ✅ cập nhật token mới vào state
          }
        } catch (err) {
          console.error("❌ Lỗi khi refresh token:", err);
          if (isMounted) {
            setUser(null);
            setAuthTokens(null);
            utils.removeUser();
            utils.removeToken();
            showInfo("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          }
        }
      }
    };

    autoRefresh(); // Chạy ngay khi mount
    const intervalId = setInterval(autoRefresh, refreshInterval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [authTokens]);

  // Load friends
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?.idToken || !user?.localId) return;

      // Kiểm tra xem localStorage đã có friendsList chưa
      const savedFriends = localStorage.getItem("friendsList");
      if (savedFriends) {
        try {
          const parsed = JSON.parse(savedFriends);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFriends(parsed);
            return; // Không gọi API vì đã có data
          }
        } catch {
          // Nếu JSON parse lỗi thì tiếp tục fetch API
        }
      }

      // Nếu chưa có hoặc parse lỗi, gọi API lấy danh sách bạn bè
      try {
        const friendsList = await fetchAndStoreFriends(
          user.idToken,
          user.localId
        );
        setFriends(friendsList);
        localStorage.setItem("friendsList", JSON.stringify(friendsList));
      } catch (error) {
        console.error("❌ Lỗi khi fetch friends:", error);
      }
    };

    fetchFriends();
  }, [user]);

  // Load friendDetails và lưu vào state + localStorage
  useEffect(() => {
    const loadFriendDetails = async () => {
      if (!user?.idToken || friends.length === 0) return;

      // Kiểm tra localStorage có friendDetails chưa
      const savedDetails = localStorage.getItem("friendDetails");
      if (savedDetails) {
        try {
          const parsedDetails = JSON.parse(savedDetails);
          if (Array.isArray(parsedDetails) && parsedDetails.length > 0) {
            setFriendDetails(parsedDetails);
            return; // có rồi thì thôi, không gọi API
          }
        } catch {
          // lỗi parse thì vẫn gọi API tiếp
        }
      }

      const batchSize = 20;
      const allResults = [];

      for (let i = 0; i < friends.length; i += batchSize) {
        const batch = friends.slice(i, i + batchSize);

        try {
          const results = await Promise.all(
            batch.map((friend) =>
              fetchUser(friend.uid, user.idToken)
                .then((res) => utils.normalizeFriendData(res.data))
                .catch((err) => {
                  console.error(
                    `❌ fetchUser(${friend.uid}) failed:`,
                    err?.response?.data || err
                  );
                  return null;
                })
            )
          );

          const filtered = results.filter(Boolean);
          allResults.push(...filtered);
        } catch (err) {
          console.error("❌ Lỗi khi xử lý batch:", err);
        }
      }

      setFriendDetails(allResults);
      try {
        localStorage.setItem("friendDetails", JSON.stringify(allResults));
      } catch (e) {
        console.error("❌ Lỗi khi lưu vào localStorage:", e);
      }
    };

    loadFriendDetails();
  }, [friends, user?.idToken]);

  // Load hoặc đăng ký gói Free khi user và token có
  useEffect(() => {
    if (!user?.localId || !authTokens?.idToken) return;

    let isMounted = true;
    const fetchPlan = async () => {
      setLoading(true);
      try {
        let plan = await utils.fetchUserPlan(user.localId, authTokens.idToken);
        if (!plan) {
          const res = await utils.registerFreePlan(user, authTokens.idToken);
          if (res?.data) {
            plan = res.data;
            // showInfo("Bạn đã được đăng ký gói Free tự động.");
          }
        }

        if (isMounted) setUserPlan(plan);
      } catch (err) {
        console.error("Lỗi khi lấy hoặc đăng ký gói user:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPlan();

    return () => {
      isMounted = false;
    };
  }, [user?.localId, authTokens?.idToken]);

  return useMemo(
    () => (
      <AuthContext.Provider
        value={{
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
        }}
      >
        {children}
      </AuthContext.Provider>
    ),
    [user, loading, friends, friendDetails, userPlan, authTokens]
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
