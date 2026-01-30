import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const MeetingHeader = ({ roomName }: { roomName: string, roomId: string }) => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-16 sm:h-20 flex items-center justify-between px-3 sm:px-6 z-50 pointer-events-none">
      {/* LEFT: BACK & INFO */}
      <div className="flex items-center gap-2 sm:gap-4 pointer-events-auto">
        <button 
           onClick={() => navigate('/home')}
           className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group"
        >
           <ArrowLeft size={20} className="text-white/70 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
        </button>

        <div className="flex flex-col">
           <h1 className="text-sm sm:text-base font-bold text-white shadow-black/20 drop-shadow-md">
             {roomName || "Meeting Room"}
           </h1>
           <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-medium text-white/50 uppercase tracking-wider">Live</span>
           </div>
        </div>
      </div>

      {/* RIGHT: TIME */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full border border-white/5 pointer-events-auto">
         <Clock size={14} className="text-white/50" />
         <span className="text-xs font-medium text-white/80 font-mono">{time}</span>
      </div>
    </div>
  );
};

export default MeetingHeader;
