import React, { useState } from "react";
import { Mic, MicOff, Video, VideoOff,PhoneIcon, Users, MonitorUp } from "lucide-react";

const Controls = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 bg-gray-900 bg-opacity-90 px-3 py-2 rounded-full shadow-2xl ">
      {/* Mute / Unmute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className={`w-12 h-12 rounded-full transition flex items-center justify-center hover:cursor-pointer ${
          isMuted ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-700 text-white hover:bg-gray-600 hover:cursor-pointer"
        }`}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </button>


      {/* Video On / Off Button */}
      <button
        onClick={() => setIsCameraOff(!isCameraOff)}
        className={`hover:cursor-pointer w-12 h-12 rounded-full transition flex items-center justify-center ${
          isCameraOff ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-700 text-white hover:bg-gray-600 hover:cursor-pointer"
        }`}
        title={isCameraOff ? "Turn camera on" : "Turn camera off"}
      >
        {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
      </button>

      {/* Screen Share */}
      <button
        className="w-12 h-12 rounded-full bg-transparent text-white hover:bg-gray-700 transition flex items-center justify-center hover:cursor-pointer"
        title="Share screen"
      >
        <MonitorUp size={20} />
      </button>

      {/* Participants */}
      <button
        className="w-12 h-12 rounded-full bg-transparent text-white hover:bg-gray-700 transition flex items-center justify-center hover:cursor-pointer"
        title="Participants"
      >
        <Users size={20} />
      </button>
      {/* End Call Button */}
      <button
        onClick={() => alert("Call ended")}
        className="w-12 h-12 rounded-full bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center ml-2 hover:cursor-pointer"
        title="End call"
      >
        <PhoneIcon size={20} className="rotate-[135deg]" />
      </button>
    </div>
  );
};

export default Controls;