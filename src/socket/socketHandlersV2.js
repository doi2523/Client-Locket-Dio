// socketHandlers.js

/**
 * Merge array từ socket vào state, có upsert vào IndexedDB
 * Dùng cho: list_message, list_moment, list_notification,...
 */
export const createListHandler = ({
  setState,
  upsertDB,
  key = "id", // default merge theo id
}) => {
  return async (data) => {
    if (!Array.isArray(data) || data.length === 0) return;

    setState((prev) => {
      const merged = [...prev];

      data.forEach((item) => {
        const index = merged.findIndex((x) => x[key] === item[key]);

        if (index > -1) {
          merged[index] = { ...merged[index], ...item };
        } else {
          merged.unshift(item);
        }
      });

      return merged;
    });

    if (upsertDB) await upsertDB(data);
  };
};


/**
 * Dùng cho data đơn: newMessage, newMoment, newNotification...
 * Tự động đẩy lên đầu list
 */
export const createUpsertHandler = ({
  setState,
  upsertDB,
  key = "id",
}) => {
  return async (item) => {
    if (!item) return;

    setState((prev) => {
      const exists = prev.find((x) => x[key] === item[key]);
      if (exists) {
        return prev.map((x) =>
          x[key] === item[key] ? { ...x, ...item } : x
        );
      }
      return [item, ...prev];
    });

    if (upsertDB) await upsertDB([item]);
  };
};


/**
 * Append vào cuối list, dành cho message trong 1 cuộc chat,
 * hoặc append vào timeline nếu muốn push cuối.
 */
export const createAppendHandler = ({
  setState,
  key = "id",
  upsertDB,
}) => {
  return async (item) => {
    if (!item) return;

    setState((prev) => {
      // đã tồn tại → update
      const exists = prev.find((x) => x[key] === item[key]);
      if (exists) {
        return prev.map((x) =>
          x[key] === item[key] ? { ...x, ...item } : x
        );
      }

      // chưa có → append
      return [...prev, item];
    });

    if (upsertDB) await upsertDB([item]);
  };
};


/**
 * Dùng cho list messages trong 1 cuộc chat
 */
export const createListMessageWithUserHandler = ({
  setChatMessages,
}) => {
  return (data) => {
    setChatMessages(data || []);
  };
};


/**
 * Thêm message vào cuộc chat đang mở
 */
export const createNewMessageWithUserHandler = ({
  setChatMessages,
  key = "id",
}) => {
  return (msgs) => {
    setChatMessages((prev) => {
      const merged = [...prev];

      msgs.forEach((m) => {
        const index = merged.findIndex((x) => x[key] === m[key]);
        if (index > -1) merged[index] = { ...merged[index], ...m };
        else merged.push(m);
      });

      return merged;
    });
  };
};
