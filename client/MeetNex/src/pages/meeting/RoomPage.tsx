import React, { useEffect, useRef, useState } from "react";
import Loader from "@/components/ui/Loader";
import Controls from "@/components/video/Controls";
import LocalVideo from "@/components/video/LocalVideo";
import MeetingTimer from "@/pages/meeting/MeetingTimer";
import Participants from "@/pages/meeting/Participants";
import ScreenShare from "@/components/video/ScreenShare";
import { userMedia } from "@/mediaControl/UseUserMedia";
import { toggleMic, toggleVideo } from "@/mediaControl/useMediaControls";

function RoomPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const userStreamRef = useRef<MediaStream | null>(null);

  /* ─────────────── GET USER MEDIA ─────────────── */
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await userMedia();
        userStreamRef.current = stream;
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    initMedia();

    return () => {
      userStreamRef.current?.getTracks().forEach(t => t.stop());
      screenStream?.getTracks().forEach(t => t.stop());
    };
  }, [screenStream]);

  /* ─────────────── CONTROLS HANDLERS ─────────────── */

  const handleToggleMic = () => {
    if (!userStreamRef.current) return;
    const enabled = toggleMic(userStreamRef.current);
    setIsMuted(!enabled);
  };

  const handleToggleCamera = () => {
    if (!userStreamRef.current) return;
    const enabled = toggleVideo(userStreamRef.current);
    setIsCameraOff(!enabled);
  };
const handleScreenShare = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    setScreenStream(stream);

    stream.getVideoTracks()[0].onended = () => {
      setScreenStream(null);
    };
  } catch (err) {
    console.error("Screen share failed", err);
  }
};


  const handleLeave = () => {
    userStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStream?.getTracks().forEach(t => t.stop());
    window.location.href = "/home";
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-col bg-neutral-900 text-white">
      {/* ─────────────── VIDEO AREA ─────────────── */}
      <div className="relative flex-1 overflow-hidden p-4 flex">

        {/* MAIN VIDEO GRID */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {screenStream && <ScreenShare stream={screenStream} />}
          {/* Remote users later */}
        </div>

        {/* PARTICIPANTS PANEL */}
        {showParticipants && (
          <div >
            <Participants />
          </div>
        )}

        {/* LOCAL VIDEO FLOAT */}
        <div className="absolute bottom-6 right-6 h-40 w-64 rounded-xl overflow-hidden border border-neutral-700 shadow-lg">
          <LocalVideo stream={userStreamRef.current!} />
        </div>
      </div>

      {/* ─────────────── CONTROLS ─────────────── */}
      <Controls
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        onToggleMic={handleToggleMic}
        onToggleCamera={handleToggleCamera}
        onToggleParticipants={() =>
          setShowParticipants(prev => !prev)
        }
        onShareScreen={handleScreenShare}
        onLeave={handleLeave}
      />
    </div>
  );
}

export default RoomPage;
