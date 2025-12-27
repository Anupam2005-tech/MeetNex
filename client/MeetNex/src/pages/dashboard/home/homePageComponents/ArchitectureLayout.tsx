import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import BentoCodeSystem from "@/components/ui/Bento-Code";
import { ChevronRight, Cpu, Globe, Zap, ShieldCheck } from "lucide-react";

export default function TechArchitectLayout() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll Progress for parallax and scaling
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
      className="relative min-h-[150vh] bg-[#020205] text-white py-24 overflow-hidden"
    >
      {/* 1. CINEMATIC BACKGROUND LAYER */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Dynamic Grid with Parallax */}
        <motion.div 
          style={{ y: yParallax }}
          className="absolute inset-0 opacity-20"
        >
          <div className="absolute inset-0" 
               style={{ backgroundImage: `linear-gradient(to right, #ffffff0a 1px, transparent 1px), linear-gradient(to bottom, #ffffff0a 1px, transparent 1px)`, 
               backgroundSize: '60px 60px' }} 
          />
        </motion.div>

        {/* Floating Light Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* 2. HEADER SECTION WITH SCROLL ANIMATION */}
        <motion.div 
          style={{ scale, opacity }}
          className="mb-32 space-y-8"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative px-4 py-1.5 rounded-full border border-white/10 bg-black text-[10px] font-mono text-indigo-400 tracking-[0.3em] uppercase">
                System Protocol v4.0.2
              </div>
            </div>
            <div className="h-[1px] w-24 bg-gradient-to-r from-indigo-500/50 to-transparent" />
          </motion.div>
          
          <motion.h2 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
             className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.9]"
          >
            Architecting <br />
            <span className="text-neutral-600  font-light">Digital Intelligence.</span>
          </motion.h2 >
        </motion.div>

        {/* 3. THE MAIN BENTO DISPLAY */}
        <div className="relative group">
          {/* Animated Border "Scanning" Effect */}
          <motion.div 
            className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative bg-[#050508]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
          >
             {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-indigo-500/30 rounded-tl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-indigo-500/30 rounded-br-3xl pointer-events-none" />
            
            <div className="p-1">
               <BentoCodeSystem />
            </div>
          </motion.div>
        </div>

        {/* 4. FEATURE GRID WITH STAGGERED REVEAL */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md"
        >
           <FeatureDetail icon={<Zap />} title="Latency" desc="< 5ms Internal" />
           <FeatureDetail icon={<Globe />} title="Distribution" desc="Global Mesh & SFU " />
         <FeatureDetail 
  icon={<Cpu size={18} />} 
  title="Engine" 
  desc="Deterministic Packet Sync" 
/>
           <FeatureDetail icon={<ShieldCheck />} title="Security" desc="Prevent Data leakage" />
        </motion.div>

      </div>
    </section>
  );
}

function FeatureDetail({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#020205] p-10 flex flex-col gap-6 group cursor-pointer hover:bg-white/[0.03] transition-all duration-500">
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-500">
        {React.cloneElement(icon as React.ReactElement)}
      </div>
      <div>
        <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2">{title}</h4>
        <p className="text-lg font-medium text-neutral-200">{desc}</p>
      </div>
      <div className="flex items-center gap-2 text-indigo-400 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
 
      </div>
    </div>
  );
}