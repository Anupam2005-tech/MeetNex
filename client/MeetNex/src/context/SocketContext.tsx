import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAppAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { getToken, isSignedIn } = useAppAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    const initSocket = async () => {
      try {
        const token = await getToken();
        
        const newSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
          auth: {
            token,
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        newSocket.on("connect", () => {
          console.log("Socket connected");
          setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
          console.log("Socket disconnected");
          setIsConnected(false);
        });

        newSocket.on("error", (error) => {
          console.error("Socket error:", error);
        });

        setSocket(newSocket);
      } catch (error) {
        console.error("Failed to initialize socket:", error);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isSignedIn, getToken]);

  const joinRoom = useCallback(
    async (roomId: string) => {
      return new Promise<void>((resolve, reject) => {
        if (!socket) {
          reject(new Error("Socket not connected"));
          return;
        }

        socket.emit("joinRoom", { roomId }, (error: any) => {
          if (error) {
            reject(new Error(error));
          } else {
            console.log(`Joined room: ${roomId}`);
            resolve();
          }
        });
      });
    },
    [socket]
  );

  const leaveRoom = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      if (!socket) {
        reject(new Error("Socket not connected"));
        return;
      }

      socket.emit("leaveRoom", (error: any) => {
        if (error) {
          reject(new Error(error));
        } else {
          console.log("Left room");
          resolve();
        }
      });
    });
  }, [socket]);

  const value = {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
};