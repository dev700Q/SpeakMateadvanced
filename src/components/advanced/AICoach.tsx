import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, MessageCircle, Lightbulb, TrendingUp, Star, Zap } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';
import { GradientText } from '../ui/gradient-text';

interface AICoachProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AICoach: React.FC<AICoachProps> = ({ isVisible, onClose }) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const tips = [
    {
      icon: Brain,
      title: "Smart Feedback",
      message: "I've analyzed your speaking pattern. Try to slow down by 15% for better clarity.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Lightbulb,
      title: "Pronunciation Tip",
      message: "Focus on the 'th' sound in 'think'. Place your tongue between your teeth.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: TrendingUp,
      title: "Progress Update",
      message: "Great improvement! Your confidence score increased by 23% this week.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Star,
      title: "Achievement Unlocked",
      message: "Congratulations! You've maintained a 7-day speaking streak!",
      color: "from-purple-500 to-pink-500"
    }
  ];

  useEffect(() => {
    if (isVisible) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, currentTip]);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const currentTipData = tips[currentTip];
  const Icon = currentTipData.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <GlassCard className="p-6 backdrop-blur-xl bg-white/90 border-2 border-white/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl bg-gradient-to-r ${currentTipData.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Coach</h3>
                  <p className="text-sm text-gray-600">{currentTipData.title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              {isTyping ? (
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
                </div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-700 leading-relaxed"
                >
                  {currentTipData.message}
                </motion.p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={nextTip}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-sm"
              >
                <Zap className="w-4 h-4" />
                <span>Next Tip</span>
              </button>
              <div className="flex space-x-1">
                {tips.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTip ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};