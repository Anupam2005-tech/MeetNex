import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  MonitorUp, PhoneOff, MessageSquare, Users,
  MoreVertical, Copy, Keyboard, X
} from "lucide-react";
import { Track } from "livekit-client";
import { useLocalParticipant } from "@livekit/components-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useState, useRef } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SidebarState = "none" | "chat" | "participants";

interface ControlBarProps {
  sidebar: SidebarState;
  setSidebar: (s: SidebarState) => void;
  onLeave: () => void;
  visible?: boolean;
  onCopyLink?: () => void;
  onOpenShortcuts?: () => void;
}

export const MeetingControls = ({ sidebar, setSidebar, onLeave, onCopyLink, onOpenShortcuts }: ControlBarProps) => {
  const { localParticipant } = useLocalParticipant();
  const [isMicOn, setIsMicOn] = useState(localParticipant.isMicrophoneEnabled);
  const [isCamOn, setIsCamOn] = useState(localParticipant.isCameraEnabled);
  const [isScreenShare, setIsScreenShare] = useState(localParticipant.isScreenShareEnabled);
  
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Sync state with LiveKit
  useEffect(() => {
    setIsMicOn(localParticipant.isMicrophoneEnabled);
    setIsCamOn(localParticipant.isCameraEnabled);
    setIsScreenShare(localParticipant.isScreenShareEnabled);
  }, [localParticipant.isMicrophoneEnabled, localParticipant.isCameraEnabled, localParticipant.isScreenShareEnabled]);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    if (showMoreMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMoreMenu]);

  const toggleSidebar = (type: SidebarState) => {
    setSidebar(sidebar === type ? "none" : type);
    setShowMoreMenu(false);
  };

  const primaryButtons = [
    { 
      icon: isMicOn ? Mic : MicOff, 
      label: isMicOn ? "Mic On" : "Mic Off", 
      active: isMicOn, 
      onClick: () => localParticipant.setMicrophoneEnabled(!isMicOn),
      color: "default" 
    },
    { 
      icon: isCamOn ? VideoIcon : VideoOff, 
      label: isCamOn ? "Cam On" : "Cam Off", 
      active: isCamOn, 
      onClick: async () => {
         const newState = !isCamOn;
         const tracksToStop = Array.from(localParticipant.videoTrackPublications.values())
           .filter(pub => pub.source === Track.Source.Camera && pub.track)
           .map(pub => pub.track);
         await localParticipant.setCameraEnabled(newState);
         if (!newState) {
           tracksToStop.forEach((track) => {
             track?.stop();
             track?.mediaStreamTrack?.stop();
           });
         }
      },
      color: "default" 
    },
    { 
      icon: MonitorUp, 
      label: "Share", 
      active: isScreenShare, 
      onClick: () => localParticipant.setScreenShareEnabled(!isScreenShare),
      color: "feature" 
    },
  ];

  const secondaryButtons = [
    { 
      icon: MessageSquare, 
      label: "Chat", 
      active: sidebar === "chat", 
      onClick: () => toggleSidebar("chat"),
      color: "ui" 
    },
    { 
      icon: Users, 
      label: "People", 
      active: sidebar === "participants", 
      onClick: () => toggleSidebar("participants"),
      color: "ui" 
    },
  ];

  return (
    <div className="inline-flex items-center justify-center gap-2 sm:gap-2 relative px-4 py-2 rounded-2xl bg-black/95 border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {/* PRIMARY CONTROLS (Always Visible) */}
        {primaryButtons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            className={cn(
              "relative group w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300",
              btn.active && btn.color === "feature" && "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]",
              btn.active && btn.color !== "feature" && "bg-white text-black shadow-lg",
              !btn.active && "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95"
            )}
          >
            <btn.icon size={20} className={cn("transition-transform group-active:scale-90", btn.active ? "stroke-[2.5px]" : "stroke-[2px]")} />
          </button>
        ))}

        {/* SECONDARY CONTROLS (Desktop Only) */}
        {secondaryButtons.map((btn, idx) => (
           <button
             key={`sec-${idx}`}
             onClick={btn.onClick}
             className={cn(
               "hidden sm:flex relative group w-12 h-12 rounded-2xl items-center justify-center transition-all duration-300",
               btn.active ? "bg-white text-black shadow-lg" : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
             )}
           >
             <btn.icon size={20} className={cn("transition-transform group-active:scale-90", btn.active ? "stroke-[2.5px]" : "stroke-[2px]")} />
           </button>
        ))}

        {/* MORE MENU (Mobile Only) */}
        <div className="sm:hidden relative" ref={moreMenuRef}>
           <button
             onClick={() => setShowMoreMenu(!showMoreMenu)}
             className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                showMoreMenu ? "bg-white text-black" : "bg-white/5 text-neutral-400"
             )}
           >
              {showMoreMenu ? <X size={20} /> : <MoreVertical size={20} />}
           </button>

           {showMoreMenu && (
             <div className="absolute bottom-14 right-0 w-48 bg-[#1e1e24] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-200">
                <div className="flex flex-col gap-1">
                   {/* Chat */}
                   <button onClick={() => toggleSidebar("chat")} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 text-left text-sm text-neutral-200">
                      <MessageSquare size={18} className="text-indigo-400" />
                      <span>Chat</span>
                   </button>
                   {/* Participants */}
                   <button onClick={() => toggleSidebar("participants")} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 text-left text-sm text-neutral-200">
                      <Users size={18} className="text-emerald-400" />
                      <span>People</span>
                   </button>
                   <div className="h-[1px] bg-white/5 my-1" />
                   {/* Copy Link */}
                   <button onClick={() => { onCopyLink?.(); setShowMoreMenu(false); }} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 text-left text-sm text-neutral-200">
                      <Copy size={18} />
                      <span>Copy Link</span>
                   </button>
                   {/* Shortcuts */}
                   <button onClick={() => { onOpenShortcuts?.(); setShowMoreMenu(false); }} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 text-left text-sm text-neutral-200">
                      <Keyboard size={18} />
                      <span>Shortcuts</span>
                   </button>
                </div>
             </div>
           )}
        </div>

        <div className="w-[1px] h-6 sm:h-8 bg-white/20 mx-1 sm:mx-2" />

        <button
          onClick={onLeave}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 hover:border-red-500 transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-red-500/30"
        >
          <PhoneOff size={20} className="group-active:scale-90 transition-transform stroke-[2px]" />
        </button>
    </div>
  );
};