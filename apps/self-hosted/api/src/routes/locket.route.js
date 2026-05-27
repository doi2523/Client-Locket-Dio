const Router = require("express");
const router = Router();
const handleUpload = require("../middlewares/multipart-upload-support.middleware.js");
const MAX_IMAGE_COUNT = 1;
const MAX_VIDEO_COUNT = 1;

const locketController = require("../controllers/locket.controller.js");
const { verifyIdToken } = require("../middlewares/verifyToken.js");
const saveUploadFile = require("../middlewares/save-upload-files.js");

router.post("/login", locketController.login);
router.get("/logout", locketController.logout);
router.post("/refresh-token", locketController.refreshToken);

router.post("/getAllFriendsV2", verifyIdToken, locketController.getAllFriends);

router.post("/getInfoUser", verifyIdToken, locketController.getInfoLocket);

//API bản V1 yêu cầu tải trực tiếp file trong request
router.post("/postMomentV1", verifyIdToken, saveUploadFile, locketController.uploadMediaV1);

//API bản V2 chính là công nghệ hiện tại Locket Dio đang sử dụng
router.post("/postMomentV2", verifyIdToken, locketController.uploadMediaV2);

router.post("/getInfoMomentV2", verifyIdToken, locketController.getInfoMoments);
router.post("/getMomentV2", verifyIdToken, locketController.getMoments);
router.post("/getAllMessageV2", verifyIdToken, locketController.getMessages);

module.exports = router;
