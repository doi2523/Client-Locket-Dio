import { createContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import * as utils from "../utils";
import { showToast } from "../components/Toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(utils.getUser()); // Giữ nguyên user từ localStorage
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const idToken = user.idToken || utils.getAuthCookies().idToken;
        const localId = user.localId || utils.getAuthCookies().localId;
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
