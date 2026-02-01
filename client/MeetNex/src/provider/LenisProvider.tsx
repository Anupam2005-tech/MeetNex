import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import '../App.css'

interface LenisProviderProps {
  children: ReactNode;
}

const LenisProvider = ({ children }: LenisProviderProps) => {
  useEffect(() => {
    // Disable smooth scroll on mobile and tablet devices
    const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024;
    
    if (isMobileOrTablet) {
      // Skip Lenis initialization on mobile/tablet
      return;
    }

    const lenis = new Lenis({
      duration: 1.45,
      easing: (t: number) =>
        t === 1 ? 1 : 1 - Math.pow(2, -9 * t),
      smoothWheel: true,
      wheelMultiplier: 0.9,
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
