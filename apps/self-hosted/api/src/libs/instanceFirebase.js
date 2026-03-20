const axios = require("axios");
const constants = require("../utils/constants");
const { firebase } = require("../config/app.config");

const instanceFirebaseV2 = axios.create({
  baseURL: firebase.apiBase.auth,
  timeout: 30000,
  params: {
    key: firebase.apiKey, // 👈 TỰ ĐỘNG gắn ?key=...
  },
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": constants.USER_AGENT,
    "X-Ios-Bundle-Identifier": constants.IOS_BUNDLE_ID,
  },
});

module.exports = { instanceFirebaseV2 };
