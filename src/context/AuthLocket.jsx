import React, { createContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import * as utils from "../utils";
import { showToast } from "../components/Toast";
import { fetchAndStoreFriends, fetchUser } from "../services";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(utils.getUser());
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

  // Kiểm tra đăng nhập
  // useEffect(() => {
  //   let isMounted = true;

  //   const checkAuth = async () => {
  //     try {
  //       const { idToken, localId } = utils.getAuthCookies();
  //       if (!idToken || !localId) {
  //         utils.clearAuthCookies();
  //         utils.removeUser();
  //         utils.clearAllLocalData();
  //         setUser(null);
  //         return;
  //       }
  //     } catch (error) {
  //       if (isMounted) {
  //         utils.clearAuthCookies();
  //         utils.removeUser();
  //         utils.clearAllLocalData();
  //         setUser(null);
  //         showToast("error", "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
  //         window.location.href = "/login";
  //       }
  //     } finally {
  //       if (isMounted) setLoading(false);
  //     }
  //   };

  //   checkAuth();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

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
        const friendsList = await fetchAndStoreFriends(user.idToken, user.localId);
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
            batch.map(friend =>
              fetchUser(friend.uid, user.idToken)
                .then(res => utils.normalizeFriendData(res.data))
                .catch(err => {
                  console.error(`❌ fetchUser(${friend.uid}) failed:`, err?.response?.data || err);
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

  return useMemo(
    () => (
      <AuthContext.Provider value={{ user, setUser, loading, friends, setFriends, friendDetails, setFriendDetails }}>
        {children}
      </AuthContext.Provider>
    ),
    [user, loading, friends, friendDetails]
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
