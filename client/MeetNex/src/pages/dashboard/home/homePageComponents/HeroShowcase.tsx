import { useRef, useState } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0, filter: "blur(12px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HeroShowcase() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section 
      ref={targetRef}
      className="relative w-full min-h-screen bg-[#020205] px-4 sm:px-6 md:px-12 py-20 md:py-32 overflow-hidden selection:bg-indigo-500/30"
    >
      {/* 1. PIXEL & AURA BACKGROUND ENGINE */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] md:h-[600px] bg-indigo-600/10 blur-[120px] md:blur-[160px] rounded-full opacity-60" />
        
        <div className="absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <motion.div 
            animate={{ 
              backgroundPosition: ["0px 0px", "24px 24px"],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[radial-gradient(circle_2px_at_2px_2px,#6366f1_1px,transparent_0)] bg-[size:24px_24px] opacity-40"
          />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col items-center text-center mb-16 md:mb-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl mb-6 md:mb-8 shadow-2xl"
          >
            <span className="text-[8px] md:text-[10px] font-doto font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase bg-gradient-to-r from-indigo-300 to-indigo-500 bg-clip-text text-transparent">
              MeetNex Protocol v1.0
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-8xl font-zalando font-bold tracking-tighter text-white mb-8 leading-[1.1] md:leading-[0.9] max-w-5xl"
          >
            Intelligence at the <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 ">
              edge of possibility.
            </span>
          </motion.h1>
        </header>

        {/* BENTO GRID */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
        >
          <motion.div variants={itemVariants} className="md:col-span-7 h-[350px] md:h-[420px]">
            <PremiumCard tag="Engine" title="Meet Lumi AI" description="Your in-call co-pilot. Lumi handles all your query in chat." imageSrc="/heropic.png" />
          </motion.div>
          <motion.div variants={itemVariants} className="md:col-span-5 h-[350px] md:h-[420px]">
            <PremiumCard tag="Transport" title="Notification" description="Get notification before the meeting" imageSrc="/ring.png" />
          </motion.div>
          <motion.div variants={itemVariants} className="md:col-span-5 h-[350px] md:h-[420px]">
            <PremiumCard tag="Security" title="Instant Tunneling" description="Drop multi-GB assets via TCP protocol." imageSrc="/pm.jpg" />
          </motion.div>
          <motion.div variants={itemVariants} className="md:col-span-7 h-[350px] md:h-[420px]">
            <PremiumCard tag="Interface" title="Active Workspace" description="Collaborative canvas synced across global nodes." imageSrc="/download.png" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function PremiumCard({ tag, title, description, imageSrc }: { tag: string; title: string; description: string; imageSrc: string }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div 
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      className="group relative h-full w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] p-[1.5px] transition-all duration-500"
    >
      {/* INFINITY BORDER */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-150%] z-0 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_150deg,rgba(99,102,241,1)_180deg,transparent_210deg)]"
        />
      </div>

      <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] md:rounded-[2.4rem] bg-[#0A0A0F] z-10">
        {/* Dynamic Spotlight - Hidden on touch devices for performance */}
        <div 
          className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block"
          style={{
            background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`
          }}
        />

        {/* IMAGE LAYER */}
        <div className="absolute inset-0 z-0">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src={imageSrc} 
            className="h-full w-full object-cover opacity-60 group-hover:opacity-90 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/20 to-transparent z-10" />
        </div>

        {/* CONTENT */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-20">
          <div className="flex items-center gap-2 mb-3 md:mb-4 bg-black/40 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/10 shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
            <p className="text-[8px] md:text-[10px] font-doto font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-indigo-300">{tag}</p>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
            {title}
          </h3>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed max-w-[240px] md:max-w-[280px] font-medium opacity-80">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}