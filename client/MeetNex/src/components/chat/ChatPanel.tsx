import React, { useState } from "react";
import { X, Sparkles, Users } from "lucide-react";
import ParticipantsChat from "./roomChat/ParticipantsChat"; // We will create this
import AIChat from "./AI/AIChat"; // We will create this

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"participants" | "ai">("participants");

  return (
    <aside
      className={`fixed top-4 right-4 bottom-4 w-[380px] z-50
      bg-white/90 backdrop-blur-2xl border border-white/20 shadow-2xl
      rounded-3xl transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
      flex flex-col overflow-hidden
      ${isOpen ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"}`}
    >
      {/* HEADER */}
      <div className="p-5 pb-3 bg-white/50 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* TABS CONTROLLER */}
        <div className="relative flex p-1 bg-gray-100/80 rounded-2xl border border-black/5">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-out ${
              activeTab === "ai" ? "translate-x-full" : "translate-x-0"
            }`}
          />
          <button
            onClick={() => setActiveTab("participants")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold transition-colors ${
              activeTab === "participants" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Users size={16} /> Participants
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold transition-colors ${
              activeTab === "ai" ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            <Sparkles size={16} /> AI Assistant
          </button>
        </div>
      </div>

      {/* DYNAMIC CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === "participants" ? <ParticipantsChat /> : <AIChat />}
      </div>
    </aside>
  );
};

export default ChatPanel;