import { Video, VideoOff } from "lucide-react";

interface VideoToggleProps {
  isCameraOff: boolean;
  onToggle: () => void;
}

const VideoToggle = ({ isCameraOff, onToggle }: VideoToggleProps) => (
  <button
    onClick={onToggle}
    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg hover:cursor-pointer active:scale-90 ${
      isCameraOff ? "bg-red-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-800 hover:cursor-pointer"
    }`}
  >
    {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
  </button>
);

export default VideoToggle;