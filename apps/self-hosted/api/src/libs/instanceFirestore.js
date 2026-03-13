const axios = require("axios");
const constants = require("../utils/constants");
const { firebase } = require("../config/app.config");

const instanceFirestore = axios.create({
  baseURL: firebase.apiBase.firestore,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": constants.USER_AGENT,
    "X-Ios-Bundle-Identifier": constants.IOS_BUNDLE_ID,
  },
});
instanceFirestore.interceptors.request.use((config) => {
  if (config.meta?.idToken) {
    config.headers.Authorization = `Bearer ${config.meta.idToken}`;
  }
  return config;
});

module.exports = { instanceFirestore };
