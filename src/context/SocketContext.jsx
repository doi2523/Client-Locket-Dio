import { createSocket } from "@/socket/socketClient";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthLocket";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken || !user?.uid) return;

    // ❗ Chỉ tạo socket nếu chưa có
    if (!socketRef.current) {
      socketRef.current = createSocket(idToken, {
        onConnect: () => setIsConnected(true),
        onDisconnect: () => setIsConnected(false),
        onError: () => setIsConnected(false),
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user?.uid]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
