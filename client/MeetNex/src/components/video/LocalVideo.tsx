import React, { useEffect, useRef } from "react";
import { MicOff, Mic, User } from "lucide-react"; // Added Mic icon

interface LocalVideoProps {
  stream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
}

const LocalVideo = ({ stream, isMuted, isCameraOff }: LocalVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream && !isCameraOff) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isCameraOff]);

  return (
    <div className="relative w-full h-full bg-neutral-800 flex items-center justify-center overflow-hidden transition-all duration-300">
      {isCameraOff ? (
        <div className="w-full h-full bg-neutral-700 flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="w-16 h-16 bg-neutral-600 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
            <User size={32} className="text-white/40" />
          </div>
          <span className="mt-2 text-[10px] font-bold text-white/30 uppercase tracking-tighter">Camera Off</span>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted 
          className="w-full h-full object-cover scale-x-[-1]" 
        />
      )}

      {/* MIC STATUS INDICATORS */}
      <div className="absolute top-2 right-2 flex gap-2">
        {isMuted ? (
          /* RED Muted Icon */
          <div className="bg-red-500/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg border border-red-400/50 animate-in zoom-in-50 duration-200">
            <MicOff size={12} className="text-white" />
          </div>
        ) : (
          /* BLUE Active Mic Indicator (Google Meet Style) */
          <div className="bg-blue-500/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg border border-blue-400/50 animate-in zoom-in-50 duration-200">
            <Mic size={12} className="text-white" />
          </div>
        )}
      </div>
      
      <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-white/80 border border-white/5">
        You
      </div>
    </div>
  );
};

export default LocalVideo;