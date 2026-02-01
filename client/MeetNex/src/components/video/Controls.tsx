import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
import { useMedia } from "@/context/MeetingContext";

interface ControlsProps {
  onToggleParticipants: () => void;
  onToggleChat: () => void;
  showParticipants: boolean;
  showChat: boolean;
}

const Controls = ({ 
  onToggleParticipants, 
  onToggleChat,
  showParticipants,
  showChat 
}: ControlsProps) => {
  const navigate = useNavigate();
  const {
    isMuted,
    isCamOff,
    deviceList,
    selectedDevice,
    updateSelectedDevice,
    handleToggleMic,
    handleToggleCam,
    handleToggleScreenShare,
    handleLeaveCall,
  } = useMedia();

  const [showMicMenu, setShowMicMenu] = useState(false);
  const [showCamMenu, setShowCamMenu] = useState(false);

  const onLeave = () => {
    handleLeaveCall();
    navigate("/",{replace:true});
  };

  // Fixed TypeScript Variants
  const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: 12, scale: 0.95, filter: "blur(8px)" },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        filter: "blur(0px)",
        transition: { type: "spring", damping: 20, stiffness: 300 }
    },
    exit: { 
        opacity: 0, 
        y: 8, 
        scale: 0.95, 
        filter: "blur(8px)",
        transition: { duration: 0.2 }
    },
  };

  const iconBtnClass = "group relative p-2.5 rounded-xl transition-all duration-300 hover:bg-white/10 text-white/50 hover:text-white active:scale-90";
  const activeIconBtnClass = "group relative p-2.5 rounded-xl transition-all duration-300 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 active:scale-90";
  const activeChatBtnClass = "group relative p-2.5 rounded-xl transition-all duration-300 bg-blue-500/10 text-blue-400 border border-blue-500/20 active:scale-90";

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-50 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 bg-zinc-950/80 backdrop-blur-2xl px-4 py-3 rounded-[2.5rem] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">

        {/* MIC GROUP */}
        <div className="relative flex items-center bg-white/[0.03] border border-white/[0.08] rounded-2xl p-1 transition-all hover:border-white/20">
          <button
            onClick={handleToggleMic}
            className={`relative flex items-center justify-center w-12 h-10 rounded-xl transition-all duration-500 ${
              isMuted ? "text-red-400 bg-red-500/10" : "text-white hover:bg-white/5"
            }`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            
            {/* Pulsing Green Indicator for Active Mic */}
            {!isMuted && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-zinc-950"></span>
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setShowMicMenu(!showMicMenu);
              setShowCamMenu(false);
            }}
            className="px-2 h-10 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-colors"
          >
            <ChevronUp size={14} className={`transition-transform duration-500 ${showMicMenu ? "rotate-180" : ""}`} />
          </button>
          
          <AnimatePresence>
            {showMicMenu && (
               <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute bottom-full mb-4 left-0 w-72 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-[60]"
              >
                <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">Input Source</div>
                {deviceList.mics.map((mic, idx) => (
                  <button
                    key={mic.deviceId || idx}
                    onClick={() => {
                      updateSelectedDevice("micId", mic.deviceId);
                      setShowMicMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                      selectedDevice.micId === mic.deviceId
                        ? "bg-white/10 text-white font-medium"
                        : "hover:bg-white/5 text-white/40 hover:text-white"
                    }`}
                  >
                    <span className="truncate pr-4">{mic.label || `Microphone ${idx + 1}`}</span>
                    {selectedDevice.micId === mic.deviceId && <Check size={14} className="text-emerald-400 shrink-0" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CAMERA GROUP */}
        <div className="relative flex items-center bg-white/[0.03] border border-white/[0.08] rounded-2xl p-1 transition-all hover:border-white/20">
          <button
            onClick={handleToggleCam}
            className={`flex items-center justify-center w-12 h-10 rounded-xl transition-all duration-500 ${
              isCamOff ? "text-red-400 bg-red-500/10" : "text-white hover:bg-white/5"
            }`}
          >
            {isCamOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>

          <button
            onClick={() => {
              setShowCamMenu(!showCamMenu);
              setShowMicMenu(false);
            }}
            className="px-2 h-10 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-colors"
          >
            <ChevronUp size={14} className={`transition-transform duration-500 ${showCamMenu ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showCamMenu && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute bottom-full mb-4 left-0 w-72 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-[60]"
              >
                <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">Camera Source</div>
                {deviceList.cam.map((cam, idx) => (
                  <button
                    key={cam.deviceId || idx}
                    onClick={() => {
                      updateSelectedDevice("camId", cam.deviceId);
                      setShowCamMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                      selectedDevice.camId === cam.deviceId
                        ? "bg-white/10 text-white font-medium"
                        : "hover:bg-white/5 text-white/40 hover:text-white"
                    }`}
                  >
                    <span className="truncate pr-4">{cam.label || `Camera ${idx + 1}`}</span>
                    {selectedDevice.camId === cam.deviceId && <Check size={14} className="text-emerald-400 shrink-0" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-[1px] h-8 bg-white/10 mx-1" />

        {/* UTILITY ACTIONS */}
        <div className="flex items-center gap-1.5">
          {/* Screen Share - Hidden on mobile devices */}
          <button 
            onClick={handleToggleScreenShare} 
            className={`${iconBtnClass} hidden md:flex`}
            title="Present Screen"
          >
            <MonitorUp size={20} />
          </button>
          <button 
            onClick={onToggleParticipants} 
            className={showParticipants ? activeIconBtnClass : iconBtnClass}
            title="Participants"
          >
            <Users size={20} />
          </button>
          <button 
            onClick={onToggleChat} 
            className={showChat ? activeChatBtnClass : iconBtnClass}
            title="Chat Message"
          >
            <MessageSquare size={20} />
          </button>
        </div>

        {/* END CALL */}
        <button
          onClick={onLeave}
          className="ml-2 group bg-red-600 hover:bg-red-700 h-11 px-6 rounded-2xl   flex items-center gap-3"
        >
            <PhoneIcon size={16} className="rotate-[135deg] fill-white" />
  
        </button>
      </div>
    </div>
  );
};

export default Controls;