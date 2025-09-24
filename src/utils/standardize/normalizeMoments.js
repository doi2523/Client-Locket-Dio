/**
 * Chuẩn hoá một moment từ Firestore thành định dạng dễ dùng hơn
 * @param {Object} data Object moment thô từ Firestore
 * @returns {Object|null} Moment đã chuẩn hoá hoặc null nếu input không hợp lệ
 */
export function normalizeMoment(data) {
  if (!data || typeof data !== "object") return null;

  const {
    canonical_uid,
    id,
    user,
    image_url,
    video_url = null,
    thumbnail_url,
    overlays = [],
    caption,
    md5,
    sent_to_all,
    show_personally,
    date,
  } = data;

  const momentId = canonical_uid || id || null;

  const firestoreDate = date?._seconds ? new Date(date._seconds * 1000) : null;
  const dateVNString = firestoreDate
    ? firestoreDate.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
    : null;

  // Lấy captions từ overlays
  const captions = Array.isArray(overlays)
    ? overlays
        .filter((o) => o.overlay_type === "caption")
        .map((o) => {
          const { text, text_color, icon, background } = o.data || {};
          return { text, text_color, icon, background };
        })
    : [];

  // Nếu không có overlay nhưng có caption dạng chuỗi
  if (!captions.length && typeof caption === "string" && caption.trim() !== "") {
    captions.push({
      text: caption,
      text_color: "#FFFFFF",
      icon: null,
      background: { material_blur: "ultra_thin", colors: [] },
    });
  }

  return {
    id: momentId,
    user,
    image_url,
    video_url,
    thumbnail_url,
    date: dateVNString,
    md5: md5 || null,
    sent_to_all: !!sent_to_all,
    show_personally: !!show_personally,
    captions,
  };
}


//   [
//     {
//       id: "kO3tDcHrm6owDLPA4Rv7",
//       user: "...",
//       image_url: "...",
//       video_url: "...",
//       thumbnail_url: "...",
//       date: "2025-05-24T02:46:40.000Z",
//       md5: "...",
//       sent_to_all: true,
//       show_personally: false,
//       captions: [
//         {
//           text: "Goodnight",
//           text_color: "#FFFFFFE6",
//           icon: { type: "emoji", data: "🌙" },
//           background: { material_blur: "ultra_thin", colors: ["#370C6F", "#575CD4"] }
//         }
//       ]
//     },
//     ...
//   ]
