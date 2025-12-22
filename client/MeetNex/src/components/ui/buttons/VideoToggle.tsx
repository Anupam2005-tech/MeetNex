import React, { useState } from "react";
import { FaVideo, FaVideoSlash } from "react-icons/fa";

interface VideoToggleProps {
  isCameraOff: boolean;
  onToggle: () => void;
}

const VideoToggle: React.FC<VideoToggleProps> = ({ isCameraOff, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg hover:bg-white/20 transition-colors"
      title={isCameraOff ? "Turn on camera" : "Turn off camera"}
    >
      {isCameraOff ? (
        <FaVideoSlash className="text-red-500 text-lg" />
      ) : (
        <FaVideo className="text-white text-lg" />
      )}
    </button>
  );
};

export default VideoToggle;
