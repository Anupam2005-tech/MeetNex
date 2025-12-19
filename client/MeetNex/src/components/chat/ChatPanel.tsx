import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles, Users, Send } from "lucide-react";
import ChatBox from "@/components/chat/ChatBox";
import ChatInput from "@/components/chat/ChatInput";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other" | "ai";
  time?: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMode, setChatMode] = useState<"participants" | "ai">("participants");
  
  // Filter messages based on mode: "me" appears in both
  const filteredMessages = messages.filter((msg) => {
    if (chatMode === "participants") return msg.sender !== "ai";
    return msg.sender === "ai" || msg.sender === "me";
  });

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);

    if (chatMode === "ai") {
      setTimeout(() => {
        const aiResponse: Message = {
          id: crypto.randomUUID(),
          text: `I'm processing your request regarding: "${text}"`,
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <aside
      className={`fixed top-4 right-4 bottom-4 w-[380px] z-50
      bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
      rounded-3xl transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
      flex flex-col overflow-hidden
      ${isOpen ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"}`}
    >
      {/* HEADER */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Messages
            </h2>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Meeting ID: 482-991
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODERN SEGMENTED CONTROL */}
        <div className="relative flex p-1 bg-gray-100/80 rounded-2xl">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-out ${
              chatMode === "ai" ? "translate-x-full" : "translate-x-0"
            }`}
          />
          <button
            onClick={() => setChatMode("participants")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold transition-colors ${
              chatMode === "participants" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users size={16} />
            Participants
          </button>
          <button
            onClick={() => setChatMode("ai")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold transition-colors ${
              chatMode === "ai" ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Sparkles size={16} />
            AI Assistant
          </button>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              {chatMode === 'ai' ? <Sparkles className="text-indigo-300" /> : <Users className="text-gray-300" />}
            </div>
            <p className="text-gray-400 text-sm">No messages yet in {chatMode} mode.</p>
          </div>
        ) : (
          <ChatBox messages={filteredMessages} />
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-white/50 backdrop-blur-md">
        <div className="relative group">
          <ChatInput 
            onSend={handleSendMessage} 
            placeholder={chatMode === 'ai' ? "Ask AI anything..." : "Send a message..."}
          />
        </div>
      </div>
    </aside>
  );
};

export default ChatPanel;