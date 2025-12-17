import { useEffect, useRef, useState } from "react";
import { userMedia } from "@/mediaControl/UseUserMedia";
import AudioToggle from "../ui/buttons/AudioToggle";
import VideoToggle from "../ui/buttons/VideoToggle";

export default function LocalVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const getMediaDevices = async () => {
      try {
        const mediaStream = await userMedia();
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    getMediaDevices();

    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, []);

  const handleMouseActivity = () => {
    setShowControls(true);

    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }

    hideTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 2500);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseMove={handleMouseActivity}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover rounded-xl"
      />

      {/* Controls Overlay */}
      <div
        className={`
          absolute bottom-4 left-1/2 -translate-x-1/2
          transition-all duration-300 ease-in-out
          ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onMouseEnter={() => {
          if (hideTimer.current) clearTimeout(hideTimer.current);
        }}
        onMouseLeave={handleMouseActivity}
      >
        <div className="flex items-center gap-10 px-6 py-3 rounded-full backdrop-blur-md">
          <AudioToggle />
          <VideoToggle />
        </div>
      </div>
    </div>
  );
}
