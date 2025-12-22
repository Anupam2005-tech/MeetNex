import  { useEffect, useRef } from "react";
import { MicOff, Mic } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

interface LocalVideoProps {
  stream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
}

const LocalVideo = ({ stream, isMuted, isCameraOff }: LocalVideoProps) => {
  const {user}=useUser()
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (stream && !isCameraOff) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.srcObject = null;
    }
  }, [stream, isCameraOff]);

  return (
    <div className="relative w-full h-full bg-neutral-800 flex items-center justify-center overflow-hidden">
      {isCameraOff ? (
        <div className="w-full h-full bg-neutral-700 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-neutral-600 rounded-full flex items-center justify-center">
            <img src={user?.imageUrl} alt="user avatar" className="rounded-full w-full h-full"/>
          </div>
          <span className="mt-2 text-[10px] font-bold text-white/30 ">
            <p>{user?.fullName}</p>
          </span>
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

      <div className="absolute top-2 right-2">
        {isMuted ? (
          <div className="bg-red-500 p-1.5 rounded-full">
            <MicOff size={12} className="text-white" />
          </div>
        ) : (
          <div className="bg-blue-500 p-1.5 rounded-full">
            <Mic size={12} className="text-white" />
          </div>
        )}
      </div>

      <div className="absolute bottom-2 left-2 bg-black/40 px-2 py-0.5 rounded text-[10px] text-white">
        You
      </div>
    </div>
  );
};

export default LocalVideo;
