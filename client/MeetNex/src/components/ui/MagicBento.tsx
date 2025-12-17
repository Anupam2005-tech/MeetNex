import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';

/* ---------------- TYPES ---------------- */

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

/* ---------------- CONSTANTS ---------------- */

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

/* ---------------- CARD DATA ---------------- */

const cardData: BentoCardProps[] = [
  {
    color: '#060010',
    title: 'Analytics',
    description: 'Track user behavior',
    label: 'Insights'
    
  },
  {
    color: '#060010',
    title: 'Dashboard',
    description: 'Centralized data view',
    label: 'Overview'
  },
  {
    color: '#060010',
    title: 'Collaboration',
    description: 'Work together seamlessly',
    label: 'Teamwork'
  },
  {
    color: '#060010',
    title: 'Automation',
    description: 'Streamline workflows',
    label: 'Efficiency'
  },
];

/* ---------------- PARTICLE CARD ---------------- */

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const ParticleCard: React.FC<any> = ({
  children,
  className,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt,
  clickEffect,
  enableMagnetism,
  disableAnimations
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const particles = useRef<HTMLDivElement[]>([]);
  const hovering = useRef(false);

  const spawnParticles = () => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    for (let i = 0; i < particleCount; i++) {
      const p = createParticleElement(Math.random() * width, Math.random() * height, glowColor);
      ref.current.appendChild(p);
      particles.current.push(p);

      gsap.to(p, {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'none'
      });
    }
  };

  useEffect(() => {
    if (disableAnimations || !ref.current) return;
    const el = ref.current;

    const enter = () => {
      hovering.current = true;
      spawnParticles();
      enableTilt && gsap.to(el, { rotateX: 5, rotateY: 5, duration: 0.3 });
    };

    const leave = () => {
      hovering.current = false;
      particles.current.forEach(p => p.remove());
      particles.current = [];
      gsap.to(el, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.3 });
    };

    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);

    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };
  }, [disableAnimations]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

/* ---------------- GLOBAL SPOTLIGHT ---------------- */

const GlobalSpotlight: React.FC<any> = ({ gridRef, glowColor }) => {
  useEffect(() => {
    if (!gridRef.current) return;
    const spotlight = document.createElement('div');
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, rgba(${glowColor},0.15), transparent 70%);
      transform: translate(-50%, -50%);
      opacity: 0;
      z-index: 200;
    `;
    document.body.appendChild(spotlight);

    const move = (e: MouseEvent) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
      spotlight.style.opacity = '1';
    };

    document.addEventListener('mousemove', move);
    return () => {
      document.removeEventListener('mousemove', move);
      spotlight.remove();
    };
  }, [gridRef, glowColor]);

  return null;
};

/* ---------------- MAIN COMPONENT ---------------- */

const MagicBento: React.FC<BentoProps> = ({
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = true,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <style>{`
        .card-grid {
          display: grid;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .card-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .card-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          /* Column spans to mimic HeroShowcase */
          .card-grid .card:nth-child(1) { grid-column: span 1; }
          .card-grid .card:nth-child(2) { grid-column: span 2; }
          .card-grid .card:nth-child(3) { grid-column: span 2; }
          .card-grid .card:nth-child(4) { grid-column: span 1; }
          .card-grid .card:nth-child(5) { grid-column: span 2; }
          .card-grid .card:nth-child(6) { grid-column: span 1; }
        }

        .card {
          min-height: 24rem;
          padding: 1.5rem;
          border-radius: 20px;
          background: #060010;
          color: white;
          border: 1px solid #392e4e;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          position: relative;
          overflow: hidden;
        }
      `}</style>

      {enableSpotlight && <GlobalSpotlight gridRef={gridRef} glowColor={glowColor} />}

      <div ref={gridRef} className="card-grid max-w-6xl mx-auto">
        {cardData.map((card, index) => (
          <ParticleCard
            key={index}
            className={`card ${enableBorderGlow ? 'card--border-glow' : ''}`}
            glowColor={glowColor}
            enableTilt={enableTilt}
            clickEffect={clickEffect}
            enableMagnetism={enableMagnetism}
          >
            
            <span className="text-sm opacity-70">{card.label}</span>
            <h3 className="text-lg mt-2">{card.title}</h3>
            <p className="text-sm opacity-80">{card.description}</p>
            
          </ParticleCard>
        ))}
      </div>
    </>
  );
};

export default MagicBento;
