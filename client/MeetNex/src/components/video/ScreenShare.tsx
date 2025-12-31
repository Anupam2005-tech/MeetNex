import { useEffect, useRef } from "react";
import { useMedia } from "@/context/MeetingContext";

export default function ScreenShare() {
  const { screenStream } = useMedia();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (screenStream) {
      videoRef.current.srcObject = screenStream;
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.srcObject = null;
    }
  }, [screenStream]);

  if (!screenStream) return null;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-contain"
      />

      <span className="absolute top-2 left-2 text-xs bg-black/60 px-2 py-1 rounded">
        Screen sharing
      </span>
    </div>
  );
}
