import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import '../App.css'

interface LenisProviderProps {
  children: ReactNode;
}

const LenisProvider = ({ children }: LenisProviderProps) => {
  useEffect(() => {
    const lenis = new Lenis({
      // Slower, heavier scroll = premium feel
      duration: 1.45,

      // Custom cinematic easing
      easing: (t: number) =>
        t === 1 ? 1 : 1 - Math.pow(2, -9 * t),

      // Wheel feels smooth, not floaty
      smoothWheel: true,

      // Disable touch smoothing for precision
      smoothTouch: false,

      // Slight inertia reduction for control
      wheelMultiplier: 0.9,

      // Touch multiplier (if enabled later)
      touchMultiplier: 1.2,
    });

    let rafId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
