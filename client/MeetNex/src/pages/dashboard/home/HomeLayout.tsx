import LaserFlow from './homePageComponents/LaserFlow';
import { useRef } from 'react';
import Navbar from './Navbar';
import HeroShowcase from './homePageComponents/HeroShowcase';



// Basic Usage
<div style={{ height: '500px', position: 'relative', overflow: 'hidden' }}>
  <LaserFlow />
</div>

// Image Example Interactive Reveal Effect
export default function HomeLayout() {
  const revealImgRef = useRef<HTMLImageElement>(null);

  return (
  <>
    <div 
      style={{ 
        height: '100vh', 
        position: 'relative', 
        overflow: 'hidden',
        backgroundColor: '#060010'
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', `${x}px`);
          el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', '-9999px');
          el.style.setProperty('--my', '-9999px');
        }
      }}
    >
      <LaserFlow
        horizontalBeamOffset={0.1}
        verticalBeamOffset={0.0}
        color="#8684f1"
      />
      {/* navbar component */}
      <Navbar/>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '50%',
        height: '60%',
        backgroundColor: '#060010',
        borderRadius: '20px',
        border: '2px solid #8684f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '2rem',
        zIndex: 6
      }}>
    
  <img
    src="/download.png"
    alt="Preview"
    draggable={false}
    style={{
      maxWidth: '90%',
      maxHeight: '90%',
      objectFit: 'contain',
      imageRendering: 'auto',
      userSelect: 'none',
      pointerEvents: 'none',
    }}
  />
      </div>

      <img
        ref={revealImgRef}
        src="/hero-illustration.jpg"
        alt="Reveal effect"
        style={{
          position: 'absolute',
          width: '100%',
          top: '-50%',
          zIndex: 5,
          mixBlendMode: 'lighten',
          opacity: 0.3,
          pointerEvents: 'none',
          '--mx': '-9999px',
          '--my': '-9999px',
          WebkitMaskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          maskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat'
        } as React.CSSProperties & Record<string, any>}
      />
    </div>
    <HeroShowcase/>
  </>
  );
}