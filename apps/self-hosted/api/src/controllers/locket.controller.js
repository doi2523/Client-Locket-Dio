const {
  postServices,
  authServices,
  friendServices,
  processServices,
  chatServices,
} = require("../services");
const { formatFileSize } = require("../utils/formatFileSize");
const {
  logWarning,
  logTable,
  logLoading,
  logInfo,
} = require("../utils/logEventUtils");

const MAX_SIZE_MB_UPLOAD = 20; //MB

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

  async getMoments(req, res, next) {
    try {
      const { idToken, localId } = req.user;

      const data = await postServices.getLocketMoments(idToken, localId);
      return res.status(200).json({
        data: data.moments,
        nextPageToken: data.nextPageToken,
        success: true,
        message: "ok",
      });
    } catch (error) {
      next(error);
    }
  }

  async getInfoMoments(req, res, next) {
    try {
      const { idToken, uid } = req.user;
      const { idMoment } = req.body;
      // 1. Gọi service lấy moments
      const data = await postServices.getInfoLocketMoments(idToken, idMoment);

      return res.status(200).json({
        data: data.moments,
        nextPageToken: data.nextPageToken,
        success: true,
        message: "ok",
      });
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req, res, next) {
    try {
      const { idToken, localId } = req.user;

      const data = await chatServices.getAllMessages(idToken, localId);
      return res.status(200).json({
        data: data?.messages,
        nextPageToken: data?.nextPageToken,
        success: true,
        message: "ok",
      });
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

  //Function upload với thông tin media là url
  async uploadMediaV2(req, res, next) {
    let mediaPath;

    try {
      const { options, optionsData: optionsDataRaw, mediaInfo } = req.body;

      const optionsData = options ?? optionsDataRaw;
      const { idToken, localId } = req.user;

      const { type, url, name, size, path } = mediaInfo;

      if (!path) {
        return res.status(400).json({ error: "Missing file path" });
      }

      const sizeInMB = size / (1024 * 1024);
      if (sizeInMB > MAX_SIZE_MB_UPLOAD) {
        logWarning("uploadMediaV2", "🚫 Upload bị từ chối do vượt giới hạn");
        return res.status(400).json({
          success: false,
          message: "File quá lớn",
        });
      }

      logTable("uploadMediaV2", {
        localId,
        type,
        name,
        size: formatFileSize(size),
      });

      logLoading("uploadMediaV2", "Downloading media from S2");

      const media = await processServices.downloadMediaOnStorage(
        url,
        type,
        name,
      );

      if (!media) {
        logWarning("uploadMediaV2", "Failed to download media buffer");
        return res.status(404).json({
          message: "Không thể tải media từ URL!",
        });
      }

      const mediaBuffer = media.buffer;
      mediaPath = media.path;

      let processedBuffer;
      let thumbBuffer;
      let result;

      if (type === "image") {
        processedBuffer = await processServices.processImageBuffer({
          imageBuffer: mediaBuffer,
          maxSizeMB: 1,
          resolution: 1440,
        });

        result = await postServices.postImageToLocketV2({
          userId: localId,
          idToken,
          imageBuffer: processedBuffer,
          optionsData,
        });
      } else if (type === "video") {
        processedBuffer = await processServices.processVideoBuffer({
          videoBuffer: mediaBuffer,
          filename: name,
          maxSizeMB: 5,
        });

        thumbBuffer = await processServices.generateThumbnail(
          processedBuffer,
          localId,
        );

        result = await postServices.postVideoToLocketV2({
          userId: localId,
          idToken,
          videoBuffer: processedBuffer,
          thumbBuffer,
          optionsData,
        });
      }

      await processServices.deleteFileFromStorageR2(mediaPath).catch(() => {});

      logInfo("uploadMediaV2", "End - Success");

      return res.status(200).json({
        success: true,
        message: "Upload media successfully",
        data: result?.result?.data,
      });
    } catch (error) {
      next(error);
    } finally {
      // cleanup an toàn
      if (mediaPath) {
        try {
          deleteTempFile(mediaPath);
        } catch {}
      }
    }
  }
}

module.exports = new LocketController();
