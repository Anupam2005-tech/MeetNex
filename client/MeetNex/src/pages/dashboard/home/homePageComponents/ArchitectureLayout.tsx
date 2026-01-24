import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import BentoCodeSystem from "@/components/ui/Bento-Code";
import { Cpu, Globe, Zap, ShieldCheck } from "lucide-react";

export default function TechArchitectLayout() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[120vh] md:min-h-[150vh] bg-[#020205] text-white py-16 md:py-24 overflow-hidden"
    >
      {/* 1. CINEMATIC BACKGROUND LAYER */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <motion.div style={{ y: yParallax }} className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" 
               style={{ 
                 backgroundImage: `linear-gradient(to right, #ffffff0a 1px, transparent 1px), linear-gradient(to bottom, #ffffff0a 1px, transparent 1px)`, 
                 backgroundSize: '40px 40px md:60px 60px' 
               }} 
          />
        </motion.div>

        <div className="absolute top-[-10%] left-[-10%] w-[70%] md:w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] md:w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[80px] md:blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* 2. HEADER SECTION */}
        <motion.div 
          style={{ scale, opacity }}
          className="mb-16 md:mb-32 space-y-6 md:space-y-8"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/10 bg-black text-[8px] md:text-[10px] font-mono text-indigo-400 tracking-[0.2em] md:tracking-[0.3em] uppercase">
                MeetNex Protocol v1.0
              </div>
            </div>
            <div className="h-[1px] w-12 md:w-24 bg-gradient-to-r from-indigo-500/50 to-transparent" />
          </motion.div>
          
          <motion.h2 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
             className="text-4xl sm:text-6xl md:text-8xl font-medium tracking-tight leading-[1] md:leading-[0.9]"
          >
            Architecting <br className="hidden sm:block" />
            <span className="text-neutral-600 font-light">Digital Intelligence.</span>
          </motion.h2 >
        </motion.div>

        {/* 3. THE MAIN BENTO DISPLAY */}
        <div className="relative group">
          <motion.div 
            className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 hidden md:block"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative bg-[#050508]/80 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-12 h-12 md:w-20 md:h-20 border-t border-l border-indigo-500/30 rounded-tl-2xl md:rounded-tl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-12 h-12 md:w-20 md:h-20 border-b border-r border-indigo-500/30 rounded-br-2xl md:rounded-br-3xl pointer-events-none" />
            
            <div className="p-0.5 md:p-1 overflow-x-auto">
               <BentoCodeSystem />
            </div>
          </motion.div>
        </div>

        {/* 4. FEATURE GRID */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden backdrop-blur-md"
        >
          <FeatureDetail icon={<Zap size={18} />} title="Latency" desc="< 5ms Internal" />
          <FeatureDetail icon={<Globe size={18} />} title="Distribution" desc="Global Mesh & SFU" />
          <FeatureDetail icon={<Cpu size={18} />} title="Engine" desc="Packet Sync" />
          <FeatureDetail icon={<ShieldCheck size={18} />} title="Security" desc="Data Guard" />
        </motion.div>

      </div>
    </section>
  );
}

function FeatureDetail({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#020205] p-6 md:p-10 flex flex-col gap-4 md:gap-6 group cursor-pointer hover:bg-white/[0.03] transition-all duration-500">
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-500">
        {React.cloneElement(icon as React.ReactElement)}
      </div>
      <div>
        <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mb-1 md:mb-2">{title}</h4>
        <p className="text-base md:text-lg font-medium text-neutral-200">{desc}</p>
      </div>
    </div>
  );
}