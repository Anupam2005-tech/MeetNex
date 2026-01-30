import React, { useState } from "react";
import { useMedia } from "@/context/MeetingContext";
import { Modal } from "../ui/Modal";
import {
  Camera, Mic, Ghost, Bell,
  Sliders, ShieldCheck,
  Keyboard, X, ChevronDown, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/Utils";
import Logo from "../ui/Logo";

type TabType = "media" | "shortcuts" | "preferences";

export default function Setting({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { deviceList, selectedDevice, updateSelectedDevice, saveConfig } = useMedia();
  const [activeTab, setActiveTab] = useState<TabType>("media");
  const [isApplying, setIsApplying] = useState(false);
  const [ghostMode, setGhostMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleApply = async () => {
    setIsApplying(true);
    await saveConfig();
    setIsApplying(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      // Fixed: Centered modal on all screens, responsive width
      className="w-[95%] max-w-[400px] lg:max-w-5xl bg-white rounded-3xl lg:rounded-[40px] shadow-2xl overflow-hidden border-none p-0 relative"
    >
      <div className="flex flex-col lg:flex-row h-[70vh] lg:h-[600px]">

        {/* ================= DESKTOP SIDEBAR (Hidden on Mobile) ================= */}
        <div className="hidden lg:flex w-[260px] bg-zinc-50 border-r border-zinc-100 p-8 flex-col shrink-0">
          <div className="mb-10">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase">Console</h2>
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.3em] mt-1">Core Settings</p>
          </div>
          <nav className="flex flex-col gap-2 flex-1">
            <SidebarTab active={activeTab === "media"} onClick={() => setActiveTab("media")} icon={<Sliders size={18} />} label="Media" sub="Audio & Video" />
            <SidebarTab active={activeTab === "preferences"} onClick={() => setActiveTab("preferences")} icon={<ShieldCheck size={18} />} label="Prefs" sub="Preferences" />
            <SidebarTab active={activeTab === "shortcuts"} onClick={() => setActiveTab("shortcuts")} icon={<Keyboard size={18} />} label="Keys" sub="Shortcuts" />
          </nav>
          <Logo />
        </div>

        {/* ================= CONTENT AREA ================= */}
        <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
          
          {/* HEADER: Shared by Mobile & Desktop */}
          <header className="px-6 py-5 lg:px-10 lg:py-6 flex justify-between items-center border-b border-zinc-100 shrink-0 bg-white z-20">
            
            {/* Mobile Title */}
            <div className="lg:hidden">
                <span className="font-black text-sm uppercase tracking-widest text-zinc-900">Console</span>
            </div>

            {/* Desktop Title */}
            <div className="hidden lg:block">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">{activeTab} Management</h3>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              <SaveButton onClick={handleApply} isApplying={isApplying} />
              <div className="h-6 w-[1px] bg-zinc-100 mx-1" />
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
          </header>

          {/* MOBILE NAV TABS (Hidden on Desktop) */}
          <div className="lg:hidden px-4 pt-4 pb-0 shrink-0">
             <div className="flex p-1 bg-zinc-100/80 rounded-xl">
                <MobileSegment active={activeTab === "media"} onClick={() => setActiveTab("media")} label="Media" />
                <MobileSegment active={activeTab === "preferences"} onClick={() => setActiveTab("preferences")} label="Prefs" />
                <MobileSegment active={activeTab === "shortcuts"} onClick={() => setActiveTab("shortcuts")} label="Keys" />
             </div>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
            <AnimatePresence mode="wait">
              {activeTab === "media" && (
                <motion.div key="media" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-6 lg:space-y-10">
                  {/* Stack on mobile, grid on desktop */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
                    <ConsoleSelect label="Camera" icon={<Camera size={14} />} options={deviceList.cam} value={selectedDevice.camId} onChange={(id: string) => updateSelectedDevice("camId", id)} />
                    <ConsoleSelect label="Audio" icon={<Mic size={14} />} options={deviceList.mics} value={selectedDevice.micId} onChange={(id: string) => updateSelectedDevice("micId", id)} />
                  </div>
                </motion.div>
              )}

              {activeTab === "preferences" && (
                <motion.div key="prefs" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 h-full flex flex-col">
                  <div className="space-y-3">
                    <InteractiveToggle active={ghostMode} onClick={() => setGhostMode(!ghostMode)} icon={<Ghost />} label="Ghost Protocol" desc="Join without media" />
                    <InteractiveToggle active={notifications} onClick={() => setNotifications(!notifications)} icon={<Bell />} label="Priority Alerts" desc="Critical notifications" />
                  </div>
                  <WipCard />
                </motion.div>
              )}

              {activeTab === "shortcuts" && (
                <motion.div key="shortcuts" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-2">
                  <ShortcutRow label="Mic Toggle" keybind="m" />
                  <ShortcutRow label="Cam Toggle" keybind="v" />
                  <ShortcutRow label="End Call" keybind="e" />
                  <ShortcutRow label="Share Screen" keybind="s" />
                  <ShortcutRow label="Toggle Chat" keybind="c" />
                  <ShortcutRow label="Toggle Participants" keybind="p" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f4f4f5; border-radius: 10px; }
      `}</style>
    </Modal>
  );
}

/* ================= COMPONENT SET ================= */

function SidebarTab({ active, onClick, icon, label, sub }: any) {
  return (
    <button onClick={onClick} className={cn(
        "w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group", 
        active ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100/50"
    )}>
      <span className={cn("transition-transform", active ? "scale-110 text-zinc-900" : "group-hover:scale-110")}>{icon}</span>
      <div className="text-left">
        <div className="text-[11px] font-black uppercase tracking-wider">{label}</div>
        <div className="text-[10px] text-zinc-400 font-medium">{sub}</div>
      </div>
    </button>
  );
}

function MobileSegment({ active, onClick, label }: any) {
  return (
    <button onClick={onClick} className={cn(
      "flex-1 py-2 rounded-[9px] text-[10px] font-black uppercase tracking-wider transition-all",
      active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
    )}>
      {label}
    </button>
  );
}

function SaveButton({ onClick, isApplying }: any) {
  return (
    <button
      onClick={onClick}
      disabled={isApplying}
      className={cn(
        "group relative h-9 px-5 lg:h-10 lg:px-6 overflow-hidden rounded-full transition-all duration-500",
        "bg-zinc-900 border border-zinc-800 shadow-lg hover:shadow-zinc-200",
        "hover:bg-black active:scale-95 disabled:opacity-40"
      )}
    >
      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block bg-gradient-to-r from-transparent via-white/[0.1] to-transparent group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isApplying ? <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" /> : (
            <>
              <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-white">Save</span>
              <Check size={12} className="text-white group-hover:scale-110 transition-transform" />
            </>
        )}
      </span>
    </button>
  );
}

function ConsoleSelect({ label, icon, options, value, onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find((opt: any) => opt.deviceId === value)?.label || `Default ${label}`;

  return (
    <div className="space-y-2 flex-1 relative z-10">
      <div className="flex items-center gap-2 px-1 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
        {icon} {label}
      </div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-12 flex items-center justify-between px-4 rounded-xl cursor-pointer transition-all border",
          isOpen ? "bg-zinc-900 border-zinc-900 text-white shadow-lg" : "bg-white border-zinc-200 text-zinc-900 active:scale-[0.98]"
        )}
      >
        <span className="text-xs font-bold truncate pr-4">{selectedLabel}</span>
        <ChevronDown size={14} className={cn("transition-transform duration-300 shrink-0", isOpen && "rotate-180 text-white")} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
              className="absolute left-0 right-0 z-50 bg-white border border-zinc-100 rounded-xl shadow-xl overflow-hidden p-1.5 mt-1"
            >
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                {options.map((opt: any) => (
                    <div key={opt.deviceId} onClick={() => { onChange(opt.deviceId); setIsOpen(false); }}
                    className={cn(
                        "px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between",
                        value === opt.deviceId ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-50"
                    )}>
                      <span className="truncate">{opt.label || `Default ${label}`}</span>
                      {value === opt.deviceId && <Check size={12} className="text-zinc-900 shrink-0" />}
                    </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function InteractiveToggle({ active, onClick, icon, label, desc }: any) {
  return (
    <div onClick={onClick} className={cn(
        "group p-4 rounded-2xl lg:rounded-[28px] border transition-all duration-300 cursor-pointer flex items-center justify-between touch-manipulation",
        active ? "bg-white border-zinc-900 shadow-lg shadow-zinc-200/50" : "bg-white border-zinc-100"
    )}>
      <div className="flex items-center gap-3 pr-2 overflow-hidden">
        <div className={cn("p-2.5 rounded-xl transition-colors duration-300 shrink-0", active ? "bg-zinc-900 text-white" : "bg-zinc-50 text-zinc-400")}>
          {React.cloneElement(icon, { size: 16 })}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-900 truncate">{label}</p>
          <p className="text-[9px] font-medium text-zinc-400 truncate">{desc}</p>
        </div>
      </div>
      <div className={cn("w-9 h-5 rounded-full p-1 transition-colors duration-500 shrink-0", active ? "bg-zinc-900" : "bg-zinc-200")}>
        <motion.div
          animate={{ x: active ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-3 h-3 rounded-full bg-white shadow-md"
        />
      </div>
    </div>
  );
}

function ShortcutRow({ label, keybind }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-transparent hover:border-zinc-200 transition-all">
      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
      <div className="h-8 px-3 flex items-center justify-center bg-white border border-zinc-200 rounded-lg shadow-sm">
        <span className="text-[10px] font-black text-zinc-900 uppercase">{keybind}</span>
      </div>
    </div>
  );
}

function WipCard() {
  return (
    <div className="mt-auto pt-4">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100/50">
            <div className="p-1.5 bg-amber-100 rounded-full shrink-0 mt-0.5">
            <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
            </div>
            <div>
            <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-900 mb-0.5">In Progress</h4>
            <p className="text-[10px] font-medium leading-relaxed text-amber-700/80">
                Features currently under development.
            </p>
            </div>
        </div>
    </div>
  )
}