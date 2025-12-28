import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Github, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
export default function PremiumFooter() {
  const footerRef = useRef(null);
  
  
  // Cursor Tracking for the "Lava Glow"
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 30 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  });

  // Animations based on scroll depth
  const textY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const logoScale = useTransform(scrollYProgress, [0.5, 1], [0.8, 1]);
  const SOCIAL_LINKS = [
  { 
    name: "Github", 
    Icon: Github, 
    href: "https://github.com/Anupam2005-tech" 
  },
  { 
    name: "Linkedin", 
    Icon: Linkedin, 
    href: "https://www.linkedin.com/in/anupam-bhowmik-436a2027b" 
  },
  { 
    name: "Instagram", 
    Icon: Instagram, 
    href: "https://www.instagram.com/anupam01.___" 
  },
];

  return (
    <footer
      ref={footerRef}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
      className="relative w-full overflow-hidden bg-[#020205] text-white pt-32"
    >
      {/* 1. CINEMATIC BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none">
        {/* The "Lava" Cursor Tracker */}
        <motion.div
          style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
          className="absolute h-[600px] w-[600px] bg-indigo-600/20 blur-[120px] rounded-full"
        />
        
        {/* Precision Grid (0.5px lines for high-end feel) */}
        <div className="absolute inset-0 opacity-[0.1] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
             style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '50px 50px' }} 
        />
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: The "Glass Node" */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <motion.div style={{ scale: logoScale }} className="relative group">
              {/* Spinning Rings (Ultra-thin) */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-white/[0.03] rounded-full"
                  style={{ margin: `-${i * 20}px` }}
                />
              ))}
              
              {/* The Glass Shard */}
              <div className="relative h-64 w-64 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span className="font-zalando text-7xl font-bold tracking-tighter bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
                  NX
                </span>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-1 w-1 bg-indigo-500 rounded-full animate-ping" />
                  <span className="text-[9px] font-doto tracking-[0.4em] text-indigo-400 uppercase">Secure Node</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Text & Call to Action */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div style={{ y: textY }} className="space-y-8">
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                <span className="text-[10px] font-doto tracking-widest text-neutral-400 uppercase">v4.0 Protocol</span>
              </div>

              <h2 className="text-6xl md:text-8xl font-zalando font-bold tracking-tighter leading-[0.85]">
                Infinite <br />
                <span className="text-slate-400 ">Evolution.</span>
              </h2>

              <p className="max-w-md text-neutral-400 text-lg font-light font-outfit leading-relaxed">
                Architecting the backbone of neural-latency workflows. 
                Deploying edge-sync globally in <span className="text-white font-medium">0.4ms</span>.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
               <Link to={'/home'}>
                <button className="px-8 py-4 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:bg-indigo-500 hover:cursor-pointer hover:text-white transition-all duration-500 group">
                  Initialize Sync <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button></Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 3. THE "SPEC" STRIP (The Detailed Data Bar) */}
      <div className="relative border-y border-white/[0.05] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-4 grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
{ label: "Bitrate Ceiling", val: "12-bit RAW", progress: 95 },
  { label: "Packet Integrity", val: "< 0.001% Loss", progress: 99 },
  { label: "SFU Clusters", val: "840 Active", progress: 88 },
  { label: "Signal Protocol", val: "Binary/Sym", progress: 100 }
           ].map((stat, i) => (
             <div key={i} className="flex flex-col gap-1">
               <span className="text-[8px] font-doto text-neutral-600 uppercase tracking-widest">{stat.label}</span>
               <span className="text-xs font-medium text-neutral-300">{stat.val}</span>
             </div>
           ))}
        </div>
      </div>

      {/* 4. FOOTER BASE */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
            <p className="text-[10px] font-doto text-neutral-500 tracking-[0.2em] uppercase">
              © 2025 MeetNeX — Distributed Systems
            </p>
            <div className="flex items-center gap-2 text-[9px] text-neutral-500 uppercase font-medium tracking-widest">
  <span>Designed with love and passion</span>
  
  <span className="flex items-center gap-1.5 text-neutral-200 underline underline-offset-4 decoration-indigo-500/40 cursor-pointer hover:text-indigo-400 transition-colors group">
    by Anupam
    <motion.img 
      src="/heart.svg" 
      alt="heart" 
      className="w-10 h-10 transition-transform group-hover:scale-110" 
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    />
  </span>
</div>
        </div>

        <nav className="flex gap-8 text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-200 font-doto">
          {["Network", "Encryption","AI Assistance"].map((item) => (
            <p className="hover:text-white transition-colors">{item}</p>
          ))}
        </nav>

      <div className="flex gap-4">
  {SOCIAL_LINKS.map((social, i) => (
    <motion.a
      key={i}
      href={social.href}
      target="_blank" // Opens in a new tab
      rel="noopener noreferrer" // Security best practice
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-3 rounded-full border border-white/5 bg-white/[0.02] hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-colors text-neutral-500 hover:text-white"
      aria-label={social.name}
    >
      <social.Icon size={16} strokeWidth={1.5} />
    </motion.a>
  ))}
</div>
      </div>
    </footer>
  );
}