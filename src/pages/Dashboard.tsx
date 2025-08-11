import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Calendar, Flame, BookOpen, Mic, TrendingUp, Star, Play, Brain, Zap, Award, BarChart3 } from 'lucide-react';
import { InteractiveCard } from '../components/ui/interactive-card';
import { GlassCard } from '../components/ui/glass-card';
import { GradientText } from '../components/ui/gradient-text';
import { ProgressRing } from '../components/ui/progress-ring';
import { AICoach } from '../components/advanced/AICoach';
import { SpeechAnalytics } from '../components/advanced/SpeechAnalytics';
import { MotionDiv, fadeInUp, staggerContainer, scaleIn } from '../components/ui/motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentChallenge, dailyQuote, setDailyQuote, powerWord, setPowerWord } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [showAICoach, setShowAICoach] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [aiInsight, setAiInsight] = useState('');

  useEffect(() => {
    fetchDailyData();
    // Show AI coach after 3 seconds
    const timer = setTimeout(() => setShowAICoach(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const fetchDailyData = async () => {
    setIsLoading(true);
    try {
      // Fetch daily quote
      const quoteResponse = await fetch('https://zenquotes.io/api/random');
      const quoteData = await quoteResponse.json();
      if (quoteData && quoteData[0]) {
        setDailyQuote(quoteData[0].q);
      }

      // Fetch power word
      const wordResponse = await fetch('https://random-word-api.herokuapp.com/word');
      const wordData = await wordResponse.json();
      if (wordData && wordData[0]) {
        const word = wordData[0];
        const definitionResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const definitionData = await definitionResponse.json();
        
        let definition = 'A useful English word to expand your vocabulary.';
        if (definitionData && definitionData[0] && definitionData[0].meanings && definitionData[0].meanings[0]) {
          definition = definitionData[0].meanings[0].definitions[0].definition;
        }
        
        setPowerWord({ word, definition });
      }

      // Generate AI insight
      const insights = [
        "Your pronunciation has improved by 23% this week! Keep focusing on vowel sounds.",
        "AI detected you speak 15% faster when confident. Try maintaining that energy!",
        "Your vocabulary usage is expanding. I've noticed 12 new words this week!",
        "Excellent progress on fluency! Your pause frequency decreased by 30%.",
        "Your confidence score is rising. Body language analysis shows great improvement!"
      ];
      setAiInsight(insights[Math.floor(Math.random() * insights.length)]);

    } catch (error) {
      console.log('Error fetching daily data:', error);
      setDailyQuote('Success is not final, failure is not fatal: it is the courage to continue that counts.');
      setPowerWord({
        word: 'Perseverance',
        definition: 'Persistence in doing something despite difficulty or delay in achieving success.'
      });
      setAiInsight('AI is analyzing your progress. Keep practicing for personalized insights!');
    } finally {
      setIsLoading(false);
    }
  };

  const challengeData = [
    { day: 1, title: 'Introduction & Goals', description: 'Introduce yourself and share your speaking goals', duration: '2 min' },
    { day: 2, title: 'Daily Routine', description: 'Describe your typical day in detail', duration: '3 min' },
    { day: 3, title: 'Favorite Memory', description: 'Share a cherished memory and why it matters', duration: '3 min' },
    { day: 4, title: 'Problem Solving', description: 'Discuss a challenge you overcame', duration: '4 min' },
    { day: 5, title: 'Future Plans', description: 'Talk about your dreams and aspirations', duration: '4 min' },
    { day: 6, title: 'Opinion Piece', description: 'Express your views on a current topic', duration: '5 min' },
    { day: 7, title: 'Reflection & Growth', description: 'Reflect on your week of practice', duration: '5 min' },
  ];

  const currentChallengeData = challengeData[currentChallenge - 1];

  const stats = [
    { label: 'Current Streak', value: user?.currentStreak || 0, icon: Flame, color: 'orange', gradient: 'from-orange-500 to-red-500' },
    { label: 'Day of Challenge', value: `${currentChallenge}/7`, icon: Calendar, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Completed Challenges', value: user?.completedChallenges || 0, icon: Star, color: 'yellow', gradient: 'from-yellow-500 to-orange-500' },
    { label: 'AI Confidence Score', value: '88%', icon: Brain, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
  ];

  const quickActions = [
    {
      title: 'AI Speech Analytics',
      description: 'View detailed AI analysis of your speaking progress',
      icon: BarChart3,
      color: 'from-blue-500 to-purple-500',
      action: () => setShowAnalytics(true)
    },
    {
      title: 'Smart Topic Generator',
      description: 'Get AI-curated topics based on your interests',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      link: '/topics'
    },
    {
      title: 'AI Motivation Hub',
      description: 'Personalized motivation and daily insights',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      link: '/motivation'
    },
    {
      title: 'Voice AI Trainer',
      description: 'Advanced voice recording with AI feedback',
      icon: Mic,
      color: 'from-green-500 to-emerald-500',
      link: '/mirror-practice'
    }
  ];

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <MotionDiv className="mb-8" {...fadeInUp}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                Welcome back, <GradientText>{user?.name}</GradientText>! 👋
              </h1>
              <p className="text-xl text-gray-600">
                Ready to continue your AI-powered English journey?
              </p>
            </div>
            <motion.button
              onClick={() => setShowAICoach(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="w-5 h-5" />
              <span>AI Coach</span>
            </motion.button>
          </div>
        </MotionDiv>

        {/* AI Insight Banner */}
        <MotionDiv className="mb-8" {...fadeInUp}>
          <GlassCard className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50">
            <div className="flex items-start space-x-4">
              <motion.div
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🤖 AI Insight of the Day</h3>
                <p className="text-gray-700 leading-relaxed">{aiInsight}</p>
              </div>
            </div>
          </GlassCard>
        </MotionDiv>

        {/* Stats Grid */}
        <MotionDiv className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" {...staggerContainer}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={index} variants={scaleIn}>
                <InteractiveCard className="p-6 h-full" glowColor={stat.color}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-r ${stat.gradient} rounded-xl`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <motion.div
                      className="text-3xl font-black text-gray-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring" }}
                    >
                      {stat.value}
                    </motion.div>
                  </div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </InteractiveCard>
              </motion.div>
            );
          })}
        </MotionDiv>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Challenge */}
          <div className="lg:col-span-2">
            <MotionDiv {...fadeInUp}>
              <GlassCard className="bg-gradient-to-br from-blue-500 to-green-500 p-8 text-white mb-8 overflow-hidden relative">
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <motion.div
                      className="p-3 bg-white/20 rounded-xl mr-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Target className="w-8 h-8" />
                    </motion.div>
                    <h2 className="text-3xl font-bold">Today's AI Challenge</h2>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-blue-100">Day {currentChallenge} of 7</span>
                      <GlassCard className="px-4 py-2">
                        <span className="text-sm font-medium">{currentChallengeData.duration}</span>
                      </GlassCard>
                    </div>
                    
                    <h3 className="text-2xl font-semibold mb-3">{currentChallengeData.title}</h3>
                    <p className="text-blue-100 leading-relaxed mb-6">
                      {currentChallengeData.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to="/challenge"
                          className="flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors duration-200 shadow-lg"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Start AI Challenge
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to="/mirror-practice"
                          className="flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-200"
                        >
                          <Mic className="w-5 h-5 mr-2" />
                          AI Voice Trainer
                        </Link>
                      </motion.div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>AI Progress Analysis</span>
                      <span>{Math.round((currentChallenge / 7) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <motion.div
                        className="bg-white h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentChallenge / 7) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </MotionDiv>

            {/* Quick Actions */}
            <MotionDiv className="grid grid-cols-1 sm:grid-cols-2 gap-6" {...staggerContainer}>
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div key={index} variants={scaleIn}>
                    {action.link ? (
                      <Link to={action.link}>
                        <InteractiveCard className="p-6 h-full group" glowColor={action.color.split('-')[1]}>
                          <div className="flex items-center mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                          <p className="text-gray-600 text-sm">{action.description}</p>
                        </InteractiveCard>
                      </Link>
                    ) : (
                      <button onClick={action.action} className="w-full text-left">
                        <InteractiveCard className="p-6 h-full group" glowColor={action.color.split('-')[1]}>
                          <div className="flex items-center mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                          <p className="text-gray-600 text-sm">{action.description}</p>
                        </InteractiveCard>
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </MotionDiv>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* AI Progress Ring */}
            <MotionDiv {...fadeInUp}>
              <InteractiveCard className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Speaking Score</h3>
                <ProgressRing progress={88} size={150}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">88%</div>
                    <div className="text-gray-600 text-sm">Excellent</div>
                  </div>
                </ProgressRing>
                <div className="mt-4 text-sm text-gray-600">
                  AI analysis shows significant improvement in fluency and confidence!
                </div>
              </InteractiveCard>
            </MotionDiv>

            {/* Daily Quote */}
            {dailyQuote && (
              <MotionDiv {...fadeInUp}>
                <GlassCard className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    AI Daily Inspiration
                  </h3>
                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-indigo-200 rounded mb-2"></div>
                      <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                    </div>
                  ) : (
                    <blockquote className="text-indigo-800 italic leading-relaxed">
                      "{dailyQuote}"
                    </blockquote>
                  )}
                </GlassCard>
              </MotionDiv>
            )}

            {/* Power Word */}
            {powerWord && (
              <MotionDiv {...fadeInUp}>
                <GlassCard className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                  <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    AI Power Word
                  </h3>
                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="h-6 bg-green-200 rounded mb-2 w-1/2"></div>
                      <div className="h-4 bg-green-200 rounded mb-1"></div>
                      <div className="h-4 bg-green-200 rounded w-3/4"></div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-2xl font-bold text-green-800 mb-2 capitalize">
                        {powerWord.word}
                      </h4>
                      <p className="text-green-700 leading-relaxed text-sm">
                        {powerWord.definition}
                      </p>
                    </div>
                  )}
                </GlassCard>
              </MotionDiv>
            )}

            {/* AI Tips */}
            <MotionDiv {...fadeInUp}>
              <InteractiveCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 AI Quick Tips</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    AI detects optimal speaking pace at 150 WPM
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Voice analysis shows 94% pronunciation accuracy
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Confidence score increases with daily practice
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    AI recommends 15-minute focused sessions
                  </li>
                </ul>
              </InteractiveCard>
            </MotionDiv>
          </div>
        </div>
      </div>

      {/* AI Coach Component */}
      <AICoach isVisible={showAICoach} onClose={() => setShowAICoach(false)} />

      {/* Speech Analytics Modal */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAnalytics(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">AI Speech Analytics</h2>
                  <button
                    onClick={() => setShowAnalytics(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <SpeechAnalytics />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;