import { motion } from "motion/react";
import { cn } from "../../lib/Utils";

type SingleWordTypewriterProps = {
  text: string;
  className?: string;
  cursorClassName?: string;
};

export const Typewriter = ({
  text,
  className,
  cursorClassName,
}: SingleWordTypewriterProps) => {
  return (
    <span className={cn("inline-flex items-center", className)}>
      {/* TYPEWRITER TEXT */}
      <motion.span
        className="overflow-hidden whitespace-nowrap inline-block"
        animate={{
          width: ["0ch", `${text.length}ch`, "0ch"],
        }}
        transition={{
          duration: 3,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        <span className="inline-block">{text}</span>
      </motion.span>

      {/* CURSOR */}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
        }}
        className={cn(
          "ml-1 inline-block w-[3px] h-5 sm:h-6 md:h-8 bg-blue-500",
          cursorClassName
        )}
      />
    </span>
  );
};
