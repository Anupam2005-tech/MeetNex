import { useEffect, useRef, useState } from "react";
import Button from "../../components/ui/buttons/Button";
import { FaVideo } from "react-icons/fa";
import Dropdown from "../../components/ui/Dropdown";
import LocalVideo from "@/components/video/LocalVideo";
import AudioToggle from "@/components/ui/buttons/AudioToggle";
import VideoToggle from "@/components/ui/buttons/VideoToggle";

const JoinMeetingPage = () => {
  const streamRef = useRef<MediaStream | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  /* ─────────────── INIT CAMERA PREVIEW ─────────────── */
  useEffect(() => {
    const initPreview = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = mediaStream;
        setStream(mediaStream);
      } catch (err) {
        console.error("Camera preview failed:", err);
        setIsCameraOff(true);
      }
    };

    initPreview();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  /* ─────────────── TOGGLES ─────────────── */
  const toggleMic = () => {
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setIsMuted(!audioTrack.enabled);
  };

  const toggleCamera = () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    setIsCameraOff(!videoTrack.enabled);
  };

  return (
    <div className="min-h-screen bg-gray-50 grid lg:grid-cols-12">

      {/* VIDEO PREVIEW */}
      <div className="lg:col-span-7 flex flex-col justify-start lg:justify-center items-center p-4 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-300">
        <div className="w-full max-w-xl md:max-w-4xl">

          <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex justify-center items-center shadow-lg">
            <LocalVideo
              stream={stream}
              isMuted={isMuted}
              isCameraOff={isCameraOff}
            />

            {/* AUDIO / VIDEO CONTROLS (OVERLAY) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <AudioToggle isMuted={isMuted} onToggle={toggleMic} />
              <VideoToggle isCameraOff={isCameraOff} onToggle={toggleCamera} />
            </div>
          </div>

          <div className="mt-4">
            <Dropdown />
          </div>
        </div>
      </div>

      {/* JOIN SECTION */}
      <div className="lg:col-span-4 flex flex-col justify-center items-center p-6 sm:p-8">
        <div className="flex flex-col items-center gap-8 text-center w-full max-w-xs">
          <h1 className="font-semibold text-2xl sm:text-3xl lg:text-4xl text-gray-800">
            Ready to join?
          </h1>

          <Button text="Join" icon={FaVideo} />
        </div>
      </div>
    </div>
  );
};

export default JoinMeetingPage;
