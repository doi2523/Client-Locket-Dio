import * as utils from "..";

export const uploadToCloudinary = async (rawFile, fileType) => {
  try {
    const formData = new FormData();
    formData.append("file", rawFile);

    const uploadPreset =
      fileType === "image" ? "locket_image_preset" : "locket_video_preset";
    formData.append("upload_preset", uploadPreset);

    const cloudinaryUrl =
      fileType === "image"
        ? utils.API_URL.UPLOAD_IMAGE_TO_CLOUD
        : utils.API_URL.UPLOAD_VIDEO_TO_CLOUD;

    const res = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error?.message || "Tải lên thất bại!");
    }

    // Dữ liệu trả về tùy theo loại file
    const fileData =
      fileType === "image"
        ? {
            type: "image",
            url: data.secure_url,
            public_id: data.public_id,
            size: data.bytes,
            format: data.format,
            width: data.width,
            height: data.height,
          }
        : {
            type: "video",
            url: data.secure_url,
            public_id: data.public_id,
            size: data.bytes,
            format: data.format,
            duration: data.duration,
            thumbnail: `https://res.cloudinary.com/diocloud/video/upload/w_500,h_500,c_fill,q_auto,f_auto/v${data.version}/${data.public_id}.jpeg`,
          };

    return fileData;
  } catch (error) {
    console.error("Lỗi khi upload:", error);
    throw error;
  }
};
export const prepareMediaInfo = (fileData) => {
  if (!fileData || !fileData.type || !fileData.url) {
    throw new Error("Dữ liệu file không hợp lệ");
  }

  const baseInfo = {
    type: fileData.type,
    url: fileData.url,
    public_id: fileData.public_id,
    size: fileData.size,
  };

  if (fileData.type === "image") {
    return {
      ...baseInfo,
      format: fileData.format,
      width: fileData.width,
      height: fileData.height,
    };
  }

  if (fileData.type === "video") {
    return {
      ...baseInfo,
      duration: fileData.duration,
      thumbnail: fileData.thumbnail,
    };
  }

  throw new Error("Không hỗ trợ loại file này");
};
