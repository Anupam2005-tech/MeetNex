
import { Mic, MicOff, Video, VideoOff, Crown, X, UserPlus, Search, Hand } from "lucide-react";

// Utility for merging tailwind classes
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Participant = {
  id: string;
  name: string;
  micOn: boolean;
  camOn: boolean;
  isHost?: boolean;
  handRaised?: boolean;
};

const mockParticipants: Participant[] = [
  { id: "1", name: "Anupam", micOn: true, camOn: true, isHost: true },
  { id: "2", name: "Rahul", micOn: false, camOn: true, handRaised: true },
  { id: "3", name: "Neha", micOn: true, camOn: false },
  { id: "4", name: "Siddharth", micOn: false, camOn: false },
  { id: "5", name: "Priya", micOn: true, camOn: true },
];

interface ParticipantsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Participants: React.FC<ParticipantsProps> = ({ isOpen, onClose }) => {
  return (
    <aside
      className={cn(
        "fixed top-4 left-4 bottom-4 w-[340px] z-50",
        "bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]",
        "rounded-[32px] transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        "flex flex-col overflow-hidden",
        isOpen ? "translate-x-0 opacity-100" : "-translate-x-[120%] opacity-0"
      )}
    >
      {/* HEADER */}
      <div className="p-6 pb-4 shrink-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Participants
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {mockParticipants.length} Members Active
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-gray-100/50 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-all active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

      </div>

      {/* PARTICIPANTS LIST */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar
        [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
        
        {mockParticipants.map((user) => (
          <div
            key={user.id}
            className="group flex items-center justify-between rounded-2xl px-3 py-3 hover:bg-white transition-all duration-200 border border-transparent hover:border-gray-100 hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              {/* Avatar with Gradient */}
              <div className={cn(
                "relative w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-sm",
                user.isHost 
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600" 
                  : "bg-gradient-to-br from-gray-400 to-gray-500"
              )}>
                {user.name.charAt(0)}
                {/* Hand Raise Overlay */}
                {user.handRaised && (
                  <div className="absolute -top-1 -right-1 bg-amber-400 p-1 rounded-lg shadow-md animate-bounce">
                    <Hand size={10} fill="white" className="text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-gray-800 flex items-center gap-1.5">
                  {user.name}
                  {user.isHost && (
                    <Crown size={12} className="text-amber-500" fill="currentColor" />
                  )}
                </span>
                <span className="text-[11px] text-gray-400 font-medium">
                  {user.isHost ? "Host / Organizer" : "Member"}
                </span>
              </div>
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1">
              <div className={cn(
                "p-2 rounded-xl transition-all",
                user.micOn ? "text-gray-400 bg-gray-50" : "text-red-500 bg-red-50"
              )}>
                {user.micOn ? <Mic size={16} /> : <MicOff size={16} />}
              </div>
              <div className={cn(
                "p-2 rounded-xl transition-all",
                user.camOn ? "text-gray-400 bg-gray-50" : "text-red-500 bg-red-50"
              )}>
                {user.camOn ? <Video size={16} /> : <VideoOff size={16} />}
              </div>
            </div>
          </div>
        ))}
      </div>

     
    </aside>
  );
};

export default Participants;