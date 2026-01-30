import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import ParticipantsChat from "@/components/chat/roomChat/ParticipantsChat";
import Participants from "./Participants"; 
import AIChat from "@/components/chat/AI/AIChat";

interface MeetingSidebarProps {
  type: "chat" | "participants";
  side: "left" | "right";
  onClose: () => void;
}

export const MeetingSidebar = ({ type, side, onClose }: MeetingSidebarProps) => {
  const [activeTab, setActiveTab] = useState<"chat" | "ai">("chat");

  const isLeft = side === "left";
  // Initial slide direction based on side
  const initialX = isLeft ? "-100%" : "100%";

  return (
    <>
      {/* 1. MOBILE BACKDROP (Click outside to close on small screens) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 z-[60] sm:hidden backdrop-blur-sm z-50"
      />

      {/* 2. FLOATING SIDEBAR PANEL */}
      <motion.div
        initial={{ x: initialX, opacity: 0, scale: 0.95 }}
        animate={{ 
          x: 0, 
          opacity: 1, 
          scale: 1,
          boxShadow: "0 24px 60px -12px rgba(15, 23, 42, 0.15)" // Slate-tinted shadow
        }}
        exit={{ x: initialX, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 35 }}
        className={`absolute top-0 bottom-14 left-0 w-full
          bg-slate-50/95 supports-[backdrop-filter]:bg-slate-50/90 backdrop-blur-2xl 
          sm:border sm:border-slate-200 sm:rounded-[2rem] 
          flex flex-col z-[70] overflow-hidden font-sans text-slate-800`}
      >
        
        {/* --- HEADER SECTION --- */}
        <div className="relative h-[80px] flex-shrink-0 flex items-center justify-between px-6 border-b border-slate-200/60 bg-slate-50/50">
          
          {/* A. CHAT TABS (Centered Segmented Control) */}
          {type === "chat" ? (
             <div className="absolute left-1/2 -translate-x-1/2 flex p-1.5 bg-slate-200/50 rounded-full border border-slate-200/50">
                {/* Gliding Background Pill */}
                <div className="relative flex">
                  {/* The Sliding White Background */}
                  <motion.div
                    className="absolute inset-y-0 bg-white rounded-full shadow-sm border border-slate-100"
                    layoutId="activeTabPill"
                    initial={false}
                    animate={{
                      x: activeTab === "chat" ? 0 : "100%",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    style={{ width: '50%' }}
                  />
                  
                  {/* Tab 1: Chat */}
                  <button 
                    onClick={() => setActiveTab("chat")}
                    className={`relative z-10 px-5 py-2 rounded-full text-[13px] font-bold transition-colors flex items-center gap-2 ${activeTab === "chat" ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <MessageSquare size={16} strokeWidth={2.5} className={activeTab === "chat" ? "text-indigo-500" : "text-slate-400"} />
                    Chat
                  </button>

                  {/* Tab 2: Lumi (AI) */}
                  <button 
                    onClick={() => setActiveTab("ai")}
                    className={`relative z-10 px-5 py-2 rounded-full text-[13px] font-bold transition-colors flex items-center gap-2 ${activeTab === "ai" ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Sparkles size={16} strokeWidth={2.5} className={activeTab === "ai" ? "text-pink-500" : "text-slate-400"} />
                    Lumi
                  </button>
                </div>
             </div>
          ) : (
            // B. PARTICIPANTS TITLE
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-indigo-600">
                <Users size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">People</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live</span>
                </div>
              </div>
            </div>
          )}

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="group relative p-2.5 rounded-full hover:bg-slate-200/60 transition-all active:scale-95 border border-transparent hover:border-slate-200"
          >
            <X size={20} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
          </button>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 overflow-hidden relative">
          
          {type === "chat" ? (
            <AnimatePresence mode="wait">
              {activeTab === "chat" ? (
                <motion.div 
                  key="chat"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                   <div className="flex-1 overflow-y-auto custom-scrollbar">
                     <ParticipantsChat />
                   </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="ai"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  <AIChat />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            // PARTICIPANTS VIEW
            <div className="h-full flex flex-col">
               {/* Search Input */}

               
               <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                 <Participants />
               </div>
            </div>
          )}
        </div>
        
        {/* Soft Fade at Bottom - Matched to Slate-50 */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent pointer-events-none z-20" />

      </motion.div>
    </>
  );
};