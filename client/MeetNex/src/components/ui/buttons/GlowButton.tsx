import React, { useState } from 'react';

interface GlowButtonProps {
  text: string;
  icon?: React.ReactNode;
}

const GlowButton = ({ text, icon }: GlowButtonProps) => {
  const [mousePos, setMousePos] = useState({ x: 100, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const startPos = { ...mousePos };
    const endPos = { x: 100, y: 50 };
    const duration = 1200; 
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentX = startPos.x + (endPos.x - startPos.x) * easeProgress;
      const currentY = startPos.y + (endPos.y - startPos.y) * easeProgress;
      setMousePos({ x: currentX, y: currentY });
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  return (
    <button
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: '0.75rem 2.5rem',
        borderRadius: '999px',
        color: '#3d1f0f',
        fontWeight: '700',
        fontSize: '14px',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#c4b5a8',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        background: `radial-gradient(
          circle at ${mousePos.x}% ${mousePos.y}%, 
          #fff5e6 0%, 
          #ffcc80 8%, 
          #ff9d4d 15%, 
          #ff6b35 25%, 
          #ff4500 32%, 
          #c4b5a8 45%
        )`,
        boxShadow: isHovered 
          ? `15px 0px 30px rgba(255, 69, 0, 0.6), inset 0px 1px 2px rgba(255, 255, 255, 0.3)` 
          : `12px 0px 25px -5px rgba(255, 85, 20, 0.8), inset 0px 1px 1px rgba(255, 255, 255, 0.2)`,
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {text} {icon}
    </button>
  );
};

export default GlowButton;