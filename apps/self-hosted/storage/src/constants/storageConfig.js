require("dotenv").config();

const constants = {
  BUCKET_NAME: process.env.R2_BUCKET,
  STORAGE_URL: process.env.STORAGE_API_URL,
  MEDIA_URL: process.env.MEDIA_API_URL, //Public cdn media image/video uploaded
};

module.exports = constants;
