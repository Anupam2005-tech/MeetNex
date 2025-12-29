import { useEffect, useState } from "react";
import { Typewriter } from "../ui/TypewriterEffect";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  { image: "/sliderImages/slide1banner.svg", text: "Crystal Clear Video Protocols" },
  { image: "/sliderImages/slide3banner.svg", text: "Schedule Meeting for later" },
  { image: "/sliderImages/slide2banner.svg", text: "Low Latency Screen Sharing" },
];

function MainLayoutText() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full flex flex-col items-center max-w-6xl py-10">
      <div className="text-center mb-4">
        <span className="inline-block px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
          MeetNeX  v1.0
        </span>
        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-zinc-900 leading-[0.9] text-center">
          Every Conversation <br />
          <span className="text-zinc-400">Deserves</span>{" "}
          <span className="text-zinc-900 inline-flex items-center gap-4">
            Matters: 
            
              <Typewriter text="MeetNex." />
           
          </span>
        </h1>
      </div>

      <p className="text-zinc-500 text-sm md:text-lg text-center max-w-xl font-light leading-relaxed mt-8">
        Experience seamless connectivity through our distributed high-fidelity engine.
      </p>

      <div className="relative w-full h-[400px] mt-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute flex flex-col items-center w-full"
          >
            <div className="relative">
              {/* Subtle ambient glow behind image - no black background */}
              <div className="absolute inset-0 bg-indigo-500/5 blur-[80px] rounded-full" />
              <img
                src={slides[current].image}
                alt=""
                className="w-64 h-64 md:w-80 md:h-80 object-contain relative z-10 drop-shadow-xl"
              />
            </div>
            <h2 className="mt-12 text-2xl font-bold text-zinc-900 tracking-tight">
              {slides[current].text}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-3 mt-12">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              current === index ? "bg-zinc-900 w-12" : "bg-zinc-200 w-4 hover:bg-zinc-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default MainLayoutText;