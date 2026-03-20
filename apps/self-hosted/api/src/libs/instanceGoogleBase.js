const axios = require("axios");
const constants = require("../utils/constants");
const { firebase } = require("../config/app.config");
const FIREBASE_API_MAP = require("../config/firebaseApiMap");

const createGoogleInstance = (service) => {
  const baseURL = FIREBASE_API_MAP[service];

  if (!baseURL) {
    throw new Error(`❌ Unknown Firebase service: ${service}`);
  }

  return axios.create({
    baseURL,
    timeout: 30000,
    params: {
      key: firebase.apiKey,
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": constants.USER_AGENT,
      "X-Ios-Bundle-Identifier": constants.IOS_BUNDLE_ID,
    },
  });
};

module.exports = {
  createGoogleInstance,
};
