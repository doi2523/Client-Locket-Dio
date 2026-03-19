const authServices = require("./LocketAuth");
const postServices = require("./LocketMoment");
const friendServices = require("./LocketFriend");
const processServices = require("./DataProcessing");
const chatServices = require("./LocketMessage");

module.exports = {
  authServices,
  postServices,
  friendServices,
  processServices,
  chatServices,
};
