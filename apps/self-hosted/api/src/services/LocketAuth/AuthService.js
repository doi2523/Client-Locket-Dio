const { logInfo, logError } = require("../../utils/logEventUtils.js");
const { createGoogleInstance } = require("../../libs/instanceGoogleBase.js");

const login = async (email, password) => {
  logInfo("login Locket", "Start");

  const body = {
    email: email,
    password: password,
    returnSecureToken: true,
    clientType: "CLIENT_TYPE_IOS",
  };

  try {
    const firebaseAuthApi = createGoogleInstance("auth");

    const response = await firebaseAuthApi.post("verifyPassword", body);

    if (!response.data) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.data;

    logInfo("login Locket", "End");
    return data;
  } catch (error) {
    logError("login Locket", error.message);
    throw error;
  }
};

const logout = async () => {
  logInfo("logout Locket", "Start");

  try {
    logInfo("logout Locket", "End");
    return null;
  } catch (error) {
    logError("logout Locket", error.message);
    throw error;
  }
};

const refreshIdToken = async (refreshToken) => {
  const body = {
    grantType: "refresh_token",
    refreshToken: refreshToken,
  };

  try {
    const firebaseAuthApi = createGoogleInstance("secureToken");

    const res = await firebaseAuthApi.post("v1/token", body);

    // Firebase trả về object gồm: id_token, refresh_token, expires_in, user_id,...
    return res.data;
  } catch (err) {
    console.error("Refresh token failed:", err.response?.data || err.message);
    throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
  }
};

module.exports = {
  login,
  logout,
  refreshIdToken
};
