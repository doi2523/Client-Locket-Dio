import { useEffect, useRef, useCallback, useState } from "react";
import { useMessagesStore } from "@/stores";

const RELAY_URL = import.meta.env.VITE_RELAY_GROUP_URL;
const PING_INTERVAL = 15000;

export const useGroupRelay = (idToken, myUid, isActive) => {
  const [status, setStatus] = useState("closed");
  const wsRef = useRef(null);
  const pingTimerRef = useRef(null);
  const reconnTimerRef = useRef(null);
  const reconnDelayRef = useRef(2000);
  const closingRef = useRef(false);
  const connectRef = useRef(null);

  const addMessageWithUserV2 = useMessagesStore((s) => s.addMessageWithUserV2);
  const fetchConversations = useMessagesStore((s) => s.fetchConversations);

  const disconnect = useCallback(() => {
    closingRef.current = true;
    if (pingTimerRef.current) {
      clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }
    if (reconnTimerRef.current) {
      clearTimeout(reconnTimerRef.current);
      reconnTimerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus("closed");
  }, []);

  const handleMessage = useCallback(
    (data) => {
      if (data.type === "groupUpdates") {
        fetchConversations();
      } else if (data.type === "groupChatUpdate") {
        const u = data.update;
        if (!u) return;

        if (u.type === "messageSent") {
          const msg = u.message;
          if (!msg?.id) return;

          const normalized = {
            ...msg,
            uid: data.group_id,
            create_time: Number(msg.created_at || 0) / 1000,
            update_time: Number(msg.created_at || 0),
            text: msg.content?.content || "",
          };

          addMessageWithUserV2(data.group_id, normalized);
        }
      }
    },
    [addMessageWithUserV2, fetchConversations],
  );

  const startPing = useCallback(() => {
    if (pingTimerRef.current) clearInterval(pingTimerRef.current);
    pingTimerRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "ping" }));
      }
    }, PING_INTERVAL);
  }, []);

  const stopPing = useCallback(() => {
    if (pingTimerRef.current) {
      clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }
  }, []);

  const scheduleReconn = useCallback(() => {
    if (closingRef.current) return;
    if (reconnTimerRef.current) clearTimeout(reconnTimerRef.current);
    reconnDelayRef.current = Math.min(reconnDelayRef.current * 1.5, 30000);
    reconnTimerRef.current = setTimeout(() => {
      connectRef.current?.();
    }, reconnDelayRef.current);
  }, []);

  const connect = useCallback(() => {
    if (!idToken || !myUid || !isActive) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    closingRef.current = false;
    setStatus("connecting");

    let ws;
    try {
      ws = new WebSocket(RELAY_URL);
    } catch {
      setStatus("error");
      scheduleReconn();
      return;
    }
    wsRef.current = ws;

    ws.onopen = () => {
      if (ws !== wsRef.current) return;
      reconnDelayRef.current = 2000;
      ws.send(JSON.stringify({ type: "subscribe", user_id: myUid }));
      startPing();
    };

    ws.onmessage = (e) => {
      if (ws !== wsRef.current) return;
      try {
        const msg = JSON.parse(e.data);
        switch (msg.type) {
          case "need_token":
            ws.send(JSON.stringify({ type: "auth", token: idToken }));
            break;
          case "subscribed":
            setStatus("open");
            break;
          case "pong":
            break;
          case "error":
            console.error("Relay error:", msg.message);
            break;
          default:
            handleMessage(msg);
        }
      } catch (_) {}
    };

    ws.onerror = () => {};

    ws.onclose = () => {
      if (ws !== wsRef.current) return;
      wsRef.current = null;
      stopPing();
      if (closingRef.current) {
        setStatus("closed");
        return;
      }
      setStatus("error");
      scheduleReconn();
    };
  }, [idToken, myUid, isActive, handleMessage, startPing, stopPing, scheduleReconn]);

  connectRef.current = connect;

  useEffect(() => {
    if (isActive && idToken && myUid) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [isActive, idToken, myUid, connect, disconnect]);

  const sendReconnect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "reconnect" }));
    }
  }, []);

  return { status, reconnect: connect, disconnect, sendReconnect };
};
