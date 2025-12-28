import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Monitor, Users } from 'lucide-react';

interface P2PMeetingPageProps {
  remoteStream?: MediaStream | null;
  remoteScreenStream?: MediaStream | null;
}

const P2PMeetingPage: React.FC<P2PMeetingPageProps> = ({ 
  remoteStream, 
  remoteScreenStream 
}) => {
  const peerVideoRef = useCallback((node: HTMLVideoElement | null) => {
    if (node && remoteStream) {
      node.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const screenVideoRef = useCallback((node: HTMLVideoElement | null) => {
    if (node && remoteScreenStream) {
      node.srcObject = remoteScreenStream;
    }
  }, [remoteScreenStream]);

  const isSharing = !!remoteScreenStream;

  return (
    <div className="relative w-full h-full flex gap-4 overflow-hidden bg-[#050505] font-sans p-2">
      
      {/* 1. PRESENTATION STAGE */}
      <div className={`relative flex-grow transition-all duration-700 ease-in-out overflow-hidden rounded-[2.5rem] border border-white/5 bg-neutral-900 shadow-2xl ${isSharing ? 'w-[75%]' : 'w-full'}`}>
        <AnimatePresence mode="wait">
          {isSharing ? (
            <motion.div 
              key="screen-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full bg-black flex items-center justify-center"
            >
              <video 
                ref={screenVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-contain" 
              />
              <div className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md">
                <Monitor size={14} className="text-indigo-300" />
                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Active Presentation</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="peer-view" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-full h-full"
            >
               {remoteStream ? (
                 <video 
                   ref={peerVideoRef} 
                   autoPlay 
                   playsInline 
                   className="w-full h-full object-cover" 
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                    <div className="h-32 w-32 rounded-full bg-neutral-800 border border-white/5 flex items-center justify-center shadow-2xl">
                       <User size={64} className="text-neutral-600" />
                    </div>
                 </div>
               )}
               
               <div className="absolute top-8 left-8 z-30">
                <P2PStatusTag />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isSharing && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-[25%] flex flex-col justify-start pt-4" // Aligned to top, width adjusted
          >
            <motion.div 
               className="relative aspect-video w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0c0e] shadow-2xl"
               whileHover={{ scale: 1.02 }}
            >
              {remoteStream ? (
                <video 
                  ref={peerVideoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                  <User size={32} className="text-neutral-600" />
                </div>
              )}
              
              {/* Floating Name Label */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/5">
                  <Users size={12} className="text-zinc-400" />
                  <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider truncate">Participant</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const P2PStatusTag = () => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10"
  >
    <div className="flex items-center justify-center h-5 px-2 rounded bg-blue-500/10 border border-blue-500/20">
      <span className="text-[10px] font-bold text-blue-400 tracking-wider">P2P</span>
    </div>
    <div className="h-4 w-[1px] bg-white/10" />
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
      <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-tighter">Live</span>
    </div>
  </motion.div>
);

export default P2PMeetingPage;