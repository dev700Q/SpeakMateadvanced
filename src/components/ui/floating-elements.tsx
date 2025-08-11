import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const FloatingElements: React.FC = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const newElements = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size,
            height: element.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};