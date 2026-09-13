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

const instanceFirestoreUpload = axios.create({
  timeout: 30000,
  headers: {
    "content-type": "application/octet-stream",
    "x-goog-upload-protocol": "resumable",
    "x-goog-upload-offset": "0",
    "x-goog-upload-command": "upload, finalize",
    "upload-incomplete": "?0",
    "upload-draft-interop-version": "3",
    "user-agent":
      "com.locket.Locket/1.43.1 iPhone/17.3 hw/iPhone15_3 (GTMSUF/1)",
  },
});

module.exports = { instanceFirestore, instanceFirestoreUpload };
