import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Mic, MicOff, Play, Pause, Square, RotateCcw, Shuffle, Brain, Zap, Award } from 'lucide-react';
import { InteractiveCard } from '../components/ui/interactive-card';
import { GlassCard } from '../components/ui/glass-card';
import { GradientText } from '../components/ui/gradient-text';
import { VoiceVisualizer } from '../components/ui/voice-visualizer';
import { VoiceRecorder } from '../components/advanced/VoiceRecorder';
import { MotionDiv, fadeInUp, staggerContainer, scaleIn } from '../components/ui/motion';
import toast from 'react-hot-toast';

const MirrorPractice: React.FC = () => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [showAdvancedRecorder, setShowAdvancedRecorder] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<number | null>(null);

  const practiceTopics = [
    "Describe your morning routine with confidence and clarity",
    "Talk about your favorite hobby and why it brings you joy",
    "Explain how to cook your signature dish step by step",
    "Describe your hometown and what makes it unique",
    "Discuss a book or movie that changed your perspective",
    "Explain the importance of learning new languages in today's world",
    "Describe your ideal vacation destination and activities",
    "Talk about a skill you'd like to master and your learning plan",
    "Discuss the role of technology in modern communication",
    "Share your goals for the next five years with passion",
    "Talk about a person who has influenced your life journey",
    "Express your opinion on the future of remote work",
    "Describe a typical day in your dream job",
    "Discuss environmental protection and personal responsibility",
    "Explain your favorite form of exercise and its benefits"
  ];

  const aiTips = [
    {
      category: "Body Language",
      tips: [
        "Maintain eye contact with the camera for 70% of your speech",
        "Keep your shoulders relaxed and avoid hunching",
        "Use natural hand gestures to emphasize key points",
        "Smile genuinely when appropriate to convey warmth",
        "Vary your facial expressions to match your content",
        "Keep your head level and avoid excessive nodding"
      ]
    },
    {
      category: "Voice & Delivery",
      tips: [
        "Speak at 150-160 words per minute for optimal clarity",
        "Use strategic pauses to emphasize important points",
        "Vary your tone to maintain audience engagement",
        "Project your voice from your diaphragm, not throat",
        "End statements with falling intonation for authority",
        "Use rising intonation for questions and engagement"
      ]
    },
    {
      category: "Content Structure",
      tips: [
        "Start with a clear topic sentence or hook",
        "Use the PREP method: Point, Reason, Example, Point",
        "Include specific examples and personal experiences",
        "Use transition words to connect your ideas smoothly",
        "Conclude with a memorable summary or call to action",
        "Practice the 3-2-1 rule: 3 main points, 2 examples each, 1 conclusion"
      ]
    }
  ];

  useEffect(() => {
    // Set initial random topic
    setCurrentTopic(practiceTopics[Math.floor(Math.random() * practiceTopics.length)]);
    
    // Cleanup function to stop video stream when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning]);

  const startVideo = async () => {
    setIsLoading(true);
    setCameraError(null);
    
    try {
      // First, stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      // Wait a bit to ensure the component is fully rendered
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!videoRef.current) {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!videoRef.current) {
          throw new Error('Video element not found after retry');
        }
      }

      const video = videoRef.current;

      // Request media stream
      let mediaStream: MediaStream;
      
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 },
          audio: false
        });
      } catch (basicError) {
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false
        });
      }
      
      const videoTracks = mediaStream.getVideoTracks();
      if (videoTracks.length === 0) {
        throw new Error('No video track found in media stream');
      }
      
      // Set the stream to video element
      video.srcObject = mediaStream;
      setStream(mediaStream);
      
      // Wait for video to be ready and play
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Video loading timeout'));
        }, 10000);

        const onCanPlay = async () => {
          clearTimeout(timeout);
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          try {
            await video.play();
            resolve();
          } catch (playError: any) {
            reject(new Error(`Failed to play video: ${playError.message}`));
          }
        };

        const onError = (e: any) => {
          clearTimeout(timeout);
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          reject(new Error(`Video error: ${e.message || 'Unknown error'}`));
        };

        video.addEventListener('canplay', onCanPlay);
        video.addEventListener('error', onError);
      });
      
      setIsVideoOn(true);
      toast.success('Camera started successfully!');
      
    } catch (error: any) {
      console.error('Error in startVideo:', error);
      let errorMessage = 'Camera setup failed: ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Camera permission denied. Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found. Please check if a camera is connected.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application.';
      } else {
        errorMessage += error.message || 'Unknown error occurred.';
      }
      
      setCameraError(errorMessage);
      toast.error('Camera failed to start');
    } finally {
      setIsLoading(false);
    }
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsVideoOn(false);
    setCameraError(null);
    toast.success('Camera stopped');
  };

  const toggleAudio = async () => {
    setCameraError(null);
    
    if (isAudioOn) {
      if (stream) {
        stream.getAudioTracks().forEach(track => track.stop());
      }
      setIsAudioOn(false);
      toast.success('Microphone disabled');
    } else {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioTrack = audioStream.getAudioTracks()[0];
        if (stream && audioTrack) {
          stream.addTrack(audioTrack);
        }
        setIsAudioOn(true);
        toast.success('Microphone enabled');
      } catch (error: any) {
        console.error('Error accessing microphone:', error);
        setCameraError('Unable to access microphone. Please check your permissions.');
        toast.error('Microphone access failed');
      }
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    setIsRecording(true);
    toast.success('Recording started');
    
    // Simulate AI analysis after 10 seconds
    setTimeout(() => {
      if (isRecording) {
        setAiAnalysis({
          confidence: Math.floor(Math.random() * 20) + 80,
          clarity: Math.floor(Math.random() * 15) + 85,
          pace: Math.floor(Math.random() * 25) + 140,
          engagement: Math.floor(Math.random() * 20) + 75
        });
      }
    }, 10000);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setIsRecording(false);
    toast.success('Recording stopped');
  };

  const resetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
    setIsRecording(false);
    setAiAnalysis(null);
    toast.success('Session reset');
  };

  const getNewTopic = () => {
    const availableTopics = practiceTopics.filter(topic => topic !== currentTopic);
    const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
    setCurrentTopic(randomTopic);
    toast.success('New topic generated!');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <MotionDiv className="text-center mb-8" {...fadeInUp}>
          <GradientText className="text-4xl md:text-5xl font-black mb-4">
            🎭 AI Mirror Practice Studio
          </GradientText>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Practice with advanced AI analysis of your speech patterns, body language, and confidence levels.
          </p>
        </MotionDiv>

        {/* Mode Toggle */}
        <MotionDiv className="flex justify-center mb-8" {...fadeInUp}>
          <GlassCard className="p-2 bg-white/50">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAdvancedRecorder(false)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  !showAdvancedRecorder
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🎭 Mirror Practice
              </button>
              <button
                onClick={() => setShowAdvancedRecorder(true)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  showAdvancedRecorder
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🎤 Advanced Recorder
              </button>
            </div>
          </GlassCard>
        </MotionDiv>

        <AnimatePresence mode="wait">
          {showAdvancedRecorder ? (
            <motion.div
              key="recorder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VoiceRecorder />
            </motion.div>
          ) : (
            <motion.div
              key="mirror"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Video Section */}
                <div className="lg:col-span-2">
                  <MotionDiv {...fadeInUp}>
                    <InteractiveCard className="p-6">
                      {/* Video Display */}
                      <div 
                        className="relative bg-gray-900 rounded-xl overflow-hidden mb-6" 
                        style={{ 
                          aspectRatio: '16/9',
                          minHeight: '400px'
                        }}
                      >
                        {/* Error Message */}
                        {cameraError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-red-50 border-2 border-red-200 rounded-xl z-20">
                            <div className="text-center p-6 max-w-md">
                              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Camera className="w-8 h-8 text-red-500" />
                              </div>
                              <p className="text-red-700 font-medium mb-2">Camera Error</p>
                              <p className="text-red-600 text-sm leading-relaxed mb-4">{cameraError}</p>
                              <motion.button
                                onClick={startVideo}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Try Again
                              </motion.button>
                            </div>
                          </div>
                        )}
                        
                        {/* Loading State */}
                        {isLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                            <div className="text-center text-white">
                              <motion.div 
                                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              <p className="text-lg">Starting AI Camera...</p>
                              <p className="text-sm opacity-75 mt-2">Please allow camera permissions</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Video Element */}
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover transform scale-x-[-1] bg-gray-800"
                          style={{ 
                            display: isVideoOn ? 'block' : 'none',
                            minHeight: '400px',
                            width: '100%',
                            height: '100%'
                          }}
                        />
                        
                        {!isVideoOn && !cameraError && !isLoading && (
                          <div className="w-full h-full flex items-center justify-center text-white absolute inset-0">
                            <div className="text-center">
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                              </motion.div>
                              <p className="text-lg mb-2">AI Camera is off</p>
                              <p className="text-sm opacity-75 mb-4">Click the camera button to start AI analysis</p>
                              <div className="text-xs opacity-60 space-y-1">
                                <p>• AI-powered body language analysis</p>
                                <p>• Real-time confidence scoring</p>
                                <p>• Advanced speech pattern recognition</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Recording Indicator */}
                        {isRecording && (
                          <motion.div 
                            className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center z-10"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                            AI ANALYZING
                          </motion.div>
                        )}

                        {/* Timer Display */}
                        <GlassCard className="absolute top-4 right-4 px-4 py-2 z-10">
                          <div className="text-white text-lg font-mono font-bold">
                            {formatTime(timer)}
                          </div>
                        </GlassCard>

                        {/* AI Analysis Overlay */}
                        {aiAnalysis && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-4 left-4 right-4 z-10"
                          >
                            <GlassCard className="p-4 bg-black/50 backdrop-blur-md">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-sm">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-green-400">{aiAnalysis.confidence}%</div>
                                  <div>Confidence</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-blue-400">{aiAnalysis.clarity}%</div>
                                  <div>Clarity</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-purple-400">{aiAnalysis.pace}</div>
                                  <div>WPM</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-orange-400">{aiAnalysis.engagement}%</div>
                                  <div>Engagement</div>
                                </div>
                              </div>
                            </GlassCard>
                          </motion.div>
                        )}
                      </div>

                      {/* Voice Visualizer */}
                      {isRecording && (
                        <MotionDiv 
                          className="mb-6"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <VoiceVisualizer isActive={isRecording} className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4" />
                        </MotionDiv>
                      )}

                      {/* Controls */}
                      <MotionDiv className="flex items-center justify-center space-x-4 mb-4" {...staggerContainer}>
                        <motion.button
                          onClick={isVideoOn ? stopVideo : startVideo}
                          disabled={isLoading}
                          className={`p-4 rounded-full transition-all duration-200 ${
                            isVideoOn
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}`}
                          whileHover={{ scale: isLoading ? 1 : 1.05 }}
                          whileTap={{ scale: isLoading ? 1 : 0.95 }}
                          variants={scaleIn}
                        >
                          {isVideoOn ? <CameraOff className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                        </motion.button>

                        <motion.button
                          onClick={toggleAudio}
                          disabled={isLoading || !isVideoOn}
                          className={`p-4 rounded-full transition-all duration-200 ${
                            isAudioOn
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-gray-500 hover:bg-gray-600 text-white'
                          } ${(isLoading || !isVideoOn) ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}`}
                          whileHover={{ scale: (isLoading || !isVideoOn) ? 1 : 1.05 }}
                          whileTap={{ scale: (isLoading || !isVideoOn) ? 1 : 0.95 }}
                          variants={scaleIn}
                        >
                          {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                        </motion.button>

                        <motion.button
                          onClick={isTimerRunning ? stopTimer : startTimer}
                          disabled={isLoading}
                          className={`p-4 rounded-full transition-all duration-200 ${
                            isTimerRunning
                              ? 'bg-orange-500 hover:bg-orange-600 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}`}
                          whileHover={{ scale: isLoading ? 1 : 1.05 }}
                          whileTap={{ scale: isLoading ? 1 : 0.95 }}
                          variants={scaleIn}
                        >
                          {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </motion.button>

                        <motion.button
                          onClick={resetTimer}
                          disabled={isLoading}
                          className={`p-4 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-all duration-200 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
                          }`}
                          whileHover={{ scale: isLoading ? 1 : 1.05 }}
                          whileTap={{ scale: isLoading ? 1 : 0.95 }}
                          variants={scaleIn}
                        >
                          <RotateCcw className="w-6 h-6" />
                        </motion.button>
                      </MotionDiv>

                      {/* Control Labels */}
                      <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-500 mb-4">
                        <div>AI Camera</div>
                        <div>Smart Audio</div>
                        <div>AI Record</div>
                        <div>Reset</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6 text-center text-sm text-gray-600">
                        <GlassCard className="p-3">
                          <div className="font-medium text-gray-900">AI Camera</div>
                          <div className={isVideoOn ? 'text-green-600' : 'text-red-600'}>
                            {isVideoOn ? '🟢 ANALYZING' : '🔴 OFF'}
                          </div>
                        </GlassCard>
                        <GlassCard className="p-3">
                          <div className="font-medium text-gray-900">Smart Audio</div>
                          <div className={isAudioOn ? 'text-green-600' : 'text-red-600'}>
                            {isAudioOn ? '🟢 LISTENING' : '🔴 OFF'}
                          </div>
                        </GlassCard>
                      </div>
                    </InteractiveCard>
                  </MotionDiv>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Current Topic */}
                  <MotionDiv {...fadeInUp}>
                    <GlassCard className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border border-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                          <Brain className="w-5 h-5 mr-2" />
                          AI Practice Topic
                        </h3>
                        <motion.button
                          onClick={getNewTopic}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          whileHover={{ scale: 1.05, rotate: 180 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Shuffle className="w-4 h-4" />
                        </motion.button>
                      </div>
                      <p className="text-blue-800 leading-relaxed">
                        {currentTopic}
                      </p>
                    </GlassCard>
                  </MotionDiv>

                  {/* AI Tips */}
                  <MotionDiv {...fadeInUp}>
                    <InteractiveCard className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                        🤖 AI Coaching Tips
                      </h3>
                      <div className="space-y-4">
                        {aiTips.map((category, index) => (
                          <motion.div
                            key={category.category}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <h4 className="font-medium text-gray-900 mb-2">{category.category}</h4>
                            <ul className="space-y-2">
                              {category.tips.slice(0, 2).map((tip, tipIndex) => (
                                <li key={tipIndex} className="flex items-start text-sm text-gray-600">
                                  <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    </InteractiveCard>
                  </MotionDiv>

                  {/* AI Analysis Results */}
                  {aiAnalysis && (
                    <MotionDiv 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                    >
                      <GlassCard className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                          <Award className="w-5 h-5 mr-2" />
                          🏆 AI Analysis Results
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-purple-800">Confidence Level</span>
                            <span className="font-semibold text-purple-900">{aiAnalysis.confidence}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-purple-800">Speech Clarity</span>
                            <span className="font-semibold text-purple-900">{aiAnalysis.clarity}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-purple-800">Speaking Pace</span>
                            <span className="font-semibold text-purple-900">{aiAnalysis.pace} WPM</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-purple-800">Engagement Score</span>
                            <span className="font-semibold text-purple-900">{aiAnalysis.engagement}%</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-white/50 rounded-lg">
                          <p className="text-sm text-purple-700">
                            🎯 <strong>AI Recommendation:</strong> {
                              aiAnalysis.confidence > 85 
                                ? "Excellent confidence! Try more challenging topics."
                                : "Focus on maintaining eye contact and speaking slower for better confidence."
                            }
                          </p>
                        </div>
                      </GlassCard>
                    </MotionDiv>
                  )}

                  {/* Session Progress */}
                  <MotionDiv {...fadeInUp}>
                    <GlassCard className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                      <h3 className="text-lg font-semibold text-green-900 mb-4">📊 Today's AI Session</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-green-800">Practice Time</span>
                          <span className="font-semibold text-green-900">{formatTime(timer)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-800">AI Status</span>
                          <span className={`font-semibold ${isRecording ? 'text-red-600' : 'text-green-900'}`}>
                            {isRecording ? '🔴 ANALYZING' : '🟢 READY'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-800">Camera Quality</span>
                          <span className="font-semibold text-green-900">
                            {isVideoOn ? '🟢 HD' : '🔴 OFF'}
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </MotionDiv>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MirrorPractice;