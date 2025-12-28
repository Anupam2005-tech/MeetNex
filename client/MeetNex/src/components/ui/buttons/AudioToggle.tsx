
import { Mic, MicOff } from "lucide-react";

type AudioToggleProps = {
  isMuted: boolean;
  onToggle: () => void;
};

const AudioToggle: React.FC<AudioToggleProps> = ({ isMuted, onToggle }) => {
  return (
    <button
      aria-pressed={isMuted}
      onClick={onToggle}
      className={`
        w-14 h-14 rounded-full
        flex items-center justify-center
        border
        transition-all duration-200
        ${
          isMuted
            ? "bg-red-500/90 border-red-400 text-white hover:bg-red-500"
            : "border-white/30 text-white hover:bg-white/10"
        }
      `}
      title={isMuted ? "Unmute microphone" : "Mute microphone"}
    >
      {isMuted ? <MicOff size={30} /> : <Mic size={30} />}
    </button>
  );
};

export default AudioToggle;
