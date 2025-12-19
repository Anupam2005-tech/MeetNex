import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Copy, Info, Check, Share2, X } from "lucide-react";
import Loader from "@/components/ui/Loader";
import Controls from "@/components/video/Controls";
import LocalVideo from "@/components/video/LocalVideo";
import Participants from "@/pages/meeting/Participants";
import ScreenShare from "@/components/video/ScreenShare";
import ChatPanel from "@/components/chat/ChatPanel";
import Card from "@/components/ui/Card";

// Import the utility function
import { CallEnd } from "@/mediaControl/CallEnd";
import { userMedia } from "@/mediaControl/UseUserMedia";

function RoomPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // SHARED STATES
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [showLinkCard, setShowLinkCard] = useState(false);
  const [copied, setCopied] = useState(false);

  const userStreamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ─────────────── MEDIA HANDLERS ─────────────── */

  const handleToggleMic = () => {
    if (!userStreamRef.current) return;
    const audioTrack = userStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const handleToggleCamera = () => {
    if (!userStreamRef.current) return;
    const videoTrack = userStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOff(!videoTrack.enabled);
    }
  };

  const handleEndCall = () => {
    CallEnd(userStreamRef, screenStream);
    navigate('/home');
  };

  const handleShareScreen = async () => {
    try {
      // STOP screen share if already active
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
        return;
      }

      // START screen share
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      setScreenStream(stream);

      // Auto stop when user clicks "Stop sharing" from browser UI
      const screenTrack = stream.getVideoTracks()[0];
      screenTrack.onended = () => {
        setScreenStream(null);
      };

    } catch (err) {
      console.error("Screen share failed:", err);
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset icon after 2s
  };

  /* ─────────────── AUTO-HIDE & CLOCK ─────────────── */
  useEffect(() => {
    const handleMouseMove = () => {
      setIsControlsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (!showDetails && !showChatPanel && !showParticipants) {
        timeoutRef.current = setTimeout(() => setIsControlsVisible(false), 3000);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [showDetails, showChatPanel, showParticipants]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      }).toUpperCase());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* ─────────────── INITIALIZE & CLEANUP ─────────────── */
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await userMedia();
        userStreamRef.current = stream;
        setIsLoading(false);
      } catch (err) { console.error(err); }
    };
    initMedia();

    // IMPORTANT: Cleanup if user navigates away using browser buttons
    return () => {
      CallEnd(userStreamRef, screenStream);
    };
  }, []);

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-black"><Loader /></div>;

  return (
    <div className={`relative flex h-screen flex-col bg-[#111] text-white overflow-hidden transition-all ${!isControlsVisible ? 'cursor-none' : ''}`}>

      <div className="relative flex-1 p-4 flex overflow-hidden z-10">
        <Participants isOpen={showParticipants} onClose={() => setShowParticipants(false)} />

        <div className="flex-1 flex items-center justify-center">
          {screenStream ? (
            <ScreenShare stream={screenStream} />
          ) : (
            <div className="opacity-20 animate-pulse text-xs uppercase tracking-widest font-bold">
              Waiting for guests
            </div>
          )}
        </div>

        <ChatPanel isOpen={showChatPanel} onClose={() => setShowChatPanel(false)} />

        {/* LOCAL VIDEO */}
        <div className="absolute bottom-4 right-4 h-40 w-64 rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-30 bg-neutral-900">
          <LocalVideo
            stream={userStreamRef.current}
            isMuted={isMuted}
            isCameraOff={isCameraOff}
          />
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className={`w-full h-20 px-6 flex items-center justify-between bg-[#111] border-t border-white/5 z-30 transition-all duration-500 transform ${isControlsVisible ? 'translate-y-0' : 'translate-y-full'}`}>

        {/* Left Section: Clock and Meeting Link Trigger */}
        <div className="w-1/3 flex items-center gap-4 text-sm font-medium text-white/90">
          <div className="flex items-center gap-2 border-r border-white/10 pr-4">
            <Clock size={16} className="text-white/50" />
            {currentTime}
          </div>

          {/* Meeting Link Popup Container */}
          <div className="relative">
            <button
              onClick={() => setShowLinkCard(!showLinkCard)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${showLinkCard ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'}`}
            >
              <Share2 size={18} />
              <span className="text-xs">Meeting info</span>
            </button>

            {/* The Popup Card */}
            {showLinkCard && (
              <div className="absolute bottom-16 left-0 w-80 animate-in slide-in-from-bottom-2 duration-200">
                <Card className="p-5 bg-[#1c1c1c] border border-white/10 shadow-2xl rounded-2xl text-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Your meeting is ready</h3>
                    <button onClick={() => setShowLinkCard(false)} className="text-white/40 hover:text-white">
                      <X size={16} />
                    </button>
                  </div>

                  <p className="text-sm text-white/50 mb-3">Share this link with others you want in the meeting</p>

                  <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                    <span className="text-xs font-mono truncate mr-2 text-white/70">
                      {window.location.href}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className="shrink-0 p-2 hover:bg-white/5 rounded-lg transition-colors text-blue-400"
                    >
                      {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Center Section: Controls */}
        <div className="flex items-center justify-center">
          <Controls
            isMuted={isMuted}
            isCameraOff={isCameraOff}
            onToggleMic={handleToggleMic}
            onToggleCamera={handleToggleCamera}
            onToggleParticipants={() => setShowParticipants(!showParticipants)}
            onToggleChat={() => setShowChatPanel(!showChatPanel)}
            onLeave={handleEndCall}
            onShareScreen={handleShareScreen}
          />
        </div>
      </div>
    </div>
  );
}

export default RoomPage;