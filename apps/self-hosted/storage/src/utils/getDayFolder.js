function getTodayFolder() {
  // Lấy thời gian hiện tại theo múi giờ Việt Nam
  const nowVN = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );

  const dd = String(nowVN.getDate()).padStart(2, "0");
  const mm = String(nowVN.getMonth() + 1).padStart(2, "0");
  const yy = String(nowVN.getFullYear()).slice(-2);

  return `D-${dd}-${mm}-${yy}`;
}

function getYesterdayFolder() {
  // Lấy thời gian hiện tại theo múi giờ Việt Nam
  const nowVN = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );

  // Trừ đi 1 ngày
  nowVN.setDate(nowVN.getDate() - 1);

  const dd = String(nowVN.getDate()).padStart(2, "0");
  const mm = String(nowVN.getMonth() + 1).padStart(2, "0");
  const yy = String(nowVN.getFullYear()).slice(-2);

  return `D-${dd}-${mm}-${yy}`;
}

module.exports = {
  getTodayFolder,
  getYesterdayFolder,
};
