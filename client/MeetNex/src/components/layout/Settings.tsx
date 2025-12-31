import React, { useState } from "react";
import { useMedia } from "@/context/MeetingContext";
import { Modal } from "../ui/Modal";
import { 
  Camera, Mic, Ghost, Bell, 
  Sliders, ShieldCheck, 
  Volume2, Keyboard, X, ChevronDown, Sparkles, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/Utils";
import Logo from "../ui/Logo"; // Adjust path as needed

type TabType = "media" | "shortcuts" | "preferences";

export default function Setting({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { deviceList, selectedDevice, updateSelectedDevice } = useMedia();
  const [activeTab, setActiveTab] = useState<TabType>("media");
  const [volume, setVolume] = useState(70);
  const [isApplying, setIsApplying] = useState(false);

  // Preference States
  const [ghostMode, setGhostMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-5xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border-none p-0 relative"
    >
      <div className="flex flex-col lg:flex-row h-[650px]">
        
        {/* ================= SIDEBAR (Navigation & Branding) ================= */}
        <div className="lg:w-[280px] bg-zinc-50 border-r border-zinc-100 p-8 flex flex-col">
          <div className="mb-10 px-1">
             <h2 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase">Console</h2>
             <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.3em] mt-1">Core Settings</p>
          </div>

          <nav className="space-y-2 flex-1">
            <TabButton active={activeTab === "media"} onClick={() => setActiveTab("media")} icon={<Sliders size={18} />} label="Audio & Video" />
            <TabButton active={activeTab === "preferences"} onClick={() => setActiveTab("preferences")} icon={<ShieldCheck size={18} />} label="Preferences" />
            <TabButton active={activeTab === "shortcuts"} onClick={() => setActiveTab("shortcuts")} icon={<Keyboard size={18} />} label="Shortcuts" />
          </nav>

          <Logo/>
           
        </div>

        {/* ================= CONTENT AREA (Actions & Body) ================= */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white">
          
          {/* STICKY TOP ACTION BAR */}
          <header className="px-12 py-6 flex justify-between items-center border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em]">
                {activeTab} Management
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {/* THE RELOCATED APPLY BUTTON */}
              <button
                onClick={handleApply}
                disabled={isApplying}
                className={cn(
                  "group relative h-10 px-6 overflow-hidden rounded-full transition-all duration-500",
                  "bg-zinc-900 border border-zinc-800 shadow-lg hover:shadow-zinc-200",
                  "hover:bg-black hover:-translate-y-0.5 active:scale-95 disabled:opacity-40"
                )}
              >
                {/* Shimmer Effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block bg-gradient-to-r from-transparent via-white/[0.1] to-transparent group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <AnimatePresence mode="wait">
                    {isApplying ? (
                      <motion.div 
                        key="loader"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex gap-1"
                      >
                         <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                         <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-.3s]" />
                         <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-.5s]" />
                      </motion.div>
                    ) : (
                      <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Save Config</span>
                        <Check size={14} className="text-white group-hover:scale-110 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </span>
              </button>

              {/* Close Button Integrated into bar */}
              <div className="h-8 w-[1px] bg-zinc-100 mx-2" />
              <button 
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
          </header>

          {/* SCROLLABLE CONTENT BODY */}
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === "media" && (
                <motion.div key="media" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                  <div className="grid grid-cols-2 gap-8">
                    <ConsoleSelect label="Camera Lens" icon={<Camera size={14}/>} options={deviceList.cam} value={selectedDevice.camId} onChange={(id) => updateSelectedDevice("camId", id)} />
                    <ConsoleSelect label="Audio Input" icon={<Mic size={14}/>} options={deviceList.mics} value={selectedDevice.micId} onChange={(id) => updateSelectedDevice("micId", id)} />
                  </div>

                  {/* MONOCHROME VOLUME SLIDER */}
                  <div className="space-y-6 pt-4">
                     <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                           <Volume2 size={16} className="text-zinc-900" /> Output Gain
                        </span>
                        <span className="text-2xl font-black text-zinc-900 tabular-nums">{volume}%</span>
                     </div>
                     <div className="relative h-1.5 flex items-center group">
                       <div className="absolute w-full h-full bg-zinc-100 rounded-full overflow-hidden">
                          <motion.div initial={false} animate={{ width: `${volume}%` }} className="h-full bg-zinc-900" />
                       </div>
                       <input 
                          type="range" min="0" max="100" value={volume} 
                          onChange={(e) => setVolume(parseInt(e.target.value))}
                          className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
                       />
                       <motion.div animate={{ left: `${volume}%` }} className="absolute w-4 h-4 bg-white border-[3px] border-zinc-900 rounded-full shadow-lg z-0 -ml-2 pointer-events-none" />
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "preferences" && (
                <motion.div key="prefs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <InteractiveToggle active={ghostMode} onClick={() => setGhostMode(!ghostMode)} icon={<Ghost size={22} />} label="Ghost Protocol" desc="Enter rooms with media disabled" />
                  <InteractiveToggle active={notifications} onClick={() => setNotifications(!notifications)} icon={<Bell size={22} />} label="Priority Alerts" desc="Notifications for critical events" />
                </motion.div>
              )}

              {activeTab === "shortcuts" && (
                <motion.div key="keys" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3">
                   <ShortcutRow label="Mute Signal" keybind="M" />
                   <ShortcutRow label="Toggle Lens" keybind="V" />
                   <ShortcutRow label="Terminate Call" keybind="L" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f4f4f5; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e4e4e7; }
      `}</style>
    </Modal>
  );
}

/* UI COMPONENTS */

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group", active ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-400 hover:text-zinc-600")}>
      <span className={cn("transition-transform", active ? "scale-110 text-zinc-900" : "group-hover:scale-110")}>{icon}</span>
      <span className="text-[11px] font-black uppercase tracking-wider">{label}</span>
    </button>
  );
}

function ConsoleSelect({ label, icon, options, value, onChange }: any) {
  return (
    <div className="space-y-3 flex-1 group">
      <div className="flex items-center gap-2 px-1 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] group-focus-within:text-zinc-900 transition-colors">
        {icon} {label}
      </div>
      <div className="relative">
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-5 text-sm font-bold text-zinc-900 outline-none appearance-none cursor-pointer hover:border-zinc-300 focus:bg-zinc-900 focus:text-white transition-all"
        >
          {options.map((opt: any) => (<option key={opt.deviceId} value={opt.deviceId} className="text-zinc-900 bg-white">{opt.label || `Default ${label}`}</option>))}
        </select>
        <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none group-focus-within:text-white group-focus-within:rotate-180 transition-all" />
      </div>
    </div>
  );
}

function InteractiveToggle({ active, onClick, icon, label, desc }: any) {
  return (
    <div onClick={onClick} className={cn("p-6 rounded-[28px] border-2 cursor-pointer transition-all flex items-center justify-between", active ? "bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.01]" : "bg-white border-zinc-100 text-zinc-900 hover:border-zinc-200")}>
      <div className="flex items-center gap-5">
        <div className={cn("p-3 rounded-xl", active ? "bg-white/10" : "bg-zinc-50 text-zinc-400")}>{icon}</div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-wider">{label}</p>
          <p className={cn("text-[10px] font-medium opacity-50", active ? "text-white" : "text-zinc-500")}>{desc}</p>
        </div>
      </div>
      <div className={cn("w-10 h-6 rounded-full p-1 relative transition-colors", active ? "bg-white" : "bg-zinc-200")}>
        <motion.div animate={{ x: active ? 16 : 0 }} className={cn("w-4 h-4 rounded-full shadow-sm", active ? "bg-zinc-900" : "bg-white")} />
      </div>
    </div>
  );
}

function ShortcutRow({ label, keybind }: any) {
  return (
    <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-[28px] border border-transparent hover:border-zinc-200 hover:bg-white transition-all">
       <span className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
       <kbd className="min-w-[40px] h-10 flex items-center justify-center bg-white border border-zinc-200 rounded-xl text-xs font-black shadow-sm text-zinc-900">{keybind}</kbd>
    </div>
  );
}