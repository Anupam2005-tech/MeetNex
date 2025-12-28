"use client";

import { memo, useRef } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface AnimatedTextProps {
  text: string;
  delay?: number;
  className?: string;
}

const AnimatedText = memo(({ text, delay = 0, className }: AnimatedTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 40%"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [12, -6]);

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.span
        ref={ref}
        style={{ y }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={`inline-block ${className}`}
      >
        {text.split("").map((char, i) => (
          <m.span
            key={i}
            className="inline-block"
            style={{ whiteSpace: "pre" }}
            initial={{
              opacity: 0,
              x: -20,
              filter: "blur(6px)",
            }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                  }
                : {}
            }
            transition={{
              duration: 0.5,
              delay: delay + i * 0.025,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char}
          </m.span>
        ))}
      </m.span>
    </LazyMotion>
  );
});

export default AnimatedText;
