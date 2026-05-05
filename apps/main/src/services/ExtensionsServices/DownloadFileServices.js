import { shareBlob } from "../BrowserServices";

export async function fetchFileBlob(fileUrl) {
  const res = await fetch("https://download-media-htx3.onrender.com/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: fileUrl }),
  });

  if (!res.ok) {
    throw new Error("Download failed");
  }

  return await res.blob();
}

export async function downloadAndShareFile(fileUrl, fileName = "file", onReady) {
  try {
    const blob = await fetchFileBlob(fileUrl);
    await shareBlob(blob, fileName, onReady);
  } catch (err) {
    console.error("Download/share failed:", err);
    throw err;
  }
}