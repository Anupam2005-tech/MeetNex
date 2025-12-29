import { Mic, MicOff } from "lucide-react";

interface AudioToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

const AudioToggle = ({ isMuted, onToggle }: AudioToggleProps) => (
  <button
    onClick={onToggle}
    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-90 ${
      isMuted ? "bg-red-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-800"
    }`}
  >
    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
  </button>
);

export default AudioToggle;