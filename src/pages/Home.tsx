import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Mic, Target, Camera, MessageSquare, BookOpen, Star, ChevronLeft, ChevronRight, 
  Play, Users, TrendingUp, Award, CheckCircle, ArrowRight, Sparkles, Globe,
  Clock, Zap, Heart, Shield, Volume2, VolumeX
} from 'lucide-react';
import dipakImage from '../assets/Dipak Post.png'
import IshanImage from '../assets/Ishan.png'
import ArnikaImage from '../assets/Arnika.png'
import MeeraImage from '../assets/MeeraImage.png'

const Home: React.FC = () => {
  const { user } = useAuth();
  
  // Creative States
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [floatingElements, setFloatingElements] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  
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
      icon: Target,
      title: '🎯 AI-Powered 7-Day Challenge',
      description: 'Transform your speaking skills with our revolutionary daily challenges that adapt to your progress and personality',
      color: 'from-blue-500 via-cyan-400 to-teal-500',
      delay: '0ms',
      emoji: '🚀'
    },
    {
      icon: Camera,
      title: '🎭 Magic Mirror Practice',
      description: 'Practice with our intelligent mirror that gives real-time feedback on your body language and confidence',
      color: 'from-green-500 via-emerald-400 to-lime-500',
      delay: '100ms',
      emoji: '✨'
    },
    {
      icon: MessageSquare,
      title: '💬 Smart Topic Generator',
      description: 'Never run out of things to say with our AI-powered conversation starter that matches your interests',
      color: 'from-purple-500 via-pink-400 to-rose-500',
      delay: '200ms',
      emoji: '🎪'
    },
    {
      icon: BookOpen,
      title: '🌟 Daily Motivation Hub',
      description: 'Get personalized motivation, power words, and success stories delivered fresh every single day',
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
      content: 'SpeakMate didn\'t just improve my English - it gave me superpowers! I went from shy student to confident presenter in just 7 days. Now I\'m leading student council meetings! 🌟',
      rating: 5,
      image: ArnikaImage,
      achievement: '🏆 Presentation Champion'
    },
    {
      name: 'Mike Chen',
      role: 'Tech Entrepreneur',
      content: 'The mirror practice is GENIUS! I can literally see myself becoming more confident. My startup pitch went from disaster to standing ovation! 🚀',
      rating: 5,
      image: IshanImage,
      achievement: '💼 Pitch Perfect'
    },
    {
      name: 'Priya Patel',
      role: 'ESL Teacher & Language Coach',
      content: 'As a teacher, I\'ve tried everything. SpeakMate is the ONLY app that makes learning fun AND effective. My students are obsessed! 🎯',
      rating: 5,
      image: MeeraImage,
      achievement: '👩‍🏫 Teacher\'s Choice'
    },
    {
      name: 'Dipak Maurya',
      role: 'Aspiring Professional',
      content: 'SpeakMate turned my nervous pauses into smooth conversations! Now I speak with confidence in meetings and interviews. Truly a game-changer for my career. 🎯',
      rating: 5,
      image: dipakImage,
      achievement: '🏆 Confident Communicator'
    }
  ];

  // Creative stats with animations
  const stats = [
    { number: '50,000+', label: 'Happy Speakers', icon: Users, color: 'text-blue-500', emoji: '😊' },
    { number: '1M+', label: 'Practice Sessions', icon: Mic, color: 'text-green-500', emoji: '🎤' },
    { number: '95%', label: 'Success Rate', icon: TrendingUp, color: 'text-purple-500', emoji: '📈' },
    { number: '4.9/5', label: 'User Rating', icon: Star, color: 'text-yellow-500', emoji: '⭐' }
  ];

  // Initialize creative elements
  useEffect(() => {
    setIsVisible(true);
    
    // Create floating elements
    const elements = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setFloatingElements(elements);

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

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.observe-me');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
      {/* Creative Background with Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient-shift"></div>
        
        {/* Floating Creative Elements */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute w-4 h-4 bg-white/10 rounded-full animate-float-creative"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}

        {/* Interactive Cursor Effect */}
        <div 
          className="fixed w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-150 ease-out"
          style={{
            left: mousePosition.x - 16,
            top: mousePosition.y - 16,
            transform: `scale(${mousePosition.x > 0 ? 1 : 0})`
          }}
        />
      </div>

      {/* Creative Sound Control */}
      <button
        onClick={toggleSound}
        className="fixed top-20 right-4 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
      >
        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {/* Hidden Audio for Ambience */}
      <audio ref={audioRef} loop>
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" type="audio/wav" />
      </audio>

      {/* HERO SECTION - Ultra Creative */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Creative Particles */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-twinkle-creative"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Creative Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-md border border-white/30 rounded-full px-8 py-3 mb-8 animate-bounce-gentle">
              <Sparkles className="w-5 h-5 mr-3 text-yellow-300 animate-spin-slow" />
              <span className="text-white/90 font-medium">🚀 Join 50,000+ Confident Speakers Worldwide!</span>
              <Sparkles className="w-5 h-5 ml-3 text-yellow-300 animate-spin-slow" />
            </div>

            {/* Ultra Creative Headline */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight">
              <span className="block text-white animate-slide-in-left">Become a</span>
              <span className="block bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-slide-in-right">
                <span className={`transition-all duration-500 ${isTyping ? 'opacity-100' : 'opacity-0'}`}>
                  {animatedWords[currentWord]}
                </span>
              </span>
              <span className="block text-white/90 text-4xl md:text-5xl lg:text-6xl mt-6 animate-fade-in-delayed">
                in Just 7 Days! 🎯
              </span>
            </h1>

            {/* Creative Subheadline */}
            <p className="text-2xl md:text-3xl lg:text-4xl mb-12 text-cyan-100 max-w-5xl mx-auto leading-relaxed animate-fade-in-up">
              🌟 Transform your English speaking confidence with our 
              <span className="text-yellow-300 font-bold"> revolutionary AI-powered </span>
              daily challenges, magic mirror practice, and 
              <span className="text-pink-300 font-bold"> personalized motivation system! </span>
            </p>

            {/* Creative CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up-delayed">
              {user ? (
                <Link
                  to="/dashboard"
                  className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-full font-bold text-xl hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-110 hover:-translate-y-2 animate-pulse-glow"
                >
                  <span className="relative z-10 flex items-center">
                    🚀 Continue Your Amazing Journey
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-full font-bold text-xl hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-110 hover:-translate-y-2 animate-pulse-glow"
                  >
                    <span className="relative z-10 flex items-center">
                      🎯 Start FREE Challenge Now!
                      <Play className="w-6 h-6 ml-3 group-hover:scale-125 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link
                    to="/login"
                    className="group px-12 py-6 border-3 border-white/40 text-white rounded-full font-bold text-xl hover:bg-white hover:text-purple-900 transition-all duration-300 backdrop-blur-md hover:border-white transform hover:scale-105 hover:shadow-2xl"
                  >
                    <span className="flex items-center">
                      ✨ Sign In & Continue
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* Creative Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/70 animate-fade-in-up-delayed">
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                <span>🆓 100% Free to Start</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                <span>⏰ Just 10 Min Daily</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3">
                <Award className="w-5 h-5 mr-2 text-yellow-400" />
                <span>🏆 Expert Designed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Creative Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-creative">
          <div className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-md">
            <div className="w-2 h-4 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mt-2 animate-pulse"></div>
          </div>
          <p className="text-white/60 text-sm mt-2">Scroll for Magic ✨</p>
        </div>
      </section>

      {/* CREATIVE STATS SECTION */}
      <section className="py-24 bg-gradient-to-r from-white via-cyan-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/20 to-purple-100/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 observe-me">
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text mb-6">
              🎉 Amazing Results Speak for Themselves!
            </h2>
            <p className="text-2xl text-gray-600">Join thousands who transformed their lives!</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="observe-me text-center group hover:scale-110 transition-all duration-500 bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-purple-200"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:rotate-12">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-gray-900 mb-3 counter-animation">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-bold text-lg">{stat.label}</div>
                  <div className="text-3xl mt-2">{stat.emoji}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ULTRA CREATIVE FEATURES SECTION */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20"></div>
        
        {/* Creative Background Elements */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-float-random"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 observe-me">
            <div className="inline-flex items-center bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-md rounded-full px-8 py-3 mb-8 border border-white/20">
              <Zap className="w-5 h-5 mr-2 text-yellow-300 animate-pulse" />
              <span className="text-white font-medium">🚀 Revolutionary Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
              Experience the
              <span className="block bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                Future of Learning! 🌟
              </span>
            </h2>
            <p className="text-2xl md:text-3xl text-cyan-100 max-w-4xl mx-auto leading-relaxed">
              Our AI-powered platform provides everything you need to become an 
              <span className="text-yellow-300 font-bold"> unstoppable English speaker! </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="observe-me group relative p-10 lg:p-12 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-700 transform hover:-translate-y-4 border border-white/20 overflow-hidden"
                  style={{ animationDelay: feature.delay }}
                >
                  {/* Creative Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>
                  
                  {/* Floating Emoji */}
                  <div className="absolute top-4 right-4 text-4xl animate-bounce-gentle group-hover:animate-spin-slow transition-all duration-500">
                    {feature.emoji}
                  </div>
                  
                  {/* Icon */}
                  <div className={`relative w-24 h-24 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  
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
                  <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <ArrowRight className="w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>

                  {/* Creative Border Animation */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-cyan-400/50 transition-all duration-500"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CREATIVE TESTIMONIALS SECTION */}
      <section className="py-32 bg-gradient-to-br from-cyan-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Creative Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 observe-me">
            <div className="inline-flex items-center bg-gradient-to-r from-pink-500/20 to-cyan-500/20 backdrop-blur-md rounded-full px-8 py-3 mb-8 border border-white/20">
              <Users className="w-5 h-5 mr-2 text-pink-300" />
              <span className="text-white font-medium">💬 Success Stories</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Real People, Real
              <span className="block bg-gradient-to-r from-pink-300 to-cyan-300 bg-clip-text text-transparent">
                Amazing Results! 🎉
              </span>
            </h2>
            <p className="text-2xl text-cyan-100 max-w-3xl mx-auto">
              Join thousands of learners who transformed their lives with SpeakMate
            </p>
          </div>

          <div className="relative observe-me">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 md:p-16 border border-white/20 shadow-2xl">
              {/* Creative Stars */}
              <div className="flex items-center justify-center mb-8">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-10 h-10 text-yellow-400 fill-current mx-1 animate-twinkle-creative" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              
              {/* Quote with Creative Styling */}
              <blockquote className="text-2xl md:text-3xl lg:text-4xl text-white text-center mb-12 leading-relaxed font-light italic relative">
                <span className="text-6xl text-cyan-400 absolute -top-4 -left-4 opacity-50">"</span>
                {testimonials[currentTestimonial].content}
                <span className="text-6xl text-cyan-400 absolute -bottom-8 -right-4 opacity-50">"</span>
              </blockquote>
              
              {/* Author with Achievement Badge */}
              <div className="flex items-center justify-center">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 rounded-full mr-6 border-4 border-white/30 shadow-xl"
                />
                <div className="text-center">
                  <div className="font-black text-white text-2xl mb-1">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-cyan-200 text-lg mb-2">
                    {testimonials[currentTestimonial].role}
                  </div>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                    {testimonials[currentTestimonial].achievement}
                  </div>
                </div>
              </div>
            </div>

            {/* Creative Navigation */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 backdrop-blur-sm rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center text-white hover:scale-110 border-2 border-white/20"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center text-white hover:scale-110 border-2 border-white/20"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Creative Dots */}
            <div className="flex justify-center mt-12 space-x-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-400 scale-150 shadow-lg'
                      : 'bg-white/30 hover:bg-white/50 hover:scale-125'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CREATIVE CTA SECTION */}
      <section className="py-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Creative Animated Background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle-creative"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="observe-me">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-8 py-3 mb-8 border border-white/30">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-300 animate-spin-slow" />
              <span className="text-white font-medium">🎯 Ready to Transform?</span>
              <Sparkles className="w-5 h-5 ml-2 text-yellow-300 animate-spin-slow" />
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
              Your English Speaking
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Adventure Starts NOW! 🚀
              </span>
            </h2>
            
            <p className="text-2xl md:text-3xl text-cyan-100 mb-12 leading-relaxed">
              Join thousands of learners who are already improving their English speaking confidence every day.
              <span className="block text-yellow-300 font-bold mt-4">
                Your transformation is just one click away! ✨
              </span>
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <Link
                  to="/signup"
                  className="group relative px-16 py-6 bg-white text-purple-600 rounded-full font-black text-2xl hover:bg-yellow-300 hover:text-purple-800 transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:scale-110 hover:-translate-y-2 animate-pulse-glow"
                >
                  <span className="relative z-10 flex items-center">
                    <Mic className="w-8 h-8 mr-3 animate-bounce" />
                    🎯 START FREE CHALLENGE!
                    <ArrowRight className="w-8 h-8 ml-3 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Link>
                
                <div className="text-white/80 text-lg flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-400" />
                  💯 No credit card required
                </div>
              </div>
            )}

            {/* Creative Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-3">⚡</div>
                <div className="text-white font-bold text-lg">Instant Access</div>
                <div className="text-cyan-200">Start practicing immediately</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-3">🎯</div>
                <div className="text-white font-bold text-lg">Proven Results</div>
                <div className="text-cyan-200">95% success rate guaranteed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-3">🌟</div>
                <div className="text-white font-bold text-lg">Expert Support</div>
                <div className="text-cyan-200">AI-powered guidance 24/7</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CREATIVE FOOTER */}
      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20"></div>
        
        {/* Creative Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-float-creative"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="p-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl shadow-2xl">
                <Mic className="w-10 h-10 text-white" />
              </div>
              <span className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                SpeakMate
              </span>
              <div className="text-3xl animate-bounce">🚀</div>
            </div>
            
            <p className="text-gray-300 mb-8 text-xl max-w-3xl mx-auto leading-relaxed">
              Your daily English speaking companion for building confidence and fluency.
              <span className="block text-cyan-300 font-bold mt-2">
                Empowering learners worldwide to speak with confidence! 🌟
              </span>
            </p>
            
            <div className="flex items-center justify-center space-x-8 mb-8 text-gray-400">
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3">
                <Globe className="w-5 h-5 mr-2 text-cyan-400" />
                <span>🌍 50+ Countries</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3">
                <Users className="w-5 h-5 mr-2 text-purple-400" />
                <span>👥 50,000+ Learners</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3">
                <Award className="w-5 h-5 mr-2 text-yellow-400" />
                <span>🏆 Expert Designed</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 border-t border-gray-800 pt-8">
              © 2025 SpeakMate. Made with ❤️ for English learners worldwide. 
              <span className="block mt-2 text-cyan-400">
                🌟 Transform your speaking skills today! 🌟
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;