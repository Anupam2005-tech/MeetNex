import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSocket } from "./SocketContext";
import { useAppAuth } from "./AuthContext";

type ExtendedMessage = {
  id: string;
  text: string;
  sender: "me" | "other" | "ai";
  senderName?: string;
  senderImage?: string;
  time: string;
  fileName?: string;
  fileUrl?: string; // This can be a URL or a Data URI
  fileType?: string;
};

interface ChatContextType {
  messages: ExtendedMessage[];
  addMessage: (msg: ExtendedMessage) => void;
  sendMessage: (roomId: string, text: string, attachment?: any) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket, sendMessage: socketSendMessage } = useSocket();
  const { user } = useAppAuth();
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: any) => {
        const isMe = data.senderId === user?.id; // strict check
      
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some(m => m.id === data._id)) return prev;

          // For files sent by others via broadcast (ephemeral), data.attachment.data might be present
          // For files sent by us, we might want to display them from our local read if we didn't get them back (but we stick to echo for now)
          
          return [...prev, {
            id: data._id,
            text: data.message,
            sender: isMe ? "me" : "other",
            senderName: isMe ? "You" : data.senderName,
            senderImage: data.senderImage,
            time: new Date(data.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            fileName: data.attachment?.name,
            fileUrl: data.attachment?.data || data.attachment?.url, // Support both Data URI (relay) and URL (upload)
            fileType: data.attachment?.type
          }];
        });
    };

    socket.on("chat:new", handleNewMessage);

    return () => {
      socket.off("chat:new", handleNewMessage);
    };
  }, [socket, user]);

  const addMessage = useCallback((msg: ExtendedMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Wrapper for socket sendMessage
  const sendMessage = useCallback(async (roomId: string, text: string, attachment?: any) => {
      await socketSendMessage(roomId, text, attachment);
  }, [socketSendMessage]);

  return (
    <ChatContext.Provider value={{ messages, addMessage, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};
