import React from "react";
import ChatBox from "../ChatBox";
import ChatInput from "../ChatInput";
// import { useSocket } from "@/context/SocketContext"; // Removed
import { useParams } from "react-router-dom";
// import axios from "axios"; // Removed for ephemeral transfer
import { toast } from "sonner";
// import { useAppAuth } from "@/context/AuthContext"; // Moved to Context
import { useChat } from "@/context/ChatContext";

type Attachment = {
  file: File;
};

const ParticipantsChat: React.FC = () => {
  const { messages, sendMessage } = useChat(); // Use global chat context
  const { roomId } = useParams();

  const handleSend = async (text: string, attachments: Attachment[]) => {
    if (!roomId) return;

    try {
      // 1. Handle File Attachment (Socket Transfer - No Storage)
      if (attachments.length > 0) {
        const file = attachments[0].file;
        
        // Check size limit (10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File too large (Max 10MB for instant transfer)");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
             const fileData = reader.result; // Base64
             sendMessage(roomId, text, {
                 name: file.name,
                 type: file.type,
                 data: fileData // Send raw data
             });
        };
        reader.readAsDataURL(file);
      } 
      // 2. Text Only
      else if (text.trim()) {
         await sendMessage(roomId, text);
      }

    } catch (e) {
       // console.error("Failed to send message", e);
       toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <ChatBox messages={messages} />
      </div>

      <div className="p-4 bg-white/50 border-t border-gray-100">
        <ChatInput onSend={handleSend} placeholder="Chat with everyone..." />
      </div>
    </div>
  );
};

export default ParticipantsChat;