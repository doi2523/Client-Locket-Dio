function getYYYYMMDD(date = new Date()) {
  // Lấy thời gian theo múi giờ Việt Nam
  const nowVN = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );

  const yyyy = nowVN.getFullYear();
  const mm = String(nowVN.getMonth() + 1).padStart(2, "0");
  const dd = String(nowVN.getDate()).padStart(2, "0");

  return Number(`${yyyy}${mm}${dd}`);
}

module.exports = { getYYYYMMDD };
