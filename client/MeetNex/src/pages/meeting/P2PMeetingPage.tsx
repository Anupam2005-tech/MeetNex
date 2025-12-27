import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, User, Radio, Activity } from 'lucide-react';

interface P2PMeetingPageProps {
  remoteStream?: MediaStream | null;
  remoteName?: string;
  latency?: number;
}

const P2PMeetingPage: React.FC<P2PMeetingPageProps> = ({ 
  remoteStream, 
  remoteName = "Partner",
  latency = 24
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="relative w-full h-full bg-[#030303] overflow-hidden rounded-[3rem] border border-white/10 shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] group transition-all duration-700">
      
      {/* 1. ANIMATED MESH BACKGROUND (Visible when stream is off) */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${remoteStream ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* 2. CONNECTION STATUS HUD (Top Right) */}
      <div className="absolute top-8 right-8 z-30 flex flex-col items-end gap-3 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 px-5 py-2.5 rounded-[1.25rem] bg-zinc-900/40 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/5"
        >
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">
                P2P Link
              </span>
              <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[8px] font-medium text-zinc-500 uppercase tracking-widest mt-1.5 flex items-center gap-1">
              <Activity size={10} className="text-emerald-500/70" />
              {latency}ms Latency
            </span>
          </div>
          
          <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-inner">
             <ShieldCheck size={20} strokeWidth={1.5} />
             <div className="absolute inset-0 rounded-xl bg-emerald-500/5 animate-pulse" />
          </div>
        </motion.div>
        
        {/* Subtle Tech Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-2 group-hover:translate-y-0"
        >
           <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
              <Zap size={10} className="text-amber-400/80" />
              <span>AES-256 Bit Encryption</span>
           </div>
        </motion.div>
      </div>

      {/* 3. THE VIDEO RENDERER */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {remoteStream ? (
            <motion.video
              key="video"
              ref={videoRef}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              autoPlay
              playsInline
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            />
          ) : (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full flex flex-col items-center justify-center"
            >
              <div className="relative h-32 w-32 flex items-center justify-center">
                 {/* Decorative rings */}
                 <div className="absolute inset-0 rounded-full border border-white/5 scale-100 animate-[ping_4s_linear_infinite]" />
                 <div className="absolute inset-2 rounded-full border border-white/5 scale-100 animate-[ping_3s_ease-out_infinite]" />
                 
                 <div className="h-24 w-24 rounded-full bg-zinc-900/50 backdrop-blur-xl border border-white/10 flex items-center justify-center relative z-10 shadow-2xl">
                    <User size={48} className="text-zinc-500" strokeWidth={1} />
                 </div>
              </div>
              <p className="mt-8 text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] animate-pulse">
                Establishing Node...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. NAME OVERLAY (Bottom Left) */}
      <div className="absolute bottom-8 left-8 z-20">
        <motion.div 
          layout
          className="flex items-center gap-4 bg-zinc-950/40 backdrop-blur-2xl px-5 py-3 rounded-2xl border border-white/10 shadow-2xl transition-all hover:bg-zinc-950/60 hover:border-white/20"
        >
           <div className="relative">
             <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
             <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
           </div>
           
           <div className="flex flex-col">
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">
               Connected Peer
             </span>
             <span className="text-sm font-bold text-white tracking-tight">
               {remoteName}
             </span>
           </div>

           <div className="ml-2 h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
              <Radio size={14} className="text-zinc-400" />
           </div>
        </motion.div>
      </div>

      {/* 5. CINEMATIC OVERLAYS */}
      {/* Soft Inner Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]" />
      
      {/* Top/Bottom Shading */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none opacity-80" />
      
      {/* Digital Grain/Noise Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default P2PMeetingPage;