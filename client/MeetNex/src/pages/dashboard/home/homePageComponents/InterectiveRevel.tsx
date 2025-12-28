"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";

// --- NEW COMPONENT: Text Reveal Effect ---
const TextReveal = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }} // Custom "Architectural" ease
      >
        {children}
      </motion.div>
    </div>
  );
};

const InteractiveRevel = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 30,
    restDelta: 0.001,
  });

  const headerOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const headerScale = useTransform(smoothProgress, [0, 0.2], [1, 0.9]);
  const headerY = useTransform(smoothProgress, [0, 0.2], [0, -50]);
  const videoY = useTransform(smoothProgress, [0, 0.3], [100, 0]);
  const videoScale = useTransform(smoothProgress, [0.1, 0.4], [0.8, 1]);
  const gridY = useTransform(smoothProgress, [0, 1], [0, -100]);

  return (
    <div ref={containerRef} className="relative bg-[#FCFCFC] text-slate-950 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. ARCHITECTURAL GRID OVERLAY */}
      <motion.div style={{ y: gridY }} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.15]" 
             style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} 
        />
        <div className="h-full w-full max-w-7xl mx-auto border-x border-slate-200 border-dashed relative">
            <div className="absolute left-1/3 h-full border-l border-slate-200 border-dashed hidden md:block" />
        </div>
      </motion.div>

      {/* 2. TOP TEXT SECTION */}
      <section className="relative z-20 h-screen flex items-center border-b border-slate-200 border-dashed overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-12 w-full">
          <div className="hidden md:block md:col-span-4 border-r border-slate-200 border-dashed" />
          
          <div className="col-span-12 md:col-span-8 p-12 md:p-24 md:pl-16">
            <motion.div style={{ opacity: headerOpacity, scale: headerScale, y: headerY }}>
              <div className="flex items-center gap-4 mb-8">
                 <div className="relative">
                    <span className="absolute inset-0 bg-indigo-500 blur-sm opacity-40 animate-pulse" />
                    <span className="relative block w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                 </div>
                 <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-slate-400">Next-Gen Interface</span>
              </div>
              
              {/* APPLIED TEXT REVEAL HERE */}
              <div className="text-6xl lg:text-[110px] font-bold tracking-tight leading-[0.95] lg:leading-[0.9] mb-12 text-slate-950">
  {/* Add padding-bottom (pb-4) to create room for the 'g' descender */}
  <TextReveal className="pb-4 lg:pb-6">
    Work Together.
  </TextReveal>
  
  <TextReveal className="text-slate-400 opacity-90">
    Pixel Perfect.
  </TextReveal>
</div>
              <TextReveal>
                <p className="max-w-xl text-xl text-slate-500 font-light leading-relaxed">
                  Experience a customized virtual environment designed for high-performance 
                  teams. Eliminate friction, prioritize clarity.
                </p>
              </TextReveal>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. VIDEO SECTION */}
      <div className="relative w-full z-10 py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
            <motion.div 
              style={{ y: videoY, scale: videoScale }}
              className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-slate-200"
            >
              <video src="/waves.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </motion.div>
        </div>
      </div>

      {/* 4. BOTTOM INFO SECTION */}
      <section className="relative z-20 bg-[#FCFCFC] border-t border-slate-200 border-dashed">
        <div className="max-w-7xl mx-auto grid grid-cols-12">
          
          <div className="hidden md:block md:col-span-4 border-r border-slate-200 border-dashed pt-24 px-12">
             <div className="sticky top-24">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-4">The Specs</p>
                <div className="h-px w-full bg-slate-200 mb-8" />
                <ul className="space-y-6">
                    {['Symmetric State Sync', 'Sub-50ms Global Hop', 'End-to-End Encrypted SCTP'].map((item, i) => (
                        <li key={item} className="text-sm font-medium text-slate-800 flex items-center gap-3">
                            <motion.div 
                              initial={{ scale: 0 }} 
                              whileInView={{ scale: 1 }} 
                              transition={{ delay: i * 0.1 }}
                              className="w-1.5 h-1.5 bg-indigo-600 rounded-full" 
                            /> 
                            <TextReveal>{item}</TextReveal>
                        </li>
                    ))}
                </ul>
             </div>
          </div>

          <div className="col-span-12 md:col-span-8 p-12 md:p-24 md:pl-16">
            <h2 className="text-3xl md:text-5xl tracking-tight leading-[1.1] text-slate-900 mb-20 font-medium max-w-3xl">
  <TextReveal className="pb-2">
    Deterministic synchronization
  </TextReveal>
  <TextReveal className="text-slate-400 pb-2">
    across a global mesh.
  </TextReveal>
  <TextReveal>
    Zero-latency signaling for high-stakes teams.
  </TextReveal>
</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <FeatureItem title="Fluid Customization" desc="Build offices that adapt to your unique team culture." delay={0.1} />
                <FeatureItem title="Studio Audio" desc="Directional sound mapping makes remote feel like same-room." delay={0.2} />
                <FeatureItem title="Instant Access" desc="Single-link invitations with secure guest tunneling." delay={0.3} />
                <FeatureItem title="Edge Sync" desc="Real-time data propagation across global team nodes." delay={0.4} />
            </div>
          </div>
        </div>
      </section>
      <div className="h-40 border-t border-slate-200 border-dashed opacity-50" />
    </div>
  );
};

const FeatureItem = ({ title, desc, delay }: { title: string; desc: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true }}
    className="bg-[#FCFCFC] p-10 hover:bg-slate-50 transition-colors duration-500 group"
  >
    <div className="mb-8 w-10 h-px bg-indigo-600 group-hover:w-20 transition-all duration-700" />
    <TextReveal>
      <h3 className="font-bold text-slate-950 mb-4 tracking-tight uppercase text-xs">{title}</h3>
    </TextReveal>
    <p className="text-base text-slate-500 leading-relaxed font-light">{desc}</p>
  </motion.div>
);

export default InteractiveRevel;