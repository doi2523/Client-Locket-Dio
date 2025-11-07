// socketHandlers.js (tách riêng cho gọn, có thể để trong thư mục /utils hoặc /socket)
export const handleListMessage =
  (setMessages, upsertConversations) => async (data) => {
    if (!Array.isArray(data) || !data.length) return;

    setMessages((prev) => {
      const merged = [...prev];
      data.forEach((newConv) => {
        const index = merged.findIndex((c) => c.uid === newConv.uid);
        if (index > -1) merged[index] = { ...merged[index], ...newConv };
        else merged.unshift(newConv);
      });
      return merged;
    });

    await upsertConversations(data);
  };

export const handleNewMessage =
  (setMessages, setChatMessages, selectedChat) => (msg) => {
    console.log("📩 [Global] Received new message:", msg);

    // cập nhật conversation list
    setMessages((prev) => {
      const index = prev.findIndex((c) => c.uid === msg.with_user);
      if (index > -1) {
        prev[index] = {
          ...prev[index],
          latestMessage: msg,
          messages: [...(prev[index].messages || []), msg],
        };
      } else {
        prev.unshift({
          uid: msg.with_user,
          latestMessage: msg,
          messages: [msg],
        });
      }
      return [...prev];
    });

    // nếu đang mở chat đó thì push luôn
    if (selectedChat?.uid === msg.with_user) {
      setChatMessages((prev) => [...prev, msg]);
    }
  };

export const handleListMessageWithUser = (setChatMessages) => (data) => {
  console.log("📥 [User] List messages with user:", data);
  setChatMessages(data || []);
};

export const handleNewMessageWithUser = (setChatMessages) => (msg) => {
  setChatMessages((prev) => {
    const merged = [...prev];
    msg.forEach((newConv) => {
      const index = merged.findIndex((c) => c.id === newConv.id);
      if (index > -1) merged[index] = { ...merged[index], ...newConv };
      else merged.unshift(newConv);
    });
    return merged;
  });
};

