import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MicOff, Maximize2, Minimize2 } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isCameraOff: boolean;
}

const SFUMeetingPage = ({ screenStream }: { screenStream?: MediaStream | null }) => {
  const [maximizedId, setMaximizedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasShownHint, setHasShownHint] = useState(false);
  const itemsPerPage = 4;
  
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const [participants] = useState<Participant[]>([
    { id: '1', name: 'You (Host)', isMuted: false, isCameraOff: false },
    { id: '2', name: 'Sarah Jenkins', isMuted: true, isCameraOff: false },
    { id: '3', name: 'Tech Support', isMuted: false, isCameraOff: true },
    { id: '4', name: 'Michael Chen', isMuted: false, isCameraOff: false },
    { id: '5', name: 'Elena Rodriguez', isMuted: true, isCameraOff: false },
    { id: '6', name: 'David Smith', isMuted: false, isCameraOff: true },
  ]);

  const isSharing = !!screenStream;
  const totalPages = Math.ceil(participants.length / itemsPerPage);

  const videoRefCallback = useCallback((node: HTMLVideoElement | null) => {
    if (node && screenStream) {
      node.srcObject = screenStream;
    }
  }, [screenStream]);

  useEffect(() => {
    if (participants.length > itemsPerPage && !hasShownHint && !isSharing) {
      setHasShownHint(true);
    }
  }, [participants.length, isSharing, hasShownHint]);

  // Disable swipe if maximized
  const onPointerDown = (e: React.PointerEvent) => {
    if (maximizedId) return; 
    touchEnd.current = null;
    touchStart.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (maximizedId) return;
    touchEnd.current = e.clientX;
  };

  const onPointerUp = () => {
    if (maximizedId || !touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    if (distance > 50 && currentPage < totalPages - 1) setCurrentPage(curr => curr + 1);
    else if (distance < -50 && currentPage > 0) setCurrentPage(curr => curr - 1);
  };

  /**
   * FIX: Data Filtering Logic
   * If maximized, we only show the one person.
   * If sharing, we show all people in a sidebar list.
   * Otherwise, we show the paginated slice.
   */
  const currentParticipants = maximizedId 
    ? participants.filter(p => p.id === maximizedId)
    : isSharing 
      ? participants 
      : participants.slice(currentPage * itemsPerPage, (currentPage * itemsPerPage) + itemsPerPage);

  const getGridLayout = () => {
    if (isSharing) return 'flex flex-col w-[380px] overflow-y-auto custom-scrollbar p-4 gap-4';
    if (maximizedId) return 'grid grid-cols-1 grid-rows-1 w-full h-full p-4';
    
    const count = currentParticipants.length;
    if (count === 1) return 'grid grid-cols-1 grid-rows-1 w-full h-full p-4 gap-4';
    if (count <= 3) return 'grid grid-cols-2 grid-rows-1 w-full h-full p-4 gap-4';
    return 'grid grid-cols-2 grid-rows-2 w-full h-full p-4 gap-4';
  };

  const getParticipantStyle = (index: number) => {
    if (isSharing || maximizedId) return {};
    if (currentParticipants.length === 3 && index === 0) return { gridRow: "span 2 / span 2" };
    return {};
  };

  return (
    <div 
      className="relative flex w-full h-full overflow-hidden bg-[#050505] touch-none font-sans"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      
      {/* 1. PRESENTATION STAGE */}
      <AnimatePresence>
        {isSharing && (
          <motion.div 
            initial={{ flex: 0, opacity: 0, x: -20 }}
            animate={{ flex: 1.5, opacity: 1, x: 0 }}
            exit={{ flex: 0, opacity: 0, x: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="relative h-full bg-black flex items-center justify-center p-4 pr-0"
          >
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
               <video ref={videoRefCallback} autoPlay playsInline muted className="w-full h-full object-contain" />
               <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md">
                 <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest">Screen Share</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN GRID CONTAINER */}
      <div className="relative flex-1 flex flex-row h-full overflow-hidden">
        <motion.div 
          layout
          animate={hasShownHint && currentPage === 0 && !maximizedId ? { x: [0, -30, 0] } : { x: 0 }}
          className={`flex-1 transition-all duration-500 select-none ${getGridLayout()} ${currentParticipants.length === 3 && !isSharing && !maximizedId ? 'grid-rows-2' : ''}`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {currentParticipants.map((peer, index) => (
              <motion.div
                key={peer.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={getParticipantStyle(index)}
                className={`relative group rounded-[2.5rem] bg-neutral-900/50 border border-white/5 flex items-center justify-center overflow-hidden shadow-2xl transition-all
                  ${isSharing ? 'aspect-video w-full shrink-0' : 'w-full h-full'}`}
              >
                <div className="flex flex-col items-center pointer-events-none">
                  <div className={`rounded-full bg-neutral-800 border border-white/5 flex items-center justify-center shadow-inner transition-all duration-500
                    ${isSharing ? 'h-16 w-16' : maximizedId ? 'h-40 w-40' : 'h-28 w-28'}`}>
                     <User size={isSharing ? 28 : maximizedId ? 64 : 48} className="text-neutral-600" />
                  </div>
                </div>

                {/* Maximise / Minimise Button - Hidden during Screen Share for cleaner UI */}
                {!isSharing && (
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setMaximizedId(maximizedId === peer.id ? null : peer.id); 
                    }}
                    className="absolute top-6 right-6 p-2.5 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-xl border border-white/10 hover:bg-white/20 text-white z-10"
                  >
                    {maximizedId === peer.id ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </button>
                )}

                <div className="absolute bottom-6 left-6 px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5 flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                   <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.15em]">{peer.name}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 3. VERTICAL PAGINATION - Hidden when Maximized */}
        {!isSharing && !maximizedId && totalPages > 1 && (
          <div className="w-10 h-full flex flex-col justify-center items-center pr-4 z-50">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentPage(i); }}
                className="group relative py-3 px-4 outline-none tap-highlight-transparent"
              >
                <motion.div 
                  initial={false}
                  animate={{ 
                    height: currentPage === i ? '32px' : '8px',
                    backgroundColor: currentPage === i ? '#6366f1' : 'rgba(255,255,255,0.1)'
                  }}
                  className="w-1 rounded-full transition-all duration-500 group-hover:bg-white/30"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .tap-highlight-transparent { -webkit-tap-highlight-color: transparent; }
      `}} />
    </div>
  );
};

export default SFUMeetingPage;