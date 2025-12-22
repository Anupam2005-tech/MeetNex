import React, { useState } from "react";
import ChatBox from "../ChatBox"
import ChatInput from "../ChatInput";

type Attachment = {
  file: File; // Define the Attachment type
};

type Message = {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
  fileName?: string; // Added fileName property
  fileUrl?: string;  // Added fileUrl property
};

const ParticipantsChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

const handleSend = (text: string, attachments: Attachment[]) => {
  const hasFile = attachments.length > 0;
  
  const newMessage: Message = {
    id: crypto.randomUUID(),
    text: text,
    sender: "me",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    // New Logic for Files
    fileName: hasFile ? attachments[0].file.name : undefined,
    fileUrl: hasFile ? URL.createObjectURL(attachments[0].file) : undefined,
  };

  setMessages(prev => [...prev, newMessage]);
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