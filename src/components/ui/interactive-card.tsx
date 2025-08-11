import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils/utils';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  tapScale?: number;
  glowColor?: string;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className,
  hoverScale = 1.02,
  tapScale = 0.98,
  glowColor = 'blue'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const glowColors = {
    blue: 'shadow-blue-500/25',
    purple: 'shadow-purple-500/25',
    green: 'shadow-green-500/25',
    pink: 'shadow-pink-500/25',
    orange: 'shadow-orange-500/25'
  };

  return (
    <motion.div
      className={cn(
        'bg-white rounded-2xl shadow-lg border border-gray-100 cursor-pointer transition-all duration-300',
        isHovered && `shadow-2xl ${glowColors[glowColor as keyof typeof glowColors]}`,
        className
      )}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {children}
    </motion.div>
  );
};