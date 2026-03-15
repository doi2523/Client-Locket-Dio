const { login, logout, refreshIdToken } = require("./AuthService");
const { getUserInfoV2 } = require("./GetInfoUser");

module.exports = {
  login,
  logout,
  refreshIdToken,
  getUserInfoV2,
};
