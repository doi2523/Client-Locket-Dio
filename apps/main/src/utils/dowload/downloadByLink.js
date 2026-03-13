export const downloadByLink = (url, filename) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "";
  link.target = "_blank"; // fallback cho Safari
  document.body.appendChild(link);
  link.click();
  link.remove();
};