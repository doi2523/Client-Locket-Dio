const { getLocketMoments } = require("./getMoment");
const { postImageToLocket, postImageToLocketV2 } = require("./postImageMoment");
const { postVideoToLocket, postVideoToLocketV2 } = require("./postVideoMoment");

module.exports = {
  postImageToLocket,
  postImageToLocketV2,

  postVideoToLocket,
  postVideoToLocketV2,

  getLocketMoments,
};
