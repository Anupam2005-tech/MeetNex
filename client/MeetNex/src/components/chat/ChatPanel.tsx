import { useState, lazy, Suspense } from "react";
import { X, Sparkles, Users } from "lucide-react";
import Loader from "@/components/ui/Loader"; // Adjust path as needed
import { cn } from "../../lib/Utils"; // Adjust path as needed

// Lazy load chat tabs
const ParticipantsChat = lazy(() => import("./roomChat/ParticipantsChat"));
const AIChat = lazy(() => import("./AI/AIChat"));

interface ChatPanelProps {
  isOpen: boolean; // Kept for API consistency, though mostly controlled by parent layout now
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"participants" | "ai">("participants");

  return (
    <aside className="w-full h-full bg-[#FDFCF8] flex flex-col border-l border-stone-200/50 font-sans">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="px-6 pt-6 pb-2 shrink-0 bg-[#FDFCF8] z-20">
        
        {/* Title Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-stone-800 rounded-full" /> {/* Accent Bar */}
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              Lounge
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="group p-2 -mr-2 rounded-full hover:bg-stone-100 transition-colors duration-300"
          >
            <X size={20} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
          </button>
        </div>

        {/* Sassy Segmented Control */}
        <div className="relative flex p-1.5 bg-stone-100 rounded-2xl">
          {/* Animated Background Slider */}
          <div
            className={cn(
              "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl border border-stone-200/50 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
              activeTab === "ai" ? "translate-x-[100%] ml-1.5" : "translate-x-0"
            )}
          />

          {/* Tab: Participants */}
          <button
            onClick={() => setActiveTab("participants")}
            className={cn(
              "relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors duration-300",
              activeTab === "participants" ? "text-stone-900" : "text-stone-400 hover:text-stone-600"
            )}
          >
            <Users size={14} strokeWidth={2.5} className={cn("transition-colors", activeTab === "participants" ? "text-blue-500" : "text-stone-400")} />
            People
          </button>

          {/* Tab: Lumi AI */}
          <button
            onClick={() => setActiveTab("ai")}
            className={cn(
              "relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors duration-300",
              activeTab === "ai" ? "text-stone-900" : "text-stone-400 hover:text-stone-600"
            )}
          >
            <Sparkles size={14} strokeWidth={2.5} className={cn("transition-colors", activeTab === "ai" ? "text-orange-400" : "text-stone-400")} />
            Lumi
          </button>
        </div>
      </div>

      {/* ================= CONTENT AREA ================= */}
      <div className="flex-1 relative overflow-hidden">
        
        {/* Participants View */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] bg-[#FDFCF8]",
            activeTab === "participants" 
              ? "opacity-100 translate-x-0 pointer-events-auto" 
              : "opacity-0 -translate-x-10 pointer-events-none"
          )}
        >
          <Suspense fallback={<div className="h-full flex items-center justify-center"><Loader /></div>}>
            <ParticipantsChat />
          </Suspense>
        </div>

        {/* AI View */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] bg-[#FDFCF8]",
            activeTab === "ai" 
              ? "opacity-100 translate-x-0 pointer-events-auto" 
              : "opacity-0 translate-x-10 pointer-events-none"
          )}
        >
          <Suspense fallback={<div className="h-full flex items-center justify-center"><Loader /></div>}>
            <AIChat />
          </Suspense>
        </div>
      </div>

   
    </aside>
  );
};

export default ChatPanel;