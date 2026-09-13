const axios = require("axios");
const constants = require("../utils/constants");
const { firebase } = require("../config/app.config")

const instanceAppcheck = axios.create({
  baseURL: firebase.apiBase.appCheck,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
    "User-Agent": "Locket/1 CFNetwork/1498.700.2 Darwin/23.6.0",
    "X-Ios-Bundle-Identifier": constants.IOS_BUNDLE_ID,
    "X-Goog-Api-Key": firebase.apiKey,
    baggage: "sentry-environment=production,sentry-public_key=78fa64317f434fd89d9cc728dd168f50,sentry-release=com.locket.Locket%402.8.0%2B1,sentry-trace_id=c9a18480918f4b9788f13d2d85316174",
    "sentry-trace": "c9a18480918f4b9788f13d2d85316174-b4563238aee64fbc-0",
  },
});

module.exports = { instanceAppcheck };
