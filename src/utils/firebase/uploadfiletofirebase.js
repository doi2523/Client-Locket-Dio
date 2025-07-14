import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import { CLIENT_VERSION } from "../../constants/versionInfo";

export const uploadFileAndGetInfo = async (
  file,
  previewType = "other",
  localId
) => {
  if (!file) throw new Error("No file provided");

  const safeType = previewType.toLowerCase(); // image / video / other
  const timestamp = Date.now();
  const extension = file.name.split(".").pop(); // lấy đuôi file, ví dụ jpg, mp4

  const fileName = `locketdio_${timestamp}_${localId}_cli${CLIENT_VERSION}_.${extension}`;
  const filePath = `LocketCloud/${safeType}/${fileName}`;
  const fileRef = ref(storage, filePath);

  // Upload file
  const uploadResult = await uploadBytes(fileRef, file);

  // Get URL
  const downloadURL = await getDownloadURL(fileRef);

  // Trả về downloadURL và metadata
  return {
    downloadURL,
    metadata: uploadResult.metadata,
  };
};
