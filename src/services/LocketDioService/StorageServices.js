import { MEDIA_API_URL, STORAGE_API_URL } from "@/config/apiConfig";
import { CLIENT_VERSION } from "@/constants/versionInfo";
import api from "@/lib/axios";

export const uploadFileAndGetInfoR2 = async (
  file,
  previewType = "other",
  localId
) => {
  if (!file) throw new Error("No file provided");

  const safeType = previewType.toLowerCase(); // image / video / other
  const timestamp = Date.now();
  const extension = file.name.split(".").pop(); // jpg, mp4...

  const fileName = `locketdio_${timestamp}_${localId}_cli${CLIENT_VERSION}_.${extension}`;

  // === Định dạng thư mục: D-13-07-25 ===
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const folderName = `D-${day}-${month}-${year}`;

  const filePath = `LocketCloud/${safeType}/${folderName}/${fileName}`; // => path trên R2

  // === Bước 1: Gọi BE để lấy Presigned URL
  const res = await api.post(`${STORAGE_API_URL}/api/presignedV2`, {
    filename: filePath,
    contentType: file.type,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  });

  const { url, expiresIn } = res.data.data;

  // === Bước 2: Upload file qua presigned URL
  const uploadRes = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("❌ Upload to R2 failed");
  }

  // === Bước 3: Trả về thông tin file
  const publicURL = `${MEDIA_API_URL}/${filePath}`;

  return {
    downloadURL: publicURL,
    metadata: {
      name: fileName,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      path: filePath,
    },
  };
};
