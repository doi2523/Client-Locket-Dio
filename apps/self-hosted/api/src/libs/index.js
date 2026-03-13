const { instanceAppcheck } = require("./instanceAppcheck");
const { instanceFirebaseV2 } = require("./instanceFirebase");
const { instanceFirestore } = require("./instanceFirestore");
const { createGoogleInstance } = require("./instanceGoogleBase");
const { instanceLocketV2 } = require("./instanceLocket");

module.exports = {
  instanceFirebaseV2,
  instanceFirestore,
  instanceLocketV2,
  instanceAppcheck,
  createGoogleInstance
};
