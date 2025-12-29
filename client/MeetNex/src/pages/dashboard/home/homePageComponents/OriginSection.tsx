import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Globe from "@/components/ui/Globe";
import LinkPreview from "@/components/ui/Link-preview";
import PointerHighlight from "@/components/ui/PointerHighlight";

export default function OriginSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -150]), {
    damping: 30,
    stiffness: 80
  });

  const globeScale = useTransform(scrollYProgress, [0, 0.5], [0.7, 1.05]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={containerRef}
      className="relative w-full min-h-[140vh] overflow-hidden flex items-center px-6 md:px-12 lg:px-24 bg-[#030303] selection:bg-indigo-500/30"
    >
      {/* 1. ULTRA-PREMIUM BACKGROUND LAYER */}
      <div className="absolute inset-0 -z-10">
        {/* Dynamic Mesh with Noise */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.5], [0.4, 0.7]),
            scale: useTransform(scrollYProgress, [0, 1], [1, 1.2])
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vh] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12)_0%,rgba(168,85,247,0.05)_30%,transparent_70%)]"
        />

        {/* Subtle Grid with Radial Mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center">

        {/* LEFT — CONTENT SECTION */}
        <motion.div
          style={{ opacity: textOpacity, y: smoothY }}
          className="flex flex-col space-y-10 lg:pr-20 relative"
        >
          {/* Micro-Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="group flex items-center space-x-3 w-fit px-4 py-2 rounded-full border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-md shadow-[0_2px_20px_-5px_rgba(0,0,0,0.5)]"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
            </div>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/50 group-hover:text-white/90 transition-colors duration-500">
              Northeast India &bull; 23.83&deg; N
            </span>
          </motion.div>

          {/* Heading with Linear Gradient Clip */}
          <div className="space-y-4">
            <motion.h2
              initial={{ filter: "blur(10px)", opacity: 0 }}
              whileInView={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-7xl md:text-[100px] font-bold tracking-tighter text-white leading-[0.85]"
            >
              Beyond <br />
              <span className="bg-gradient-to-b from-neutral-500 via-neutral-700 to-neutral-900 bg-clip-text text-transparent  font-semibold">
                Boundaries.
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-md font-light"
          >
            Originating from the serene hills of{" "}
          <PointerHighlight
   rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
            pointerClassName="text-yellow-500 h-3 w-3"
            containerClassName="inline-block mr-1"
>
  <span className="relative z-10 font-bold">
    <LinkPreview 
      url="https://maps.app.goo.gl/EXgULLUp37zkEyJd6" 
      isStatic={true} 
      imageSrc="/matarbari.jpg"
      className="text-white"
    >
      Tripura
    </LinkPreview>
  </span>
</PointerHighlight>,
            we engineer digital ecosystems that resonate with a{" "}
            <span className="text-indigo-300">global perspective.</span>
          </motion.p>

          {/* SaaS Styled CTA Divider */}
          <div className="flex items-center space-x-6">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "120px" }}
              transition={{ delay: 0.6, duration: 1.2 }}
              className="h-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent"
            />
            <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-600">Explore Origin</span>
          </div>
        </motion.div>

        {/* 2. THE PREMIUM VERTICAL DIVIDER (Glass Line) */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-y-1/2 h-[60%] w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.05)]" />

        {/* RIGHT — VISUAL SECTION */}
        <motion.div
          style={{
            scale: globeScale,
            rotate: useTransform(scrollYProgress, [0, 1], [0, 25]),
          }}
          className="relative aspect-square flex items-center justify-center lg:pl-20"
        >
          {/* Main Glow with animate-pulse-slow */}
          <div className="absolute inset-0 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />

          {/* Outer Orbital Rings (Premium Detail) */}
          {[1.4, 1.2, 1.05].map((scale, i) => (
            <motion.div
              key={i}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
              style={{ scale }}
              className="absolute inset-0 rounded-full border border-white/[0.03] border-dashed"
            />
          ))}

          {/* Floating Globe Container */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full h-full scale-90 md:scale-100 z-20 pointer-events-auto filter drop-shadow-[0_0_50px_rgba(99,102,241,0.2)]"
          >
            <LinkPreview url="https://maps.app.goo.gl/EXgULLUp37zkEyJd6" isStatic={true} imageSrc="/matarbari.jpg" ><Globe /></LinkPreview>
          </motion.div>
        </motion.div>
      </div>

      {/* Edge Softening */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030303] to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#030303] to-transparent z-20 pointer-events-none" />
    </motion.section>
  );
}