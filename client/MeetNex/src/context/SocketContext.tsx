import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string, userId: string, userProfile?: { fullName: string; imageUrl?: string }) => Promise<void>;
  leaveRoom: () => Promise<void>;
  sendMessage: (roomId: string, message: string, attachment?: any) => Promise<void>;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { getToken, isSignedIn } = useAppAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    const initSocket = async () => {
      try {
        const token = await getToken();

        const newSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
          auth: { token },
          transports: ["websocket"],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        newSocket.on("connect", () => {
// console.log("Socket connected:", newSocket.id);
          setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
// console.log("Socket disconnected");
          setIsConnected(false);
        });

        newSocket.on("connect_error", (_err) => {
// console.error("Socket connection error:", err.message);
        });

        socketRef.current = newSocket;
      } catch (err) {
// console.error("Failed to initialize socket:", err);
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isSignedIn, getToken]);

  const joinRoom = useCallback(
    async (roomId: string, userId: string, userProfile?: { fullName: string; imageUrl?: string }): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        if (!socketRef.current) {
          reject(new Error("Socket not connected"));
          return;
        }

        // ✅ Make sure this matches the server event: "join-room"
        socketRef.current.emit("join-room", { roomId, userId, userProfile }, (response: any) => {
          if (response?.success) {
// console.log(`✅ Joined room: ${roomId}`);
            resolve();
          } else {
            reject(new Error("Failed to join room"));
          }
        });
      });
    },
    [socketRef.current]
  );

  const leaveRoom = useCallback(async () => {
    if (!socketRef.current) throw new Error("Socket not connected");

    socketRef.current.emit("leave-room");
// console.log("Left room");
  }, []);

  const sendMessage = useCallback(async (roomId: string, message: string, attachment?: any) => {
     if (!socketRef.current) return;
     socketRef.current.emit("chat:send", { roomId, message, attachment });
  }, []);
  
  const value = {
    socket: socketRef.current,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
};
