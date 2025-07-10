import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { PointerHighlight } from "../reuseableComponents/textHighlight";
import { motion } from "framer-motion";

interface GlobeProps {
  className?: string;
}

export const Globe: React.FC<GlobeProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [1, 1, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [23.9408, 91.9882], size: 0.1 }, // Tripura
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className={`flex flex-col items-start justify-center space-y-4 ${className}`}>
      <motion.div
        className="text-left mt-4"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-white text-lg md:text-6xl font-semibold">
          Where are we from?
        </h2>
        <p className="text-neutral-300 text-2xl overflow-hidden ">
          We are from{" "}
          <PointerHighlight
            rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
            pointerClassName="text-sky-500"
          >
            <span className="relative z-10 font-bold text-white">
              Tripura, India
            </span>
          </PointerHighlight>
          , proudly representing our homeland on a global level.
        </p>
      </motion.div>

      <motion.canvas
        ref={canvasRef}
        style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 3, ease: "easeOut" }}
      />
    </div>
  );
};
