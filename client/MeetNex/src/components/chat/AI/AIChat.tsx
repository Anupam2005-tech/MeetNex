import { useState } from "react";
import ChatBox from "../ChatBox";
import ChatInput from "../ChatInput";
import { Sparkles, Info } from "lucide-react";
import { GoogleGemini } from "@/utils/gemini";
import '../../../App.css'

type Message = {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
};

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      text,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const aiResponse = await GoogleGemini(text);

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        text: aiResponse,
        sender: "other",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
       console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full ">
      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6 space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-fade-in">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 mb-4 shadow-sm">
              <Sparkles size={26} className="text-indigo-500" />
            </div>
            <p className="text-sm font-semibold text-indigo-900">
              Ask Lumi anything
            </p>
            <p className="text-xs text-indigo-700 mt-1 opacity-70">
              Smart, fast answers — right when you need them
            </p>
            
            {/* DISCLAIMER 1: File capability (Empty State) */}
            <div className="mt-6 flex items-start gap-2 max-w-[250px] bg-amber-50 p-3 rounded-lg border border-amber-100/50">
              <Info size={14} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-amber-800 text-left leading-relaxed">
                Currently, Lumi can only process text. <strong>Image and file uploads</strong> are not supported yet. We are working hard to get this for you.
              </p>
            </div>
          </div>
        )}

        <ChatBox messages={messages} />

        {isTyping && (
          <div className="ml-4 mt-2 flex items-center gap-2 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-150" />
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-300" />
            <span className="text-[10px] font-semibold text-indigo-400 ml-1">
              Lumi is thinking…
            </span>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-indigo-50/30 border-t border-indigo-100 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto space-y-2">
         <ChatInput 
            onSend={handleSend} 
            placeholder="Ask Lumi anything..." 
            hideAttachments={true} 
          />
          
          {/* DISCLAIMER 2: AI Accuracy (Sticky Footer) */}
          <p className="text-[10px] text-center text-indigo-400 font-bold ">
            Lumi can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;