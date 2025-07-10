import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import '../App.css';

const CustomCursor: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [visible, setVisible] = useState(false);

  const springX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      mouseX.set(e.clientX - 50);
      mouseY.set(e.clientY - 50);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [mouseX, mouseY, visible]);

  return (
    <motion.div
      className="custom-cursor"
      style={{
        translateX: springX,
        translateY: springY,
        opacity: visible ? 1 : 0,
      }}
    />
  );
};

export default CustomCursor;
