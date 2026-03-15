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

module.exports = {
  login,
  logout,
};
