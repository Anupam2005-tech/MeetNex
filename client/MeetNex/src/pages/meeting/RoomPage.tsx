import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

import Controls from "@/components/video/Controls";
import LocalVideo from "@/components/video/LocalVideo";
import Participants from "@/pages/meeting/Participants";
import ChatPanel from "@/components/chat/ChatPanel";
import P2PMeetingPage from "./P2PMeetingPage";
import SFUMeetingPage from "./SFUMeetingPage"; 

import { userMedia } from "@/mediaControl/UseUserMedia";
import {
  toggleMic,
  toggleCamera,
  isMicEnabled,
  isCameraEnabled,
  stopAllMedia,
} from "@/mediaControl/useMediaControls";

import {
  getExternalDevices,
  onDeviceChanges,
  type MediaDeviceOption,
} from "@/mediaControl/useExternalCount";

function RoomPage() {
  const [searchParams] = useSearchParams();
  const { roomId } = useParams();
  const isP2P = searchParams.get('type') === 'p2p';
  const isSFU = searchParams.get('type') === 'sfu';
  const navigate = useNavigate();

  const meetingCode = roomId || "CONNECTING...";

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copied, setCopied] = useState(false);

  const [mics, setMics] = useState<MediaDeviceOption[]>([]);
  const [cameras, setCameras] = useState<MediaDeviceOption[]>([]);
  const [selectedMicId, setSelectedMicId] = useState<string | null>(null);
  const [selectedCamId, setSelectedCamId] = useState<string | null>(null);

  const userStreamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleMic = () => {
    if (!userStreamRef.current) return;
    const enabled = toggleMic(userStreamRef.current);
    setIsMuted(!enabled);
  };

  const handleToggleCamera = async () => {
    if (!userStreamRef.current) return;
    const enabled = await toggleCamera(userStreamRef.current);
    setIsCameraOff(!enabled);
  };

  const handleShareScreen = async () => {
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(stream);
      stream.getVideoTracks()[0].onended = () => setScreenStream(null);
    } catch (err) { console.error(err); }
  };

  const handleEndCall = () => {
    stopAllMedia(userStreamRef.current || undefined);
    if (screenStream) screenStream.getTracks().forEach(t => t.stop());
    navigate("/home");
  };

  useEffect(() => {
    const init = async () => {
      const stream = await userMedia();
      userStreamRef.current = stream;
      setIsMuted(!isMicEnabled(stream));
      setIsCameraOff(!isCameraEnabled(stream));
    };
    init();
    return () => stopAllMedia(userStreamRef.current || undefined);
  }, []);

  useEffect(() => {
    const loadDevices = async () => {
      const { mics, cameras } = await getExternalDevices();
      setMics(mics);
      setCameras(cameras);
      if (!selectedMicId && mics[0]) setSelectedMicId(mics[0].deviceId);
      if (!selectedCamId && cameras[0]) setSelectedCamId(cameras[0].deviceId);
    };
    loadDevices();
    return onDeviceChanges(loadDevices);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onMove = () => {
      setIsControlsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsControlsVisible(false), 4000);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className={`h-screen flex flex-col bg-[#050505] text-white ${!isControlsVisible ? "cursor-none" : ""}`}>
      <div className="relative flex-1 flex overflow-hidden">
        <Participants isOpen={showParticipants} onClose={() => setShowParticipants(false)} />

        <div className="flex-1 flex overflow-hidden justify-center items-center">
          {isP2P ? (
            <div className="w-full h-full max-w-7xl mx-auto p-4">
               <P2PMeetingPage />
            </div>
          ) : isSFU ? (
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full h-full p-4 lg:p-6 max-w-[1920px] mx-auto"
            >
               <SFUMeetingPage screenStream={screenStream} />
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white/20">
              <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center animate-pulse text-lg font-bold">...</div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-black">Connecting SFU Node</span>
            </div>
          )}
        </div>

        <ChatPanel isOpen={showChatPanel} onClose={() => setShowChatPanel(false)} />

        {/* Local Preview Pill */}
        <div className={`absolute right-10 transition-all duration-700 ${isControlsVisible ? 'bottom-28' : 'bottom-10'} h-44 w-72 rounded-[2rem] overflow-hidden border border-white/10 bg-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-40`}>
          <LocalVideo stream={userStreamRef.current} isMuted={isMuted} isCameraOff={isCameraOff} />
        </div>
      </div>

      <AnimatePresence>
        {isControlsVisible && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="h-24 bg-zinc-900/80 backdrop-blur-3xl border-t border-white/5 flex items-center justify-between px-12 z-[100]"
          >
            <div className="flex items-center gap-6 w-1/4">
              <span className="text-xl font-medium tabular-nums text-white/90">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <div className="h-4 w-[1px] bg-white/10" />
              <button onClick={copyToClipboard} className="flex items-center gap-2 text-xs font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">
                {meetingCode} {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>

            <Controls
              isMuted={isMuted} isCameraOff={isCameraOff} mics={mics} cameras={cameras}
              selectedMicId={selectedMicId} selectedCamId={selectedCamId}
              onSelectMic={setSelectedMicId} onSelectCamera={setSelectedCamId}
              onToggleMic={handleToggleMic} onToggleCamera={handleToggleCamera}
              onToggleParticipants={() => setShowParticipants(!showParticipants)}
              onToggleChat={() => setShowChatPanel(!showChatPanel)}
              onShareScreen={handleShareScreen} onLeave={handleEndCall}
            />
            <div className="w-1/4" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RoomPage;