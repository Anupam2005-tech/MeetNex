import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { createSocket, getSocket, disconnectSocket } from '@/lib/socket';
import { useAppAuth } from './AuthContext';

interface SocketContextType {
  socket: any | null;
  isConnected: boolean;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => void;
  sendMessage: (message: string) => void;
  isTyping: (roomId: string, isTyping: boolean) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, isSignedIn } = useAppAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<any>(null);

  // Initialize socket connection on auth
  useEffect(() => {
    if (!isSignedIn) {
      if (socketRef.current) {
        disconnectSocket();
        socketRef.current = null;
      }
      return;
    }

    const initializeSocket = async () => {
      try {
        const token = await getToken();
        if (token) {
          const newSocket = await createSocket(token);
          socketRef.current = newSocket;

          newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setIsConnected(true);
          });

          newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
          });

          newSocket.on('connect_error', (error: any) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
          });

          newSocket.on('error', (error: any) => {
            console.error('Socket error:', error);
          });
        }
      } catch (error) {
        console.error('Failed to initialize socket:', error);
        setIsConnected(false);
      }
    };

    initializeSocket();

    return () => {
      if (socketRef.current) {
        disconnectSocket();
        socketRef.current = null;
      }
    };
  }, [isSignedIn, getToken]);

  const joinRoom = useCallback(async (roomId: string): Promise<void> => {
    const currentSocket = socketRef.current;
    if (currentSocket?.connected) {
      return new Promise<void>((resolve, reject) => {
        currentSocket.emit('join-room', { roomId }, (response: any) => {
          if (response?.error) {
            reject(new Error(response.error));
          } else {
            resolve();
          }
        });

        setTimeout(() => reject(new Error('Join room timeout')), 10000);
      });
    } else {
      return Promise.reject(new Error('Socket not connected'));
    }
  }, []);

  const leaveRoom = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room');
    }
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (socketRef.current) {
      socketRef.current.emit('chat:send', { message });
    }
  }, []);

  const isTyping = useCallback((roomId: string, typing: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit(
        typing ? 'chat:typing:start' : 'chat:typing:stop',
        { roomId }
      );
    }
  }, []);

  const value: SocketContextType = {
    socket: socketRef.current,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
    isTyping,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
