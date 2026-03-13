const locketService = require("../services/locket/locket-service.js");

class LocketController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await locketService.login(email, password);
            return res.status(200).json({ data: user, success: true, message: "ok" });
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            await locketService.logout();
            return res.status(200).json({ success: true, message: "ok" });
        } catch (error) {
            next(error);
        }
    }

    async getAllFriends(req, res, next) {
        try {
            const { idToken, localId } = req.user;

            const data = await locketService.getAllFriends(idToken, localId);
            return res.status(200).json({ data: data, success: true, message: "ok" });
        } catch (error) {
            next(error);
        }
    }

    async uploadMedia(req, res, next) {
        try {
            const { userId, idToken, caption } = req.body;
            const { images, videos } = req.files;

            if (!images && !videos) {
                return res.status(400).json({
                    message: "No media found",
                });
            }

            if (images && videos) {
                return res.status(400).json({
                    message: "Only one type of media is allowed",
                });
            }

            if (images) {
                await locketService.postImage(
                    userId,
                    idToken,
                    images[0],
                    caption
                );
            } else {
                if (videos[0].size > 10 * 1024 * 1024) {
                    return res.status(400).json({
                        message: "Video size exceeds 10MB",
                    });
                }

                await locketService.postVideo(
                    userId,
                    idToken,
                    videos[0],
                    caption
                );
            }

            return res.status(200).json({
                message: "Upload image successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new LocketController();
