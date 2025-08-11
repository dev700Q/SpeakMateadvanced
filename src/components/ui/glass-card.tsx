import React from 'react';
import { cn } from '../lib/utils/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  blur = 'md',
  opacity = 0.1 
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  return (
    <div 
      className={cn(
        'bg-white/10 border border-white/20 rounded-2xl shadow-2xl',
        blurClasses[blur],
        className
      )}
      style={{ backgroundColor: `rgba(255, 255, 255, ${opacity})` }}
    >
      {children}
    </div>
  );
};