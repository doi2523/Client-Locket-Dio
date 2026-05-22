const { login, logout, refreshIdToken } = require("./AuthService");
const { sendVerifiCode, loginWithPhoneService, normalizePhone } = require("./AuthWithPhone");
const { getUserInfoV2 } = require("./GetInfoUser");

module.exports = {
  login,
  logout,
  refreshIdToken,
  getUserInfoV2,
  sendVerifiCode,
  loginWithPhoneService,
  normalizePhone,
};
