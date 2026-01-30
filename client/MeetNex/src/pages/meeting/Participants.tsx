import { Mic, MicOff, Video, VideoOff, Crown, Hand } from "lucide-react";
import { useParticipants } from "@livekit/components-react";
import { Participant } from "livekit-client";

// Utility for merging tailwind classes
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Participants: React.FC = () => {
  const participants = useParticipants();


  const getMetadata = (p: Participant) => {
    try {
      return p.metadata ? JSON.parse(p.metadata) : {};
    } catch {
      return {};
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* STATUS BAR */}
      <div className="px-6 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {participants.length} Members Active
          </span>
        </div>
      </div>

      {/* PARTICIPANTS LIST */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 space-y-1 custom-scrollbar
        [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
        
        {participants.map((user) => {
            const metadata = getMetadata(user);
            const isHost = metadata.isHost === true;
            const isMicOn = user.isMicrophoneEnabled;
            const isCamOn = user.isCameraEnabled;
            const isHandRaised = false; 

            return (
          <div
            key={user.sid}
            className="group flex items-center justify-between rounded-lg sm:rounded-2xl px-2 py-2 sm:px-3 sm:py-3 hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10"
          >
            <div className="flex items-center gap-3">
              {/* Avatar with Gradient */}
              <div className={cn(
                "relative w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-sm overflow-hidden",
                isHost 
                  ? "bg-indigo-600" 
                  : "bg-gray-700"
              )}>
                {metadata.image ? (
                  <img src={metadata.image} alt={user.identity} className="w-full h-full object-cover" />
                ) : (
                  user.identity?.charAt(0).toUpperCase() || "?"
                )}
                {/* Hand Raise Overlay */}
                {isHandRaised && (
                  <div className="absolute -top-1 -right-1 bg-amber-400 p-1 rounded-lg shadow-md animate-bounce">
                    <Hand size={10} fill="white" className="text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-gray-800 flex items-center gap-1.5">
                  {user.name || user.identity || "Unknown"} {user.isLocal && "(You)"}
                  {isHost && (
                    <Crown size={12} className="text-amber-500" fill="currentColor" />
                  )}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {isHost ? "Host / Organizer" : "Member"}
                </span>
              </div>
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1">
              <div className={cn(
                "p-2 rounded-full transition-all",
                isMicOn ? "text-gray-400 bg-white/5" : "text-red-400 bg-red-500/10"
              )}>
                {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
              </div>
              <div className={cn(
                "p-2 rounded-full transition-all",
                isCamOn ? "text-gray-400 bg-white/5" : "text-red-400 bg-red-500/10"
              )}>
                {isCamOn ? <Video size={16} /> : <VideoOff size={16} />}
              </div>
            </div>
          </div>
            );
        })}
      </div>
    </div>
  );
};

export default Participants;