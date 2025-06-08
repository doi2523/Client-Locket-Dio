import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";

export const uploadFileAndGetInfo = async (file, previewType = "other", folder = "LocketCloud") => {
  if (!file) throw new Error("No file provided");

  const safeType = previewType.toLowerCase(); // image / video / other
  const filePath = `${folder}/${safeType}/${Date.now()}_${file.name}`;
  const fileRef = ref(storage, filePath);

  // Upload file
  const uploadResult = await uploadBytes(fileRef, file);

  // Get URL
  const downloadURL = await getDownloadURL(fileRef);

  // Trả về downloadURL và metadata
  return {
    downloadURL,
    metadata: uploadResult.metadata,  // Có name, bucket, generation, size, ...
  };
};
