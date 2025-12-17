import { Mic, MicOff } from "lucide-react";
import { useState } from "react";
import { muteMic, unmuteMic } from "@/mediaControl/useMediaControls";



export default function AudioToggle() {
    const [muted, setMuted] = useState(false);

      const handleToggle = () => {
    if (muted) {
      unmuteMic(); 
    } else {
      muteMic(); 
    }

    setMuted(!muted);
  };
    return (
        <button
            onClick={() => handleToggle}
            className="
        w-14 h-14 hover:cursor-pointer rounded-full
        flex items-center justify-center
        border border-white/30
        text-white
        hover:bg-white/10
        transition-all duration-200
        
      "
            title={muted ? "Unmute" : "Mute"}
        >
            {muted ? <MicOff size={30} /> : <Mic size={30} />}
        </button>
    );
}
