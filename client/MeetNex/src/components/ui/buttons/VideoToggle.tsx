import { useState } from "react";
import { Video, VideoOff } from "lucide-react";

function VideoToggle() {
  const [isCameraOff, setIsCameraOff] = useState(false);

  return (
    <button
      onClick={() => setIsCameraOff(!isCameraOff)}
      title={isCameraOff ? "Turn camera on" : "Turn camera off"}
      className={`
      w-14 h-14 hover:cursor-pointer rounded-full
        flex items-center justify-center
        border border-white/30
        text-white
        hover:bg-white/10
        transition-all duration-200
        
      `}
    >
      {isCameraOff ? <VideoOff size={30} /> : <Video size={30} />}
    </button>
  );
}

export default VideoToggle;
