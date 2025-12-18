// src/store/messagesStore.js
import { create } from "zustand";
import { GetAllMessage, getMessagesWithUser } from "@/services";
import {
  getAllConversations,
  getMessagesByConversationId,
  saveConversations,
  saveMessages,
  upsertConversations,
} from "@/cache/chatsDB";
import { MESSAGES_CONFIG } from "@/config";

const { initialVisible, loadMoreLimit } = MESSAGES_CONFIG;

export const useMessagesStore = create((set, get) => ({
  // ==== 1️⃣ State chính ====
  conversations: [], // danh sách các conversation (hiển thị sidebar, chỉ info cơ bản)
  messages: {}, // tin nhắn thực tế, lưu theo userId: { [userId]: [msg1, msg2, ...] }
  loading: false,
  hasMore: true,
  visibleCount: initialVisible,
  isLoadingMore: false,

  // ==== 2️⃣ Fetch tất cả conversations từ local → API ====
  fetchConversations: async () => {
    set({ loading: true });
    try {
      const localData = await getAllConversations();
      set({
        conversations: localData?.length
          ? [...localData].sort((a, b) => b.update_time - a.update_time)
          : [],
      });
      const apiData = await GetAllMessage({ limit: initialVisible });
      if (apiData?.length) {
        set({
          conversations: [...apiData].sort(
            (a, b) => b.update_time - a.update_time
          ),
        });
        saveConversations(apiData); // lưu vào local DB
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
    } finally {
      set({ loading: false });
    }
  },

  upsertConversation: (conversation) => {
    const { conversations } = get();
    const map = new Map(conversations.map((c) => [c.uid, c]));

    map.set(conversation.uid, {
      ...map.get(conversation.uid),
      ...conversation,
      update_time: Date.now(),
    });

    const merged = [...map.values()].sort(
      (a, b) => b.update_time - a.update_time
    );

    set({ conversations: merged });

    upsertConversations(conversation);
  },

  // ➕ ADD / UPSERT CONVERSATION
  addConversation: (conversation) => {
    const { conversations } = get();

    const map = new Map(conversations.map((c) => [c.uid, c]));
    map.set(conversation.uid, {
      ...map.get(conversation.uid),
      ...conversation,
    });

    const merged = [...map.values()].sort(
      (a, b) => b.update_time - a.update_time
    );

    set({ conversations: merged });
    saveConversations([conversation]);
  },

  // ==== 3️⃣ Lấy tin nhắn theo userId (conversationId) ====
  getMessagesByUser: async (conversationId) => {
    const { messages } = get();

    // 1. Nếu đã cache → trả ngay
    if (messages[conversationId]?.length) {
      return messages[conversationId];
    }

    // 2. Load local DB
    const local = await getMessagesByConversationId(conversationId);
    set({
      messages: { ...messages, [conversationId]: local },
    });

    // 3. Sync API
    // Note: Phải để null mới get các mess từ mới nhất về cũ
    const apiData = await getMessagesWithUser({
      messageId: conversationId,
    });

    if (apiData?.length) {
      await saveMessages(apiData);

      const merged = [...apiData, ...local].sort(
        (a, b) => b.update_time - a.update_time
      );

      set({
        messages: {
          ...get().messages,
          [conversationId]: merged,
        },
      });

      return merged;
    }

    return local;
  },

  // ==== 4️⃣ Add message mới ====
  addMessageWithUser: async (conversationId, msg) => {
    const { messages } = get();
    const current = messages[conversationId] || [];

    if (current.some((m) => m.id === msg.id)) return;

    const updated = [msg, ...current].sort(
      (a, b) => b.update_time - a.update_time
    );

    set({
      messages: {
        ...messages,
        [conversationId]: updated,
      },
    });

    await saveMessages(msg);
  },
  // ==== 4️⃣ Add message mới ====
  addMessageWithUserV2: async (conversationId, newMessages) => {
    if (!conversationId || !newMessages) return;

    // 1️⃣ Chuẩn hoá payload
    const items = Array.isArray(newMessages) ? newMessages : [newMessages];

    const { messages } = get();
    const current = messages[conversationId] || [];

    // 2️⃣ Lọc message mới (chống duplicate)
    const filtered = items.filter(
      (msg) => msg?.id && !current.some((m) => m.id === msg.id)
    );

    if (filtered.length === 0) return;

    // 3️⃣ Update state (optimistic)
    const updated = [...filtered, ...current].sort(
      (a, b) => b.update_time - a.update_time
    );

    set({
      messages: {
        ...messages,
        [conversationId]: updated,
      },
    });

    // 4️⃣ Lưu cache / DB
    await saveMessages(filtered);
  },

  // ==== 5️⃣ Remove message ====
  removeMessage: (msgId) => {
    const { messages, conversations } = get();
    const updatedMessages = messages.filter((m) => m.id !== msgId);
    const updatedConversations = Object.fromEntries(
      Object.entries(conversations).map(([uid, msgs]) => [
        uid,
        msgs.filter((m) => m.id !== msgId),
      ])
    );
    set({ messages: updatedMessages, conversations: updatedConversations });
    // deleteMessageById(msgId) nếu muốn xoá local DB
  },

  // ==== 6️⃣ Reset / scroll ====
  resetVisible: () => set({ visibleCount: initialVisible }),
  increaseVisibleCount: () => {
    const { visibleCount, messages } = get();
    if (visibleCount < messages.length) {
      set({
        visibleCount: Math.min(visibleCount + initialVisible, messages.length),
      });
    }
  },
}));
