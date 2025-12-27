import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Command,
  Zap,
  Cpu,
  BrainCircuit
} from "lucide-react";
import { GoogleGemini } from "@/utils/gemini"; 

type Message = {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
};

const LumiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput("");

    const userMsg: Message = {
      id: crypto.randomUUID(),
      text: userText,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const aiResponseText = await GoogleGemini(userText);
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        text: aiResponseText,
        sender: "other",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    // FIX: Full height container with no outside scroll
    <div className="flex h-screen w-full flex-col bg-[#F8FAFF] overflow-hidden font-sans">
      
      {/* HEADER: Playful & Clean */}
      <header className="flex items-center justify-between border-b border-indigo-50 bg-white px-6 py-4 shadow-sm z-20">
        <div className="flex items-center gap-3">
         <div className="relative group">
  {/* Sublte outer glow for that "Pro" feel */}
  <div className="absolute -inset-1 bg-zinc-400/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
  
  <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-100 shadow-2xl border border-zinc-800 ring-1 ring-white/10 shadow-black/40">
    <BrainCircuit 
      size={22} 
      strokeWidth={1.5} 
      className="text-zinc-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" 
    />
  </div>
</div>
          <div>
            <h1 className="text-sm font-bold text-slate-800">Lumi <span className="text-indigo-500">AI</span></h1>
            <p className="text-[10px] font-medium text-emerald-500 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> AI Active
            </p>
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
           <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
              <Zap size={12} className="text-indigo-600" />
             
           </div>
        </div>
      </header>

      {/* MESSAGES AREA: FIX: flex-1 and overflow-y-auto ensures only this part scrolls */}
      <main className="flex-1 overflow-y-auto px-4 py-8 space-y-6 no-scrollbar">
        <div className="max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 mt-20">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-200 blur-2xl opacity-40 rounded-full animate-pulse" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white border border-indigo-100 shadow-xl shadow-indigo-100/50">
                  <Sparkles size={32} className="text-indigo-600" />
                </div>
              </div>
              
              <h3 className="text-xl font-extrabold text-slate-800">What's on your mind?</h3>
        
              {/* SPECIAL TRAINING DISCLAIMER */}
              <div className="mt-10 flex items-start gap-3 max-w-sm bg-amber-50/80 p-4 rounded-2xl border border-amber-100 text-left">
                <div className="mt-0.5 rounded-lg bg-amber-100 p-1.5">
                  <Cpu size={16} className="text-amber-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-900 leading-none mb-1">Still Growing!</p>
                  <p className="text-[11px] text-amber-800/80 leading-relaxed font-medium">
                    Lumi is currently training its visual cortex. 
                    <strong> Images and PDFs </strong> are coming soon! We're working hard to give Lumi eyes.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              
              {isTyping && (
                <div className="flex w-full justify-start animate-in slide-in-from-left-2">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white border border-indigo-50 rounded-2xl shadow-sm">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-300" />
                    <span className="text-[10px] font-bold text-indigo-400 ml-1 uppercase tracking-wider">Lumi is thinking</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} className="h-4" />
            </div>
          )}
        </div>
      </main>

      {/* INPUT AREA */}
      <footer className="bg-white border-t border-indigo-50 p-4 sm:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center transition-all duration-300">
            <div className="absolute left-4 text-slate-400">
               <Command size={18} />
            </div>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Message Lumi..."
              className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 pl-12 pr-14 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50"
              disabled={isTyping}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95 disabled:grayscale disabled:opacity-50"
            >
              <Send size={18} strokeWidth={2.5} />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-center gap-4">
             <p className="text-[10px] font-bold text-slate-400 tracking-widest">
                Lumi can make mistakes. So double check the answer .
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// HELPER COMPONENTS
const MessageBubble = ({ message }: { message: Message }) => {
  const isMe = message.sender === "me";
  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
      <div className={`flex max-w-[85%] items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold shadow-sm ${
          isMe ? "bg-slate-800 text-white" : "bg-indigo-600 text-white"
        }`}>
          {isMe ? <User size={12} /> : <Bot size={14} />}
        </div>
        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
          <div className={`px-4 py-3 text-sm font-medium leading-relaxed shadow-sm ${
            isMe 
              ? "rounded-2xl rounded-br-none bg-slate-800 text-slate-50" 
              : "rounded-2xl rounded-bl-none bg-white border border-indigo-50 text-slate-700"
          }`}>
            {message.text}
          </div>
          <span className="mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
            {message.time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LumiChat;