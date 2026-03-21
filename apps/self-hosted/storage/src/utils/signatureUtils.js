const crypto = require("crypto");

const generateSignature = (value, secret = process.env.SIGN_SECRET) => {
  return crypto
    .createHash("sha256")
    .update(value + secret)
    .digest("hex");
};

module.exports = {
  generateSignature,
};
