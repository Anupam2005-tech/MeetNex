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
      className="max-w-5xl w-[95%] lg:w-full bg-white rounded-[30px] lg:rounded-[40px] shadow-2xl overflow-hidden border-none p-0 relative"
    >
      {/* Changed fixed h-[650px] to max-h for responsiveness */}
      <div className="flex flex-col lg:flex-row h-full max-h-[90vh] lg:h-[650px]">

        {/* ================= SIDEBAR / TOP NAV ================= */}
        <div className="w-full lg:w-[280px] bg-zinc-50 border-b lg:border-b-0 lg:border-r border-zinc-100 p-6 lg:p-8 flex flex-col shrink-0">
          <div className="mb-6 lg:mb-10 px-1 flex lg:block items-center justify-between">
            <div>
              <h2 className="text-xl lg:text-2xl font-black text-zinc-900 tracking-tighter uppercase">Console</h2>
              <p className="text-[8px] lg:text-[9px] text-zinc-400 font-bold uppercase tracking-[0.3em] mt-1">Core Settings</p>
            </div>
            {/* Logo hidden on mobile sidebar header as it's at the bottom for desktop */}
            <div className="lg:hidden scale-75 origin-right">
                <Logo />
            </div>
          </div>

          {/* Nav becomes scrollable on mobile */}
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar pb-2 lg:pb-0 flex-1">
            <TabButton active={activeTab === "media"} onClick={() => setActiveTab("media")} icon={<Sliders size={18} />} label="Media" fullLabel="Audio & Video" />
            <TabButton active={activeTab === "preferences"} onClick={() => setActiveTab("preferences")} icon={<ShieldCheck size={18} />} label="Prefs" fullLabel="Preferences" />
            <TabButton active={activeTab === "shortcuts"} onClick={() => setActiveTab("shortcuts")} icon={<Keyboard size={18} />} label="Keys" fullLabel="Shortcuts" />
          </nav>

          <div className="hidden lg:block">
            <Logo />
          </div>
        </div>

        {/* ================= CONTENT AREA ================= */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white">

          <header className="px-6 lg:px-12 py-4 lg:py-6 flex justify-between items-center border-b border-zinc-100 shrink-0">
            <div>
              <h3 className="text-[10px] lg:text-sm font-black text-zinc-400 uppercase tracking-[0.2em]">
                {activeTab} <span className="hidden sm:inline">Management</span>
              </h3>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              <button
                onClick={handleApply}
                disabled={isApplying}
                className={cn(
                  "group relative h-9 lg:h-10 px-4 lg:px-6 overflow-hidden rounded-full transition-all duration-500",
                  "bg-zinc-900 border border-zinc-800 shadow-lg hover:shadow-zinc-200",
                  "hover:bg-black hover:-translate-y-0.5 active:scale-95 disabled:opacity-40"
                )}
              >
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block bg-gradient-to-r from-transparent via-white/[0.1] to-transparent group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

                <span className="relative z-10 flex items-center justify-center gap-2">
                  <AnimatePresence mode="wait">
                    {isApplying ? (
                      <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-.3s]" />
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-.5s]" />
                      </motion.div>
                    ) : (
                      <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                        <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-white">Save</span>
                        <Check size={12} className="text-white group-hover:scale-110 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </span>
              </button>

              <div className="h-6 lg:h-8 w-[1px] bg-zinc-100 mx-1 lg:mx-2" />
              <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all">
                <X size={18}  strokeWidth={2.5} />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === "media" && (
                <motion.div key="media" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 lg:space-y-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                    <ConsoleSelect label="Camera Lens" icon={<Camera size={14} />} options={deviceList.cam} value={selectedDevice.camId} onChange={(id: string) => updateSelectedDevice("camId", id)} />
                    <ConsoleSelect label="Audio Input" icon={<Mic size={14} />} options={deviceList.mics} value={selectedDevice.micId} onChange={(id: string) => updateSelectedDevice("micId", id)} />
                  </div>
                </motion.div>
              )}

              {activeTab === "preferences" && (
                <motion.div
                  key="prefs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 h-full flex flex-col"
                >
                  <div className="space-y-3 lg:space-y-4">
                    <InteractiveToggle
                      active={ghostMode}
                      onClick={() => setGhostMode(!ghostMode)}
                      icon={<Ghost />}
                      label="Ghost Protocol"
                      desc="Enter rooms with media disabled"
                    />
                    <InteractiveToggle
                      active={notifications}
                      onClick={() => setNotifications(!notifications)}
                      icon={<Bell />}
                      label="Priority Alerts"
                      desc="Notifications for critical events"
                    />
                  </div>

                  <div className="mt-8 lg:mt-auto pt-6 lg:pt-8">
                    <div className="flex items-start gap-3 lg:gap-4 p-4 lg:p-5 rounded-3xl bg-amber-50 border border-amber-100/50">
                      <div className="p-2 bg-amber-100 rounded-full shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-[10px] lg:text-[11px] font-black uppercase tracking-wider text-amber-900 mb-1">
                          Work in Progress
                        </h4>
                        <p className="text-[10px] lg:text-[11px] font-medium leading-relaxed text-amber-700/80">
                          These features are under development. Core functionality is currently disabled for stability.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "shortcuts" && (
                <motion.div key="keys" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-2 lg:gap-3">
                  <ShortcutRow label="Mic Mute/UnMute" keybind="m" />
                  <ShortcutRow label="Cam ON/Off" keybind="v" />
                  <ShortcutRow label="Terminate Call" keybind="e" />
                  <ShortcutRow label="Screen Sharing" keybind="s" />
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </Modal>
  );
}

/* UI COMPONENTS */

function TabButton({ active, onClick, icon, label, fullLabel }: any) {
  return (
    <button onClick={onClick} className={cn(
        "flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all group shrink-0", 
        active ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-400 hover:text-zinc-600"
    )}>
      <span className={cn("transition-transform", active ? "scale-110 text-zinc-900" : "group-hover:scale-110")}>{icon}</span>
      <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
        <span className="lg:hidden">{label}</span>
        <span className="hidden lg:inline">{fullLabel}</span>
      </span>
    </button>
  );
}

function ConsoleSelect({ label, icon, options, value, onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find((opt: any) => opt.deviceId === value)?.label || `Default ${label}`;

  return (
    <div className="space-y-2 lg:space-y-3 flex-1 relative">
      <div className="flex items-center gap-2 px-1 text-[8px] lg:text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
        {icon} {label}
      </div>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-12 lg:h-14 flex items-center justify-between px-4 lg:px-5 rounded-xl lg:rounded-2xl cursor-pointer transition-all border",
          isOpen ? "bg-zinc-900 border-zinc-900 text-white shadow-xl" : "bg-zinc-50 border-zinc-100 text-zinc-900 hover:border-zinc-300"
        )}
      >
        <span className="text-xs lg:text-sm font-bold truncate pr-4">{selectedLabel}</span>
        <ChevronDown size={14} className={cn("transition-transform duration-300", isOpen && "rotate-180 text-white")} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 5, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute left-0 right-0 z-50 bg-white border border-zinc-100 rounded-xl lg:rounded-2xl shadow-2xl overflow-hidden p-1.5"
            >
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                {options.map((opt: any) => (
                    <div
                    key={opt.deviceId}
                    onClick={() => { onChange(opt.deviceId); setIsOpen(false); }}
                    className={cn(
                        "px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-[11px] lg:text-sm font-bold transition-all cursor-pointer flex items-center justify-between",
                        value === opt.deviceId ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                    )}
                    >
                    {opt.label || `Default ${label}`}
                    {value === opt.deviceId && <Check size={14} className="text-zinc-900" />}
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
    <div
      onClick={onClick}
      className={cn(
        "group p-4 lg:p-5 rounded-[24px] lg:rounded-[32px] border transition-all duration-300 cursor-pointer flex items-center justify-between",
        active ? "bg-white border-zinc-900 shadow-[0_0_20px_rgba(0,0,0,0.05)]" : "bg-white border-zinc-100 hover:border-zinc-200"
      )}
    >
      <div className="flex items-center gap-3 lg:gap-4">
        <div className={cn(
          "p-2.5 lg:p-3 rounded-xl lg:rounded-2xl transition-colors duration-300",
          active ? "bg-zinc-900 text-white" : "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100"
        )}>
          {React.cloneElement(icon as React.ReactElement, { size: 18 } as any)}
        </div>
        <div>
          <p className="text-[10px] lg:text-[11px] font-black uppercase tracking-wider text-zinc-900">{label}</p>
          <p className="text-[9px] lg:text-[10px] font-medium text-zinc-400">{desc}</p>
        </div>
      </div>

      <div className={cn(
        "w-9 h-5 lg:w-11 lg:h-6 rounded-full p-1 transition-colors duration-500",
        active ? "bg-zinc-900" : "bg-zinc-200"
      )}>
        <motion.div
          animate={{ x: active ? (typeof window !== 'undefined' && window.innerWidth < 1024 ? 16 : 20) : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-white shadow-md"
        />
      </div>
    </div>
  );
}

function ShortcutRow({ label, keybind }: any) {
  return (
    <div className="flex items-center justify-between p-4 lg:p-6 bg-zinc-50 rounded-[22px] lg:rounded-[28px] border border-transparent hover:border-zinc-200 hover:bg-white transition-all">
      <span className="text-[10px] lg:text-[11px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
      <kbd className="min-w-[32px] lg:min-w-[40px] h-8 lg:h-10 flex items-center justify-center bg-white border border-zinc-200 rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-black shadow-sm text-zinc-900">{keybind}</kbd>
    </div>
  );
}