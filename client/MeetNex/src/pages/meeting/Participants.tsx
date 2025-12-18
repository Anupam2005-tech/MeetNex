import React from "react";
import { Mic, MicOff, Video, VideoOff, Crown } from "lucide-react";

type Participant = {
  id: string;
  name: string;
  micOn: boolean;
  camOn: boolean;
  isHost?: boolean;
};

const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "Anupam",
    micOn: true,
    camOn: true,
    isHost: true,
  },
  {
    id: "2",
    name: "Rahul",
    micOn: false,
    camOn: true,
  },
  {
    id: "3",
    name: "Neha",
    micOn: true,
    camOn: false,
  },
];

function Participants() {
  return (
    <div className="relative">
      
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-neutral-300">
        <span>Participants</span>
        <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs">
          {mockParticipants.length}
        </span>
      </div>

      {/* Panel */}
      <div className="absolute right-0 mt-2 w-64 rounded-xl border border-neutral-800 bg-neutral-900 shadow-xl">
        
        <div className="max-h-64 overflow-y-auto p-3 space-y-3">
          {mockParticipants.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-neutral-800"
            >
              {/* Name */}
              <div className="flex items-center gap-2">
                <span className="truncate text-sm">{user.name}</span>
                {user.isHost && (
                  <Crown size={14} className="text-yellow-400" />
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 text-neutral-400">
                {user.micOn ? (
                  <Mic size={14} />
                ) : (
                  <MicOff size={14} className="text-red-400" />
                )}
                {user.camOn ? (
                  <Video size={14} />
                ) : (
                  <VideoOff size={14} className="text-red-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Participants;
