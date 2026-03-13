const { firebase } = require("./app.config");

const FIREBASE_API_MAP = {
  auth: firebase.apiBase.auth,
  appCheck: firebase.apiBase.appCheck,
  firestore: firebase.apiBase.firestore,
  // storage: process.env.FIREBASE_STORAGE_API_BASE,
  secureToken: firebase.apiBase.secureToken,
};

module.exports = FIREBASE_API_MAP;