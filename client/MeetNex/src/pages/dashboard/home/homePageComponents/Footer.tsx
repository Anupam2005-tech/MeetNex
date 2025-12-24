"use client";

import React from "react";
import {
  motion,
  type Variants,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import { Github, Linkedin, Twitter, Youtube, Radio } from "lucide-react";
import StyledButton from "@/components/ui/buttons/StyledButton";

/* ------------------ Animations ------------------ */

const footerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1,
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ------------------ Component ------------------ */

export default function Footer() {
  /* Cursor reactive glow */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  /* Scroll dissolve */
  const { scrollYProgress } = useScroll();
  const dissolve = useTransform(scrollYProgress, [0.6, 1], [1, 0.35]);

  return (
    <footer
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }}
      className="relative overflow-hidden pt-24 text-white border-t border-white/[0.02] bg-[#020205]"
    >
      {/* 🌋 LAVA PIXEL BACKGROUND SYSTEM */}
      <motion.div
        style={{ opacity: dissolve }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Cursor Lava Core */}
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="absolute h-[700px] w-[700px] rounded-full
          bg-[radial-gradient(circle,rgba(255,90,40,0.35),rgba(99,102,241,0.25),transparent_65%)]
          blur-[180px]"
        />

        {/* Breathing Molten Core */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[900px] w-[900px]
          rounded-full bg-[radial-gradient(circle,rgba(255,80,40,0.25),transparent_70%)]
          blur-[160px]"
        />

        {/* Pixel Lava Grid */}
        <motion.div
          animate={{ backgroundPosition: ["0% 0%", "120% 120%"] }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.07]
          bg-[linear-gradient(90deg,rgba(255,100,60,0.5)_1px,transparent_1px),
          linear-gradient(180deg,rgba(255,100,60,0.5)_1px,transparent_1px)]
          bg-[size:24px_24px]"
        />

        {/* Floating Pixel Embers */}
        {[...Array(22)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-2.5 w-2.5 rounded-sm bg-orange-400/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-25, 25, -25],
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Film Grain */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"4\"/%3E%3C/filter%3E%3Crect width=\"200\" height=\"200\" filter=\"url(%23n)\"/%3E%3C/svg%3E')",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />
      </motion.div>

      {/* ------------------ CONTENT ------------------ */}

      <motion.div
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Left Node */}
          <motion.div variants={childVariants} className="relative hidden lg:block">
            <div className="relative h-[400px] w-[400px] flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-white/[0.03] rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-10 border border-indigo-500/5 rounded-full"
              />

              <div className="relative h-48 w-48 rounded-[48px] bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-3xl border border-white/10 flex flex-col items-center justify-center shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)]">
                <span className="font-zalando text-5xl font-bold tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                  NX
                </span>
                <div className="mt-3 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[8px] font-doto tracking-widest text-indigo-400 uppercase">
                    System Live
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Text */}
          <div className="flex flex-col items-start">
            <motion.div
              variants={childVariants}
              className="flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20"
            >
              <Radio size={12} className="text-indigo-400 animate-pulse" />
              <span className="text-[10px] font-doto font-bold text-indigo-300 uppercase tracking-widest">
                Global Protocol Active
              </span>
            </motion.div>

            <motion.h2
              variants={childVariants}
              className="text-5xl sm:text-7xl font-zalando font-bold tracking-tighter leading-[0.9] mb-8"
            >
              The future is <br />
              <span className="text-neutral-600">Syncing.</span>
            </motion.h2>

            <motion.p
              variants={childVariants}
              className="max-w-md text-neutral-400 text-lg font-light leading-relaxed mb-10 font-outfit"
            >
              MeetNeX infrastructure powers the next generation of 0ms latency
              AI-driven workflows.
            </motion.p>

            <motion.div variants={childVariants}>
              <StyledButton text="See in Action" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ------------------ BOTTOM BAR ------------------ */}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative z-10 border-t border-white/[0.05] bg-[#020205]/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <p className="text-[10px] font-doto text-neutral-500 tracking-widest uppercase">
              © {new Date().getFullYear()} MeetNeX — Node 0172_LA
            </p>
            <div className="flex items-center gap-2 text-[9px] text-neutral-600 tracking-[0.25em] uppercase font-medium">
              <span>Crafted with</span>
              <motion.img
                src="/heart.svg"
                alt="heart"
                className="w-3.5 h-3.5 brightness-75"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <span>By</span>
              <span className="text-neutral-300 underline underline-offset-4 decoration-indigo-500/40">
                Anupam
              </span>
            </div>
          </div>

          <nav className="flex gap-10 text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-500 font-doto">
            {["Changelog", "Status", "Docs"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-indigo-400 transition-all duration-300"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex gap-3">
            {[Github, Linkedin, Twitter, Youtube].map((Icon, idx) => (
              <motion.a
                key={idx}
                href="#"
                whileHover={{ y: -3, backgroundColor: "rgba(99,102,241,0.1)" }}
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/5 text-neutral-500 hover:text-white transition-all"
              >
                <Icon size={18} strokeWidth={1.5} />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
