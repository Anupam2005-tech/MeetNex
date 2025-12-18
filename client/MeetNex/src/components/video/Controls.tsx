import React from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneIcon,
  Users,
  MonitorUp,
} from "lucide-react";
import MeetingTimer from "@/pages/meeting/MeetingTimer";

interface ControlsProps {
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleParticipants: () => void;
  onShareScreen: () => void;
  onLeave: () => void;
}
const Controls: React.FC<ControlsProps> = ({
  isMuted,
  isCameraOff,
  onToggleMic,
  onToggleCamera,
  onToggleParticipants,
  onShareScreen,
  onLeave,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">

      {/* TIMER – bottom left */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <MeetingTimer />
      </div>

      {/* CONTROLS – bottom center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto
        flex gap-3 bg-gray-900 bg-opacity-90 px-3 py-2 rounded-full shadow-2xl">

        {/* Mic */}
        <button
          onClick={onToggleMic}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isMuted ? "bg-red-600" : "bg-gray-700"
          }`}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* Camera */}
        <button
          onClick={onToggleCamera}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isCameraOff ? "bg-red-600" : "bg-gray-700"
          }`}
        >
          {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>

        {/* Screen Share */}
        <button
          onClick={onShareScreen}
          className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-700"
        >
          <MonitorUp size={20} />
        </button>

        {/* Participants */}
        <button
          onClick={onToggleParticipants}
          className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-700"
        >
          <Users size={20} />
        </button>

        {/* Leave */}
        <button
          onClick={onLeave}
          className="ml-2 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center"
        >
          <PhoneIcon size={20} className="rotate-[135deg]" />
        </button>
      </div>
    </div>
  );
};


export default Controls;
