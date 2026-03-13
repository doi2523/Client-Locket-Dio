// hooks/useChatSocket.js
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { upsertConversations } from "@/cache/chatsDB";
import { SocketEvent } from "@/constants/socketEvents";

export const useChatSocket = (idToken, selectedChat, setMessages, setChatMessages) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const listenersRef = useRef({});

  useEffect(() => {
    if (!idToken) return;

    const socketClient = io("http://localhost:8000/chat", {
      transports: ["websocket"],
      auth: { token: idToken },
      autoConnect: false,
    });

    socketClient.connect();
    setSocket(socketClient);

    // ====== Core events ======
    socketClient.on(SocketEvent.CONNECT, () => setIsConnected(true));
    socketClient.on(SocketEvent.DISCONNECT, () => setIsConnected(false));
    socketClient.on(SocketEvent.CONNECT_ERROR, () => setIsConnected(false));

    // ====== Conversation list ======
    socketClient.emit("get_list_messages", { timestamp: null, token: idToken });

    socketClient.on("list_message", async (data) => {
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
    });

    // ====== New message realtime ======
    socketClient.on("new_message", (msg) => {
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

      if (selectedChat?.uid === msg.with_user) {
        setChatMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketClient.disconnect();
      setSocket(null);
    };
  }, [idToken, selectedChat, setMessages, setChatMessages]);

  // helper: gửi request lấy messages với user
  const fetchMessagesWithUser = (chatId) => {
    if (!socket) return;
    socket.emit("get_messages_with_user", {
      with_user: chatId,
      timestamp: null,
      token: idToken,
    });
  };

  return { socket, isConnected, fetchMessagesWithUser };
};
