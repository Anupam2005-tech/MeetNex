import { useState } from 'react';
import { IconCopy, IconCheck, IconFingerprint } from '@tabler/icons-react';

interface RoomIDProps {
  roomId?: string;
}

function RoomID({ roomId }: RoomIDProps) {
  const [copied, setCopied] = useState(false);
  const displayId = roomId || "Loading...";

  const handleCopy = () => {
    if (!roomId) return;
    const fullUrl = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex justify-center">
      <button
        onClick={handleCopy}
        disabled={!roomId}
        className="
          group relative flex items-center justify-between 
          w-full max-w-[260px] h-10 pl-3 pr-2 
          bg-white hover:bg-zinc-50 
          border border-zinc-200 hover:border-zinc-300 
          rounded-full shadow-[0px_1px_2px_rgba(0,0,0,0.04)] 
          transition-all duration-200 ease-out 
          active:scale-[0.97]
        "
      >
        {/* Left Side: Icon + ID */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Static Icon with subtle pulse */}
          <div className="flex-shrink-0 text-zinc-400 group-hover:text-zinc-600 transition-colors">
            <IconFingerprint size={18} stroke={2} />
          </div>
          
          <div className="flex flex-col min-w-0">
            {/* The ID */}
            <span className={`font-mono text-sm font-semibold tracking-tight text-zinc-700 truncate ${!roomId && 'animate-pulse opacity-50'}`}>
              {displayId}
            </span>
          </div>
        </div>

        {/* Right Side: Divider + Action */}
        <div className="flex items-center gap-2 pl-2">
          {/* Vertical Divider */}
          <div className="w-px h-4 bg-zinc-200 group-hover:bg-zinc-300 transition-colors"></div>
          
          {/* Animated Icon Container */}
          <div className="relative flex items-center justify-center w-6 h-6">
            <div
              className={`absolute transition-all duration-300 transform ${
                copied ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 -rotate-45'
              }`}
            >
              <IconCheck size={16} className="text-emerald-600" stroke={3} />
            </div>
            <div
              className={`absolute transition-all duration-300 transform ${
                copied ? 'scale-50 opacity-0 rotate-45' : 'scale-100 opacity-100 rotate-0'
              }`}
            >
              <IconCopy size={16} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" stroke={2} />
            </div>
          </div>
        </div>

        {/* Tooltip (Only appears on hover) */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 text-zinc-50 text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl">
          {copied ? 'Copied to clipboard' : 'Click to copy link'}
          {/* Tooltip Arrow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-zinc-900"></div>
        </div>
      </button>
    </div>
  );
}

export default RoomID;