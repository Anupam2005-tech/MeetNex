import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Keyboard, HelpCircle } from "lucide-react"; 
import { useRoomShortcuts } from "@/context/useRoomShortcuts";
import Controls from "@/components/video/Controls";
import LocalVideo from "@/components/video/LocalVideo";
import Loader from "@/components/ui/Loader";
import { useSocket } from "@/context/SocketContext";
const Participants = lazy(() => import("@/pages/meeting/Participants"));
const ChatPanel = lazy(() => import("@/components/chat/ChatPanel"));
const P2PMeetingPage = lazy(() => import("./P2PMeetingPage"));
const SFUMeetingPage = lazy(() => import("./SFUMeetingPage"));

import { useMedia } from "@/context/MeetingContext";

function RoomPage() {
  const [searchParams] = useSearchParams();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { joinRoom, isConnected } = useSocket();
  const isP2P = searchParams.get("type") === "p2p";
  const isSFU = searchParams.get("type") === "sfu";
  useRoomShortcuts()

  const meetingCode = roomId || "CONNECTING...";
  const [joinError, setJoinError] = useState<string | null>(null);

  const {
    stream,
    screenStream,
    startStream, 
  } = useMedia();

  // Join room via socket when component mounts and socket is ready
  useEffect(() => {
    const joinRoomSocket = async () => {
      if (isConnected && roomId) {
        try {
          await joinRoom(roomId);
          console.log(`Successfully joined room: ${roomId}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to join room';
          setJoinError(errorMessage);
          console.error('Failed to join room:', error);
          // Navigate back to join page after 3 seconds
          setTimeout(() => {
            navigate('/home', { replace: true });
          }, 3000);
        }
      }
    };

    joinRoomSocket();
  }, [isConnected, roomId, joinRoom, navigate]);

  useEffect(() => {
    if (!stream) {
      startStream();
    }
  }, [stream, startStream]);

  const [showParticipants, setShowParticipants] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copied, setCopied] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false); // State for shortcut legend

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = () => {
    const fullUrl = `${window.location.origin}/room/${roomId}${window.location.search}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    <div
      className={`h-screen flex flex-col bg-[#050505] text-white transition-colors duration-500 ${!isControlsVisible ? "cursor-none" : ""
        }`}
    >
      {/* Error Banner */}
      {joinError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/50 p-3 text-center text-sm font-semibold"
        >
          {joinError} - Redirecting...
        </motion.div>
      )}

      <div className="relative flex-1 flex overflow-hidden">
        <Suspense fallback={null}>
          <Participants
            isOpen={showParticipants}
            onClose={() => setShowParticipants(false)}
          />
        </Suspense>
        <Suspense fallback={null}>
          <ChatPanel
            isOpen={showChatPanel}
            onClose={() => setShowChatPanel(false)}
          />
        </Suspense>


        <AnimatePresence>
          {showShortcuts && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-28 left-10 w-64 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 z-50 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-white/5 rounded-xl text-white/40">
                  <Keyboard size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Keybinds</span>
              </div>
              <div className="space-y-4">
                {[
                  { key: "m", action: "Toggle Audio" },
                  { key: "v", action: "Toggle Video" },
                  { key: "s", action: "Screen Share" },
                  { key: "e", action: "Leave Room" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-400">{item.action}</span>
                    <kbd className="px-2 py-1 bg-white/10 border border-white/5 rounded-md text-[10px] font-mono font-bold text-white/80 min-w-[24px] text-center">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex overflow-hidden justify-center items-center">
          {isP2P ? (
            <div className="w-full h-full p-4 lg:p-6 max-w-[1920px] mx-auto">
              <Suspense fallback={<Loader />}>
                <P2PMeetingPage remoteScreenStream={screenStream} />
              </Suspense>
            </div>
          ) : isSFU ? (
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full h-full p-4 lg:p-6 max-w-[1920px] mx-auto"
            >
              <Suspense fallback={<Loader />}>
                <SFUMeetingPage screenStream={screenStream} />
              </Suspense>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white/20">
              <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center animate-pulse text-lg font-bold uppercase tracking-widest">
                P2P
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-black">
                Connecting Secure Node
              </span>
            </div>
          )}
        </div>

        <div
          className={`absolute right-10 transition-all duration-700 ${isControlsVisible ? "bottom-24" : "bottom-10"
            } h-44 w-72 rounded-[2rem] overflow-hidden border border-white/10 bg-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-40`}
        >
          <LocalVideo />
        </div>
      </div>

      <AnimatePresence>
        {isControlsVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="h-20 bg-zinc-900/40 backdrop-blur-3xl border-t border-white/5 flex items-center justify-between px-10 z-30"
          >
            <div className="flex items-center gap-6 w-1/3">
              <div className="flex flex-col">
                <span className="text-lg font-bold tabular-nums text-white/90 leading-none">
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">
                    Live Room
                  </span>
                </div>
              </div>

              <div className="h-8 w-[1px] bg-white/10" />

              <div className="flex items-center bg-zinc-800/40 border border-white/10 rounded-xl p-1 overflow-hidden">
                <div className="px-3 flex flex-col">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter">
                    Room ID
                  </span>
                  <span className="text-[11px] font-mono text-zinc-300 font-bold">
                    {meetingCode.slice(0, 8)}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${copied
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                    }`}
                >
                  {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} />}
                </motion.button>
              </div>

              {/* HELP / SHORTCUT ICON */}
              <motion.button
                whileHover={{ scale: 1, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowShortcuts(!showShortcuts)}
                className={`p-3 rounded-xl border border-white/5 transition-colors ${showShortcuts ? "bg-white/10 text-white" : "text-zinc-500"}`}
              >
                <HelpCircle size={18} strokeWidth={2.5} />
              </motion.button>
            </div>

            <div className="flex justify-center flex-1">
              <Controls
                showParticipants={showParticipants}
                showChat={showChatPanel}
                onToggleParticipants={() => {
                  setShowParticipants((prev) => !prev);
                  if (!showParticipants) setShowChatPanel(false);
                }}
                onToggleChat={() => {
                  setShowChatPanel((prev) => !prev);
                  if (!showChatPanel) setShowParticipants(false);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RoomPage;