import React from 'react';
import { cn } from '../lib/utils/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'primary' | 'secondary' | 'accent' | 'rainbow';
}

export const GradientText: React.FC<GradientTextProps> = ({ 
  children, 
  className,
  gradient = 'primary' 
}) => {
  const gradients = {
    primary: 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600',
    secondary: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
    accent: 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600',
    rainbow: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500'
  };

  return (
    <span 
      className={cn(
        'bg-clip-text text-transparent font-bold',
        gradients[gradient],
        className
      )}
    >
      {children}
    </span>
  );
};