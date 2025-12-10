// configAlias.js
import { CONFIG } from "@/config/webConfig";

// Config cho Moments
export const MOMENTS_CONFIG = {
  maxDisplayLimit: CONFIG.app.moments.maxDisplayLimit,
  duplicateThreshold: CONFIG.app.moments.duplicateThreshold,
  initialVisible: CONFIG.app.moments.initialVisible,
  loadMoreLimit: CONFIG.app.moments.loadMoreLimit,
};

// Config cho Camera
export const CAMERA_CONFIG = {
  maxRecordTime: CONFIG.app.camera.limits.maxRecordTime,
  imageSizePx: CONFIG.app.camera.resolutions.imageSizePx,
  videoResolutionPx: CONFIG.app.camera.resolutions.videoResolutionPx,
  maxImageSizeMB: CONFIG.app.camera.limits.maxImageSizeMB,
  maxVideoSizeMB: CONFIG.app.camera.limits.maxVideoSizeMB,
};

export const COMMUNITY_CONFIG = {
  discord: CONFIG.app.community.discord,
  messenger: CONFIG.app.community.messenger,
  telegram: CONFIG.app.community.telegram,
};

export const CONTACT_CONFIG = {
  supportEmail: CONFIG.app.contact.supportEmail,
};

export const SPONSORS_CONFIG = {
  accountName: CONFIG.app.sponsors.accountName,
  accountNumber: CONFIG.app.sponsors.accountNumber,
  urlImg: CONFIG.app.sponsors.urlImg,
  bankName: CONFIG.app.sponsors.bankName,
};

export const EMBEDVIDEO_CONFIG = {
  embedIos: CONFIG.app.videoTutorials.iosAddscreen,
  embedAndroid: CONFIG.app.videoTutorials.androidAddscreen,
};