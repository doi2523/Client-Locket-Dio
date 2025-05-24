import React, { createContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import * as utils from "../utils";
import { showToast } from "../components/Toast";
import { fetchAndStoreFriends, fetchUser } from "../services";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(utils.getUser()); // Giữ nguyên user từ localStorage
  const [loading, setLoading] = useState(true);
    // State lưu danh sách bạn bè từ sessionStorage hoặc rỗng
    const [friends, setFriends] = useState(() => {
      const saved = sessionStorage.getItem("friendsList");
      return saved ? JSON.parse(saved) : [];
    });

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const idToken = utils.getAuthCookies().idToken;
        const localId = utils.getAuthCookies().localId;
        if (!idToken || !localId) {
          utils.clearAuthCookies();
          utils.removeUser();
          setUser(null);
          return;
        }
      } catch (error) {
        if (isMounted) {
          utils.clearAuthCookies();
          utils.removeUser();
          setUser(null);
          showToast(
            "error",
            "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!"
          );
          window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // useEffect(() => {
  //   let isMounted = true;
  
  //   const chunkArray = (array, size) => {
  //     const result = [];
  //     for (let i = 0; i < array.length; i += size) {
  //       result.push(array.slice(i, i + size));
  //     }
  //     return result;
  //   };
  
  //   const loadFriends = async () => {
  //     const idToken = utils.getAuthCookies().idToken;
  //     const localId = utils.getAuthCookies().localId;
  
  //     if (!idToken || !localId) return;
  
  //     // Kiểm tra xem sessionStorage đã có friendsList chưa
  //     const stored = sessionStorage.getItem("friendsList");
  
  //     if (!stored) {
  //       try {
  //         const fetchedFriends = await fetchAndStoreFriends(idToken, localId);
  //         if (isMounted) setFriends(fetchedFriends);
  //       } catch (error) {
  //         console.error("❌ Lỗi khi tải danh sách bạn bè:", error);
  //       }
  //     } else {
  //       const friendsList = JSON.parse(stored);
  //       setFriends(friendsList); // Cập nhật state nếu cần
  
  //       // Chia thành các nhóm 40 người
  //       const chunks = chunkArray(friendsList, 40);
  
  //       for (const chunk of chunks) {
  //         try {
  //           const results = await Promise.all(
  //             chunk.map(friend =>
  //               fetchUser(friend.uid, idToken)
  //                 .then(res => res.data)
  //                 .catch(err => {
  //                   console.error(`❌ Lỗi khi fetchUser(${friend.uid}):`, err?.response?.data || err);
  //                   return null;
  //                 })
  //             )
  //           );
  
  //           results.forEach(data => {
  //             if (data) {
  //               console.log("👤 Friend info:", data);
  //             }
  //           });
  //         } catch (err) {
  //           console.error("❌ Lỗi khi xử lý nhóm bạn bè:", err);
  //         }
  //       }
  //     }
  //   };
  
  //   loadFriends();
  
  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);
  
  return useMemo(
    () => (
      <AuthContext.Provider value={{ user, setUser, loading }}>
        {children}
      </AuthContext.Provider>
    ),
    [user, loading]
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
