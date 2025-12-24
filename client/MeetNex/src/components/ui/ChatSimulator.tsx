"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Send } from "lucide-react";

const MESSAGES = [
  { id: 1, sender: "user", text: "Hello! Analyze the links from this site." },
  { id: 2, sender: "lumi", text: "I've scanned the domain. Found 12 active endpoints." },
  { id: 3, sender: "user", text: "Why don't you do it yourself?" },
  { id: 4, sender: "lumi", text: "Because I'm an AI, and you're the boss! 😉" },
  { id: 5, sender: "user", text: "Fair point. Can you map out the data flow for the main API?" },
  { id: 6, sender: "lumi", text: "Already on it. Visualizing the pipeline now... looks like a standard REST structure with a Redis layer." },
  { id: 7, sender: "user", text: "Impressive. How fast can you run a full security audit?" },
  { id: 8, sender: "lumi", text: "Faster than you can finish that coffee! Ready to start whenever you are. ☕️" },
];

export function ChatSimulator() {
  const [index, setIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState([MESSAGES[0]]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % MESSAGES.length;
        if (next === 0) {
          setVisibleMessages([MESSAGES[0]]);
        } else {
          setVisibleMessages((prevMsgs) => [...prevMsgs, MESSAGES[next]].slice(-4));
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50/50">
      <div className="flex-1 p-4 space-y-3 overflow-hidden flex flex-col justify-start">
        <AnimatePresence mode="popLayout">
          {visibleMessages.map((msg, i) => (
            <motion.div
              key={`${msg.id}-${i}`}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
              className={`max-w-[85%] p-3 rounded-2xl text-[11px] font-medium shadow-sm ${
                msg.sender === "user" 
                  ? "ml-auto bg-white text-slate-800 border border-slate-200" 
                  : "mr-auto bg-slate-950 text-white"
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 border border-slate-200">
          <div className="flex-1 text-[11px] text-slate-400 truncate">
            {MESSAGES[(index + 1) % MESSAGES.length].sender === "user" ? "Type a message..." : "Lumi is typing..."}
          </div>
          <Send size={14} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}