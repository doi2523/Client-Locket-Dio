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