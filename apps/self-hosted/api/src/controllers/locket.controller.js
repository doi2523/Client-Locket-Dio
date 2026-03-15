const { postServices, authServices, friendServices } = require("../services");

class LocketController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await authServices.login(email, password);
      return res.status(200).json({ data: user, success: true, message: "ok" });
    } catch (error) {
      next(error);
    }
  }

  async getInfoLocket(req, res, next) {
    try {
      const { idToken, localId } = req.user;
      const user = await authServices.getUserInfoV2(idToken, localId);
      return res.status(200).json({ data: user, success: true, message: "ok" });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const user = await authServices.refreshIdToken(refreshToken);
      return res.status(200).json({ data: user, success: true, message: "ok" });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      await authServices.logout();
      return res.status(200).json({ success: true, message: "ok" });
    } catch (error) {
      next(error);
    }
  }

  async getAllFriends(req, res, next) {
    try {
      const { idToken, localId } = req.user;

      const data = await friendServices.getAllFriends(idToken, localId);
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
        await postServices.postImageToLocket(
          userId,
          idToken,
          images[0],
          caption,
        );
      } else {
        if (videos[0].size > 10 * 1024 * 1024) {
          return res.status(400).json({
            message: "Video size exceeds 10MB",
          });
        }

        await postServices.postVideoToLocket(
          userId,
          idToken,
          videos[0],
          caption,
        );
      }

      return res.status(200).json({
        message: "Upload image successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  //Fuction post trực tiếp file lên
  async uploadMediaV1(req, res, next) {
    try {
      const { optionsData } = req.body;
      const { idToken, localId: userId } = req.user;

      const files = req.uploadedFiles;

      if (!files || files.length === 0) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      // phân loại media
      const images = files.filter((f) => f.mimetype.startsWith("image"));
      const videos = files.filter((f) => f.mimetype.startsWith("video"));

      // không cho upload cả 2 loại
      if (images.length && videos.length) {
        return res.status(400).json({
          message: "Only one type of media is allowed",
        });
      }
      let result;
      if (images.length) {
        result = await postServices.postImageToLocket({
          userId: userId,
          idToken: idToken,
          image: images[0].buffer || { path: images[0].path },
          optionsData: optionsData,
        });
      }

      if (videos.length) {
        if (videos[0].buffer.length > 10 * 1024 * 1024) {
          return res.status(400).json({
            message: "Video size exceeds 10MB",
          });
        }

        result = await postServices.postVideoToLocket({
          userId: userId,
          idToken: idToken,
          video: videos[0].buffer || { path: videos[0].path },
          optionsData: optionsData,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Upload media successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LocketController();
