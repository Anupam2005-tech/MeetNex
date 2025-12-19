import { useEffect, useRef } from "react";

interface ScreenShareProps {
  stream: MediaStream;
}

export default function ScreenShare({ stream }: ScreenShareProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

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
