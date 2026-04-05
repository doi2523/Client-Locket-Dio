export async function shareData(data) {
  if (!navigator.share) {
    throw new Error("Web Share API not supported");
  }

  try {
    await navigator.share(data);
    return true;
  } catch (err) {
    console.error("Share failed:", err);
    return false;
  }
}

export async function shareBlob(blob, fileName = "file", onReady) {
  const mimeType = blob.type;

  if (!fileName.includes(".")) {
    const ext = mimeType.split("/")[1] || "dat";
    fileName = `${fileName}.${ext}`;
  }

  const file = new File([blob], fileName, { type: mimeType });

  // 🔥 File ready
  if (onReady) onReady();

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: mimeType.startsWith("video") ? "Share video" : "Share image",
    });
  } else {
    // fallback download
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(blobUrl);
  }
}
