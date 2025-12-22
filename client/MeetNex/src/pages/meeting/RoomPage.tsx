import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import Controls from "@/components/video/Controls";
import LocalVideo from "@/components/video/LocalVideo";
import Participants from "@/pages/meeting/Participants";
import ScreenShare from "@/components/video/ScreenShare";
import ChatPanel from "@/components/chat/ChatPanel";

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
  const navigate = useNavigate();
  const meetingCode = "ABC-DEFG-HIJ";

  /* ================= STATE ================= */

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const [showParticipants, setShowParticipants] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);

  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isControlsVisible, setIsControlsVisible] = useState(true);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [copied, setCopied] = useState(false);

  /* ================= DEVICES ================= */

  const [mics, setMics] = useState<MediaDeviceOption[]>([]);
  const [cameras, setCameras] = useState<MediaDeviceOption[]>([]);
  const [selectedMicId, setSelectedMicId] = useState<string | null>(null);
  const [selectedCamId, setSelectedCamId] = useState<string | null>(null);

  /* ================= REFS ================= */

  const userStreamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ================= HELPERS ================= */

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ================= MEDIA CONTROLS ================= */

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
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
      return;
    }

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    setScreenStream(stream);
    stream.getVideoTracks()[0].onended = () => setScreenStream(null);
  };

  const handleEndCall = () => {
    stopAllMedia(userStreamRef.current || undefined);
    if (screenStream) screenStream.getTracks().forEach(t => t.stop());
    navigate("/home");
  };

  /* ================= INIT MEDIA ================= */

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

  /* ================= DEVICE ENUMERATION ================= */

  useEffect(() => {
    const loadDevices = async () => {
      const { mics, cameras } = await getExternalDevices();
      setMics(mics);
      setCameras(cameras);

      if (!selectedMicId && mics[0]) setSelectedMicId(mics[0].deviceId);
      if (!selectedCamId && cameras[0]) setSelectedCamId(cameras[0].deviceId);
    };

    loadDevices();
    const cleanup = onDeviceChanges(loadDevices);
    return cleanup;
  }, []);

  /* ================= CLOCK ================= */

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ================= AUTO HIDE CONTROLS ================= */

  useEffect(() => {
    const onMove = () => {
      setIsControlsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsControlsVisible(false), 4000);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ================= UI ================= */

  return (
    <div
      className={`h-screen flex flex-col bg-[#0a0a0a] text-white ${
        !isControlsVisible ? "cursor-none" : ""
      }`}
    >
      {/* MAIN AREA */}
      <div className="relative flex-1 flex overflow-hidden">
        <Participants
          isOpen={showParticipants}
          onClose={() => setShowParticipants(false)}
        />

        {/* CENTER STAGE */}
        <div className="flex-1 flex items-center justify-center p-4">
          {screenStream ? (
            <ScreenShare stream={screenStream} />
          ) : (
            <div className="flex flex-col items-center gap-4 text-white/20">
              <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center animate-pulse">
                ?
              </div>
              <span className="text-xs uppercase tracking-widest">
                Waiting for others
              </span>
            </div>
          )}
        </div>

        <ChatPanel
          isOpen={showChatPanel}
          onClose={() => setShowChatPanel(false)}
        />

        {/* LOCAL VIDEO */}
        <div
          className={`absolute right-4 transition-all duration-500 ${
            isControlsVisible ? "bottom-4" : "bottom-4"
          } h-40 w-64 rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl`}
        >
          <LocalVideo
            stream={userStreamRef.current}
            isMuted={isMuted}
            isCameraOff={isCameraOff}
          />
        </div>
      </div>

      {/* BOTTOM BAR */}
      <AnimatePresence>
        {isControlsVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="h-20 bg-gray-900 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-8"
          >
            {/* LEFT */}
            <div className="flex items-center gap-6 w-1/4">
              <span className="text-lg tabular-nums">
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>

              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
              >
                {meetingCode}
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* CONTROLS */}
            <Controls
              isMuted={isMuted}
              isCameraOff={isCameraOff}
              mics={mics}
              cameras={cameras}
              selectedMicId={selectedMicId}
              selectedCamId={selectedCamId}
              onSelectMic={setSelectedMicId}
              onSelectCamera={setSelectedCamId}
              onToggleMic={handleToggleMic}
              onToggleCamera={handleToggleCamera}
              onToggleParticipants={() =>
                setShowParticipants(!showParticipants)
              }
              onToggleChat={() => setShowChatPanel(!showChatPanel)}
              onShareScreen={handleShareScreen}
              onLeave={handleEndCall}
            />

            <div className="w-1/4" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RoomPage;
