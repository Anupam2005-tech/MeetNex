import React, { useState } from "react";
import ChatBox from "../ChatBox";
import ChatInput from "../ChatInput";
import { Sparkles } from "lucide-react";

type Message = {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
};

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      text,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);

    // AI logic is fully contained here now
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        text: `As your AI assistant, I've analyzed: "${text}". How else can I help?`,
        sender: "other",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
            <Sparkles size={32} className="mb-4 text-indigo-400" />
            <p className="text-sm font-medium">Ask the AI to summarize the meeting or take notes.</p>
          </div>
        )}
        <ChatBox messages={messages} />
        {isTyping && <p className="text-[10px] text-indigo-400 font-bold animate-pulse ml-4 mt-2">AI is thinking...</p>}
      </div>
      <div className="p-4 bg-indigo-50/30 border-t border-indigo-100">
        <ChatInput onSend={handleSend} placeholder="Ask AI anything..." />
      </div>
    </>
  );
};

export default AIChat;