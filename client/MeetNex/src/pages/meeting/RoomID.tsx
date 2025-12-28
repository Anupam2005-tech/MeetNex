import { useState } from 'react';
import { IconCopy, IconCheck, IconHash, IconShieldLock } from '@tabler/icons-react';

function RoomID() {
  // Dummy data representing what you'll eventually get from your server
  const [roomCode] = useState("MNX-7742-X91");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-sm bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <IconShieldLock size={18} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Secure Session
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
        <div className="relative flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4 transition-all">
          <div className="flex items-center gap-3">
            <IconHash size={20} className="text-gray-400" />
            <span className="font-mono text-lg font-bold tracking-tighter text-slate-800">
              {roomCode}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-indigo-600 transition-all active:scale-90"
            title="Copy Room ID"
          >
            {copied ? <IconCheck size={20} className="text-emerald-500" /> : <IconCopy size={20} />}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[10px] text-gray-400 font-medium">
          Share this code with your team to initiate peer-sync.
        </p>
      </div>
    </div>
  );
}

export default RoomID;