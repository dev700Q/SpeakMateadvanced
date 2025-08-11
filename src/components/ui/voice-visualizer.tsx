import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface VoiceVisualizerProps {
  isActive: boolean;
  barCount?: number;
  className?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isActive,
  barCount = 20,
  className = ''
}) => {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setBars(Array.from({ length: barCount }, () => Math.random() * 100));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setBars(Array.from({ length: barCount }, () => 0));
    }
  }, [isActive, barCount]);

  return (
    <div className={`flex items-end justify-center space-x-1 h-16 ${className}`}>
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
          style={{
            width: '3px',
            minHeight: '4px',
          }}
          animate={{
            height: isActive ? `${(bars[index] || 0) * 0.6 + 10}%` : '10%',
          }}
          transition={{
            duration: 0.1,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};