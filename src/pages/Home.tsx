import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Mic, Target, Camera, MessageSquare, BookOpen, Star, ChevronLeft, ChevronRight, 
  Play, Users, TrendingUp, Award, CheckCircle, ArrowRight, Sparkles, Globe,
  Clock, Zap, Heart, Shield, Volume2, VolumeX, Brain, Rocket, Trophy
} from 'lucide-react';
import { FloatingElements } from '../components/ui/floating-elements';
import { GlassCard } from '../components/ui/glass-card';
import { GradientText } from '../components/ui/gradient-text';
import { InteractiveCard } from '../components/ui/interactive-card';
import { MotionDiv, MotionSection, fadeInUp, staggerContainer, scaleIn } from '../components/ui/motion';
import dipakImage from '../assets/Dipak Post.png';
import IshanImage from '../assets/Ishan.png';
import ArnikaImage from '../assets/Arnika.png';
import MeeraImage from '../assets/MeeraImage.png';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  // Creative States
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Creative animated words
  const animatedWords = [
    "Confident Speaker",
    "English Master", 
    "Communication Expert",
    "Fluent Communicator",
    "Speaking Champion"
  ];

  // Enhanced features with creative descriptions
  const features = [
    {
      icon: Brain,
      title: '🧠 AI-Powered Learning',
      description: 'Advanced AI analyzes your speech patterns and provides personalized feedback to accelerate your learning journey',
      color: 'from-blue-500 via-cyan-400 to-teal-500',
      delay: '0ms',
      emoji: '🚀'
    },
    {
      icon: Camera,
      title: '🎭 Smart Mirror Practice',
      description: 'Revolutionary mirror technology with real-time body language analysis and confidence scoring',
      color: 'from-green-500 via-emerald-400 to-lime-500',
      delay: '100ms',
      emoji: '✨'
    },
    {
      icon: MessageSquare,
      title: '💬 Dynamic Topic Engine',
      description: 'AI-curated conversation topics that adapt to your interests and skill level for engaging practice',
      color: 'from-purple-500 via-pink-400 to-rose-500',
      delay: '200ms',
      emoji: '🎪'
    },
    {
      icon: Trophy,
      title: '🏆 Gamified Progress',
      description: 'Achievement system with rewards, streaks, and challenges that make learning addictive and fun',
      color: 'from-orange-500 via-amber-400 to-yellow-500',
      delay: '300ms',
      emoji: '🎨'
    }
  ];

  // Creative testimonials with more personality
  const testimonials = [
    {
      name: 'Sarah Gupta',
      role: 'College Student & Future CEO',
      content: 'SpeakMate\'s AI coach is incredible! It spotted my pronunciation issues and helped me fix them in just 3 days. Now I lead presentations with confidence! 🌟',
      rating: 5,
      image: ArnikaImage,
      achievement: '🏆 Presentation Champion',
      improvement: '+45% confidence'
    },
    {
      name: 'Mike Chen',
      role: 'Tech Entrepreneur',
      content: 'The speech analytics dashboard is mind-blowing! I can see my progress in real-time. My startup pitch went from disaster to standing ovation! 🚀',
      rating: 5,
      image: IshanImage,
      achievement: '💼 Pitch Perfect',
      improvement: '+60% fluency'
    },
    {
      name: 'Priya Patel',
      role: 'ESL Teacher & Language Coach',
      content: 'As a teacher, I\'ve never seen anything like this. The AI feedback is more detailed than human tutors. My students are obsessed! 🎯',
      rating: 5,
      image: MeeraImage,
      achievement: '👩‍🏫 Teacher\'s Choice',
      improvement: '+80% engagement'
    },
    {
      name: 'Dipak Maurya',
      role: 'Aspiring Professional',
      content: 'The voice visualizer and advanced recording features transformed my practice sessions. I can literally see my improvement! 🎯',
      rating: 5,
      image: dipakImage,
      achievement: '🏆 Confident Communicator',
      improvement: '+55% clarity'
    }
  ];

  // Creative stats with animations
  const stats = [
    { number: '100,000+', label: 'AI-Trained Speakers', icon: Users, color: 'text-blue-500', emoji: '🤖' },
    { number: '5M+', label: 'Smart Sessions', icon: Brain, color: 'text-green-500', emoji: '🧠' },
    { number: '98%', label: 'Success Rate', icon: TrendingUp, color: 'text-purple-500', emoji: '📈' },
    { number: '4.9/5', label: 'AI Rating', icon: Star, color: 'text-yellow-500', emoji: '⭐' }
  ];

  // Initialize creative elements
  useEffect(() => {
    setIsVisible(true);
    
    // Mouse tracking for creative effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animated word typing effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTyping) {
        setIsTyping(false);
        setTimeout(() => {
          setCurrentWord((prev) => (prev + 1) % animatedWords.length);
          setIsTyping(true);
        }, 500);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isTyping]);

  // Creative sound toggle
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (audioRef.current) {
      if (soundEnabled) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  // Testimonial navigation
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      <FloatingElements />

      {/* Creative Sound Control */}
      <motion.button
        onClick={toggleSound}
        className="fixed top-20 right-4 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </motion.button>

      {/* Hidden Audio for Ambience */}
      <audio ref={audioRef} loop>
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" type="audio/wav" />
      </audio>

      {/* HERO SECTION - Ultra Creative */}
      <MotionSection 
        ref={heroRef} 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y }}
      >
        {/* Creative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50 animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center z-10">
          <MotionDiv {...fadeInUp}>
            
            {/* Creative Badge */}
            <motion.div 
              className="inline-flex items-center bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-md border border-white/30 rounded-full px-8 py-3 mb-8"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.3)',
                  '0 0 40px rgba(147, 51, 234, 0.5)',
                  '0 0 20px rgba(59, 130, 246, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 mr-3 text-yellow-300 animate-spin" />
              <span className="text-white/90 font-medium">🚀 Join 100,000+ AI-Powered Speakers!</span>
              <Sparkles className="w-5 h-5 ml-3 text-yellow-300 animate-spin" />
            </motion.div>

            {/* Ultra Creative Headline */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight">
              <motion.span 
                className="block text-white"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Master English with
              </motion.span>
              <motion.span 
                className="block"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <GradientText gradient="rainbow" className="text-6xl md:text-8xl lg:text-9xl">
                  <motion.span
                    key={currentWord}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    AI Power! 🤖
                  </motion.span>
                </GradientText>
              </motion.span>
            </h1>

            {/* Creative Subheadline */}
            <motion.p 
              className="text-2xl md:text-3xl lg:text-4xl mb-12 text-cyan-100 max-w-5xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              🌟 Revolutionary AI analyzes your speech in real-time, provides 
              <GradientText className="text-2xl md:text-3xl lg:text-4xl mx-2">
                personalized coaching
              </GradientText>
              and transforms you into a 
              <GradientText className="text-2xl md:text-3xl lg:text-4xl mx-2">
                confident speaker!
              </GradientText>
            </motion.p>

            {/* Creative CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {user ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/dashboard"
                    className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-full font-bold text-xl hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      🚀 Continue AI Journey
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/signup"
                      className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-full font-bold text-xl hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        🤖 Start AI Training FREE!
                        <Rocket className="w-6 h-6 ml-3 group-hover:scale-125 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/login"
                      className="group px-12 py-6 border-3 border-white/40 text-white rounded-full font-bold text-xl hover:bg-white hover:text-purple-900 transition-all duration-300 backdrop-blur-md hover:border-white"
                    >
                      <span className="flex items-center">
                        ✨ Sign In & Continue
                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Creative Trust Indicators */}
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-8 text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <GlassCard className="flex items-center px-6 py-3">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                <span>🆓 100% Free AI Training</span>
              </GlassCard>
              <GlassCard className="flex items-center px-6 py-3">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                <span>⏰ 5 Min Daily Sessions</span>
              </GlassCard>
              <GlassCard className="flex items-center px-6 py-3">
                <Award className="w-5 h-5 mr-2 text-yellow-400" />
                <span>🏆 AI-Powered Results</span>
              </GlassCard>
            </motion.div>
          </MotionDiv>
        </div>

        {/* Creative Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <GlassCard className="w-8 h-12 rounded-full flex justify-center p-2">
            <motion.div 
              className="w-2 h-4 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </GlassCard>
          <p className="text-white/60 text-sm mt-2 text-center">Scroll for AI Magic ✨</p>
        </motion.div>
      </MotionSection>

      {/* CREATIVE STATS SECTION */}
      <MotionSection className="py-24 bg-gradient-to-r from-white via-cyan-50 to-purple-50 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv className="text-center mb-16" {...fadeInUp}>
            <GradientText className="text-5xl md:text-6xl font-black mb-6">
              🤖 AI-Powered Results That Speak!
            </GradientText>
            <p className="text-2xl text-gray-600">Join the AI revolution in language learning!</p>
          </MotionDiv>

          <MotionDiv className="grid grid-cols-2 lg:grid-cols-4 gap-8" {...staggerContainer}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center group"
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                >
                  <InteractiveCard className="p-8 h-full" glowColor={stat.color.replace('text-', '').replace('-500', '')}>
                    <motion.div 
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.div 
                      className="text-4xl md:text-5xl font-black text-gray-900 mb-3"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-gray-600 font-bold text-lg">{stat.label}</div>
                    <div className="text-3xl mt-2">{stat.emoji}</div>
                  </InteractiveCard>
                </motion.div>
              );
            })}
          </MotionDiv>
        </div>
      </MotionSection>

      {/* ULTRA CREATIVE FEATURES SECTION */}
      <MotionSection className="py-32 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv className="text-center mb-20" {...fadeInUp}>
            <GlassCard className="inline-flex items-center px-8 py-3 mb-8 border border-white/20">
              <Zap className="w-5 h-5 mr-2 text-yellow-300 animate-pulse" />
              <span className="text-white font-medium">🚀 Revolutionary AI Features</span>
            </GlassCard>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
              Experience the
              <span className="block">
                <GradientText className="text-5xl md:text-6xl lg:text-7xl">
                  Future of Learning! 🌟
                </GradientText>
              </span>
            </h2>
            <p className="text-2xl md:text-3xl text-cyan-100 max-w-4xl mx-auto leading-relaxed">
              Our AI-powered platform provides everything you need to become an 
              <GradientText className="text-2xl md:text-3xl mx-2">
                unstoppable English speaker!
              </GradientText>
            </p>
          </MotionDiv>

          <MotionDiv className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16" {...staggerContainer}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -10, rotateX: 5 }}
                  className="group relative"
                >
                  <GlassCard className="p-10 lg:p-12 backdrop-blur-lg border border-white/20 overflow-hidden h-full">
                    {/* Creative Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>
                    
                    {/* Floating Emoji */}
                    <motion.div 
                      className="absolute top-4 right-4 text-4xl"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {feature.emoji}
                    </motion.div>
                    
                    {/* Icon */}
                    <motion.div 
                      className={`relative w-24 h-24 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-8 shadow-2xl`}
                      whileHover={{ scale: 1.2, rotate: 12 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-12 h-12 text-white" />
                    </motion.div>
                    
                    {/* Content */}
                    <div className="relative">
                      <h3 className="text-3xl lg:text-4xl font-black text-white mb-6 group-hover:text-cyan-300 transition-colors duration-500">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-500">
                        {feature.description}
                      </p>
                    </div>

                    {/* Creative Hover Arrow */}
                    <motion.div 
                      className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100"
                      initial={{ x: 20 }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="w-8 h-8 text-cyan-400 animate-pulse" />
                    </motion.div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </MotionDiv>
        </div>
      </MotionSection>

      {/* CREATIVE TESTIMONIALS SECTION */}
      <MotionSection className="py-32 bg-gradient-to-br from-cyan-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv className="text-center mb-20" {...fadeInUp}>
            <GlassCard className="inline-flex items-center px-8 py-3 mb-8 border border-white/20">
              <Users className="w-5 h-5 mr-2 text-pink-300" />
              <span className="text-white font-medium">💬 AI Success Stories</span>
            </GlassCard>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Real People, Real
              <span className="block">
                <GradientText className="text-5xl md:text-6xl">
                  AI-Powered Results! 🎉
                </GradientText>
              </span>
            </h2>
            <p className="text-2xl text-cyan-100 max-w-3xl mx-auto">
              Join thousands of learners who transformed their lives with AI-powered coaching
            </p>
          </MotionDiv>

          <MotionDiv className="relative" {...fadeInUp}>
            <GlassCard className="backdrop-blur-xl p-10 md:p-16 border border-white/20 shadow-2xl">
              {/* Creative Stars */}
              <div className="flex items-center justify-center mb-8">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <Star className="w-10 h-10 text-yellow-400 fill-current mx-1" />
                  </motion.div>
                ))}
              </div>
              
              {/* Quote with Creative Styling */}
              <motion.blockquote 
                className="text-2xl md:text-3xl lg:text-4xl text-white text-center mb-12 leading-relaxed font-light italic relative"
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-6xl text-cyan-400 absolute -top-4 -left-4 opacity-50">"</span>
                {testimonials[currentTestimonial].content}
                <span className="text-6xl text-cyan-400 absolute -bottom-8 -right-4 opacity-50">"</span>
              </motion.blockquote>
              
              {/* Author with Achievement Badge */}
              <motion.div 
                className="flex items-center justify-center"
                key={`author-${currentTestimonial}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 rounded-full mr-6 border-4 border-white/30 shadow-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                />
                <div className="text-center">
                  <div className="font-black text-white text-2xl mb-1">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-cyan-200 text-lg mb-2">
                    {testimonials[currentTestimonial].role}
                  </div>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-1 rounded-full text-sm font-bold mb-2">
                    {testimonials[currentTestimonial].achievement}
                  </div>
                  <div className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {testimonials[currentTestimonial].improvement}
                  </div>
                </div>
              </motion.div>
            </GlassCard>

            {/* Creative Navigation */}
            <motion.button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 backdrop-blur-sm rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center text-white border-2 border-white/20"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-8 h-8" />
            </motion.button>
            
            <motion.button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center text-white border-2 border-white/20"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-8 h-8" />
            </motion.button>

            {/* Creative Dots */}
            <div className="flex justify-center mt-12 space-x-4">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-400 scale-150 shadow-lg'
                      : 'bg-white/30 hover:bg-white/50 hover:scale-125'
                  }`}
                  whileHover={{ scale: index === currentTestimonial ? 1.5 : 1.25 }}
                  whileTap={{ scale: 1 }}
                />
              ))}
            </div>
          </MotionDiv>
        </div>
      </MotionSection>

      {/* FINAL CREATIVE CTA SECTION */}
      <MotionSection className="py-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionDiv {...fadeInUp}>
            <GlassCard className="inline-flex items-center px-8 py-3 mb-8 border border-white/30">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-300 animate-spin" />
              <span className="text-white font-medium">🎯 Ready for AI Transformation?</span>
              <Sparkles className="w-5 h-5 ml-2 text-yellow-300 animate-spin" />
            </GlassCard>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
              Your AI-Powered
              <span className="block">
                <GradientText className="text-5xl md:text-6xl lg:text-7xl">
                  Speaking Revolution Starts NOW! 🚀
                </GradientText>
              </span>
            </h2>
            
            <p className="text-2xl md:text-3xl text-cyan-100 mb-12 leading-relaxed">
              Join thousands of learners who are already improving with AI-powered coaching.
              <span className="block text-yellow-300 font-bold mt-4">
                Your AI transformation is just one click away! ✨
              </span>
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="group relative px-16 py-6 bg-white text-purple-600 rounded-full font-black text-2xl hover:bg-yellow-300 hover:text-purple-800 transition-all duration-300 shadow-2xl hover:shadow-white/25 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <Brain className="w-8 h-8 mr-3 animate-pulse" />
                      🤖 START AI TRAINING FREE!
                      <ArrowRight className="w-8 h-8 ml-3 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
                
                <GlassCard className="text-white/80 text-lg flex items-center px-6 py-3">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-400" />
                  💯 No credit card • Instant AI access
                </GlassCard>
              </div>
            )}

            {/* Creative Benefits List */}
            <MotionDiv className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16" {...staggerContainer}>
              <motion.div variants={scaleIn}>
                <GlassCard className="p-6 border border-white/20">
                  <div className="text-4xl mb-3">🤖</div>
                  <div className="text-white font-bold text-lg">AI-Powered Analysis</div>
                  <div className="text-cyan-200">Real-time speech coaching</div>
                </GlassCard>
              </motion.div>
              <motion.div variants={scaleIn}>
                <GlassCard className="p-6 border border-white/20">
                  <div className="text-4xl mb-3">🎯</div>
                  <div className="text-white font-bold text-lg">Proven AI Results</div>
                  <div className="text-cyan-200">98% success rate guaranteed</div>
                </GlassCard>
              </motion.div>
              <motion.div variants={scaleIn}>
                <GlassCard className="p-6 border border-white/20">
                  <div className="text-4xl mb-3">🌟</div>
                  <div className="text-white font-bold text-lg">Smart AI Support</div>
                  <div className="text-cyan-200">Personalized guidance 24/7</div>
                </GlassCard>
              </motion.div>
            </MotionDiv>
          </MotionDiv>
        </div>
      </MotionSection>

      {/* CREATIVE FOOTER */}
      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 text-white py-20 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div 
              className="flex items-center justify-center space-x-4 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <GlassCard className="p-4 rounded-2xl shadow-2xl">
                <Mic className="w-10 h-10 text-white" />
              </GlassCard>
              <GradientText className="text-4xl font-black">
                SpeakMate AI
              </GradientText>
              <motion.div 
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🤖
              </motion.div>
            </motion.div>
            
            <p className="text-gray-300 mb-8 text-xl max-w-3xl mx-auto leading-relaxed">
              Your AI-powered English speaking companion for building confidence and fluency.
              <span className="block text-cyan-300 font-bold mt-2">
                Empowering learners worldwide with artificial intelligence! 🌟
              </span>
            </p>
            
            <MotionDiv className="flex items-center justify-center space-x-8 mb-8 text-gray-400" {...staggerContainer}>
              <motion.div variants={scaleIn}>
                <GlassCard className="flex items-center px-6 py-3">
                  <Globe className="w-5 h-5 mr-2 text-cyan-400" />
                  <span>🌍 50+ Countries</span>
                </GlassCard>
              </motion.div>
              <motion.div variants={scaleIn}>
                <GlassCard className="flex items-center px-6 py-3">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  <span>👥 100,000+ AI Learners</span>
                </GlassCard>
              </motion.div>
              <motion.div variants={scaleIn}>
                <GlassCard className="flex items-center px-6 py-3">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  <span>🏆 AI-Expert Designed</span>
                </GlassCard>
              </motion.div>
            </MotionDiv>
            
            <div className="text-sm text-gray-500 border-t border-gray-800 pt-8">
              © 2025 SpeakMate AI. Made with ❤️ and 🤖 for English learners worldwide. 
              <span className="block mt-2 text-cyan-400">
                🌟 Transform your speaking skills with AI today! 🌟
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;