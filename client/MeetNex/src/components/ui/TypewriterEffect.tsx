import { motion } from "motion/react";
import { cn } from "../../lib/Utils";

type TypewriterProps = {
  text: string;
  className?: string;
};

export const Typewriter = ({ text, className }: TypewriterProps) => {
  return (
    <div className={cn("relative flex items-center group", className)}>
      
      {/* 1. THE "GEOMETRY SPACE" (Static backdrop) */}
      <div className="absolute -left-4 flex items-center gap-1 opacity-40">
        <div className="h-8 w-[1px] bg-zinc-200" />
        <div className="flex flex-col gap-1">
          <div className="h-[1px] w-2 bg-zinc-400" />
          <div className="h-[1px] w-1 bg-zinc-400" />
        </div>
      </div>

      <div className="relative">
        {/* 2. THE BASE TEXT (Ghost layer for structure) */}
        <span className="opacity-[0.03] font-black select-none tracking-tight">
          {text}
        </span>

        {/* 3. THE REVEAL LAYER */}
        <motion.span
          className="absolute inset-0 font-black tracking-tight whitespace-nowrap overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 4,
            ease: [0.22, 1, 0.36, 1], // Quintic Out - very smooth deceleration
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          {/* Main Text with a Sharp Metallic Gradient */}
          <span className="bg-gradient-to-r from-zinc-950 via-zinc-500 to-zinc-900 bg-clip-text text-transparent">
            {text}
          </span>

          {/* 4. THE GLASS SHIMMER (The "Beauty" Beam) */}
          <motion.div
            animate={{ x: ["-100%", "300%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[30deg] pointer-events-none"
          />
        </motion.span>
      </div>

      {/* 5. THE "OPTICAL" CURSOR */}
      <div className="ml-4 relative flex items-center justify-center">
        {/* Rotating focal ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-6 h-6 border border-dashed border-zinc-200 rounded-full"
        />
        {/* The focus dot */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1.5 h-1.5 bg-zinc-900 rounded-full"
        />
        {/* Micro-text marker */}
        <span className="absolute -bottom-4 font-mono text-[6px] text-zinc-300 uppercase tracking-widest">
          Focus_Infinity
        </span>
      </div>
    </div>
  );
};