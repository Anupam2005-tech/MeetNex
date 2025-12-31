import { useEffect, useRef } from "react";
import { MicOff, Mic } from "lucide-react";
import { useUser } from "@clerk/clerk-react"; // Assuming Clerk is used
import { useMedia } from "@/context/MeetingContext";

const LocalVideo = () => {
  const { stream, isMuted, isCamOff } = useMedia();
  const { user } = useUser();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (stream && !isCamOff) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => console.log("Video play error:", err));
    } else {
      videoRef.current.srcObject = null;
    }
  }, [stream, isCamOff]);

  return (
    <div className="relative w-full h-full bg-neutral-800 flex items-center justify-center overflow-hidden">
      {isCamOff ? (
        <div className="w-full h-full bg-neutral-700 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-neutral-600 rounded-full flex items-center justify-center overflow-hidden">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="user avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-xl font-bold text-white">
                {user?.firstName?.[0] || "U"}
              </div>
            )}
          </div>
          <span className="mt-2 text-[10px] font-bold text-white/30">
            {user?.fullName || "You"}
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

      {/* Mic Status Indicator */}
      <div className="absolute top-2 right-2">
        {isMuted ? (
          <div className="bg-red-500 p-1.5 rounded-full shadow-lg">
            <MicOff size={12} className="text-white" />
          </div>
        ) : (
          <div className="bg-blue-500/80 backdrop-blur p-1.5 rounded-full shadow-lg">
            <Mic size={12} className="text-white" />
          </div>
        )}
      </div>

      <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur px-2 py-0.5 rounded text-[10px] text-white">
        You
      </div>
    </div>
  );
};

export default LocalVideo;