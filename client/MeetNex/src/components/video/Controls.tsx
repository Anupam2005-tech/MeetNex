import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneIcon,
  Users,
  MonitorUp,
  MessageSquare,
  ChevronUp,
  Check,
} from "lucide-react";
import { type MediaDeviceOption } from "@/mediaControl/useExternalCount";

interface ControlsProps {
  isMuted: boolean;
  isCameraOff: boolean;
  mics: MediaDeviceOption[];
  cameras: MediaDeviceOption[];
  selectedMicId: string | null;
  selectedCamId: string | null;
  onSelectMic: (id: string) => void;
  onSelectCamera: (id: string) => void;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleParticipants: () => void;
  onShareScreen: () => void;
  onToggleChat: () => void;
  onLeave: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isMuted,
  isCameraOff,
  mics,
  cameras,
  selectedMicId,
  selectedCamId,
  onSelectMic,
  onSelectCamera,
  onToggleMic,
  onToggleCamera,
  onShareScreen,
  onToggleParticipants,
  onToggleChat,
  onLeave,
}) => {
  const [showMicMenu, setShowMicMenu] = useState(false);
  const [showCamMenu, setShowCamMenu] = useState(false);

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" },
  };

  const iconBtnClass = "p-2.5 rounded-xl transition-all duration-300 hover:bg-white/10 text-white/60 hover:text-white active:scale-90";

  return (
    <div className="fixed bottom-2 left-0 right-0 flex justify-center px-4 z-50 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 bg-black/40 backdrop-blur-2xl px-3 py-2.5 rounded-[2rem] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* MIC GROUP */}
        <div className="relative flex items-center bg-white/[0.03] border border-white/[0.05] rounded-2xl p-0.5">
          <button
            onClick={onToggleMic}
            className={`relative flex items-center justify-center w-12 h-10 rounded-xl transition-all duration-500 ${
              isMuted ? "text-red-400 bg-red-500/10" : "text-white hover:bg-white/5"
            }`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            
            {/* GREEN PING DOT */}
            {!isMuted && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              </span>
            )}
          </button>
          
          <button
            onClick={() => setShowMicMenu(!showMicMenu)}
            className="px-1.5 h-10 hover:bg-white/5 rounded-lg text-white/30 transition-colors"
          >
            <ChevronUp size={14} className={`transition-transform duration-300 ${showMicMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showMicMenu && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden" animate="visible" exit="exit"
                className="absolute bottom-full mb-4 left-0 w-60 bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-1.5 shadow-2xl"
              >
                {mics.map(mic => (
                  <button
                    key={mic.deviceId}
                    onClick={() => { onSelectMic(mic.deviceId); setShowMicMenu(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                      selectedMicId === mic.deviceId ? "bg-white/10 text-white font-medium" : "hover:bg-white/5 text-white/50"
                    }`}
                  >
                    <span className="truncate">{mic.label}</span>
                    {selectedMicId === mic.deviceId && <Check size={12} className="text-emerald-400" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CAMERA GROUP */}
        <div className="relative flex items-center bg-white/[0.03] border border-white/[0.05] rounded-2xl p-0.5">
          <button
            onClick={onToggleCamera}
            className={`flex items-center justify-center w-12 h-10 rounded-xl transition-all duration-500 ${
              isCameraOff ? "text-red-800 bg-red-500/10" : "text-white hover:bg-white/5"
            }`}
          >
            {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>
          
          <button
            onClick={() => setShowCamMenu(!showCamMenu)}
            className="px-1.5 h-10 hover:bg-white/5 rounded-lg text-white/30 transition-colors"
          >
            <ChevronUp size={14} className={`transition-transform duration-300 ${showCamMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showCamMenu && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden" animate="visible" exit="exit"
                className="absolute bottom-full mb-4 left-0 w-60 bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-1.5 shadow-2xl"
              >
                {cameras.map(cam => (
                  <button
                    key={cam.deviceId}
                    onClick={() => { onSelectCamera(cam.deviceId); setShowCamMenu(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                      selectedCamId === cam.deviceId ? "bg-white/10 text-white font-medium" : "hover:bg-white/5 text-white/50"
                    }`}
                  >
                    <span className="truncate">{cam.label}</span>
                    {selectedCamId === cam.deviceId && <Check size={12} className="text-blue-400" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-[1px] h-6 bg-white/[0.08] mx-1" />

        <div className="flex items-center gap-0.5">
          <button onClick={onShareScreen} className={iconBtnClass}><MonitorUp size={19} /></button>
          <button onClick={onToggleParticipants} className={iconBtnClass}><Users size={19} /></button>
          <button onClick={onToggleChat} className={iconBtnClass}><MessageSquare size={19} /></button>
        </div>

        {/* MODERN LEAVE BUTTON */}
        <button 
          onClick={onLeave} 
          className="ml-2 bg-red-600 hover:bg-red-500 text-white h-11 px-5 rounded-[1.25rem] transition-all duration-300  active:scale-95 flex items-center gap-2"
        >
          <PhoneIcon size={18} className="rotate-[135deg] fill-white" />
          <span className="text-sm font-semibold tracking-tight">End</span>
        </button>
      </div>
    </div>
  );
};

export default Controls;