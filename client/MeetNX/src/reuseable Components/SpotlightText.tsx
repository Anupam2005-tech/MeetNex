import { cn } from "../lib/Utils";
import { Spotlight } from "../ui/Spotlight";
import { motion } from "framer-motion";

export function SpotlightText() {
  return (
    <div className="relative flex min-h-screen min-w-full overflow-hidden bg-black/[0.96] antialiased md:items-center md:justify-center">
      {/* Grid background */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
        )}
      />

      {/* Spotlight effect */}
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />

      {/* Text content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl p-6 pt-20 md:pt-0 text-center">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-5xl font-extrabold text-transparent md:text-[15rem] tracking-tight"
        >
          MeetNX
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="mt-6 text-xl md:text-2xl font-semibold text-neutral-200"
        >
          Seamless. Secure. Smart.
        </motion.p>

        {/* Supporting description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-neutral-400 leading-relaxed"
        >
          MeetNX makes connecting simple—whether it’s a quick chat, a team sync,
          or an all-day collaboration. Crystal-clear calls, effortless meetings,
          and intelligent tools that just work.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
          className="mt-8 flex justify-center gap-4"
        >
          <button className="rounded-2xl bg-white px-6 py-3 text-black font-semibold shadow-lg hover:scale-105 transition-transform">
            Get Started
          </button>
          <button className="rounded-2xl border border-neutral-500 px-6 py-3 text-white font-semibold hover:bg-white/10 hover:scale-105 transition-transform">
            Learn More
          </button>
        </motion.div>
      </div>
    </div>
  );
}
