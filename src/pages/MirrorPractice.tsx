import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Mic, MicOff, Play, Pause, Clock, RotateCcw, Shuffle } from 'lucide-react';

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
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<number | null>(null);

  const practiceTopics = [
    "Describe your morning routine in detail",
    "Talk about your favorite hobby and why you enjoy it",
    "Explain how to cook your favorite dish",
    "Describe your hometown and what makes it special",
    "Talk about a book or movie that changed your perspective",
    "Explain the importance of learning new languages",
    "Describe your ideal vacation destination",
    "Talk about a skill you'd like to learn and why",
    "Explain the role of technology in modern life",
    "Describe your goals for the next five years",
    "Talk about a person who has influenced your life",
    "Explain your opinion on social media",
    "Describe a typical day at work or school",
    "Talk about environmental protection",
    "Explain your favorite form of exercise or sport"
  ];

  const bodyLanguageTips = [
    "Maintain good eye contact with the camera",
    "Keep your shoulders relaxed and straight",
    "Use natural hand gestures to emphasize points",
    "Smile naturally when appropriate",
    "Vary your facial expressions with your content",
    "Keep your head level and avoid excessive nodding"
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

  const updateDebugInfo = () => {
    if (videoRef.current && stream) {
      const video = videoRef.current;
      setDebugInfo(`
        Video Ready State: ${video.readyState}
        Video Paused: ${video.paused}
        Video Dimensions: ${video.videoWidth} x ${video.videoHeight}
        Stream Active: ${stream.active}
        Stream Tracks: ${stream.getTracks().length}
        Video Tracks: ${stream.getVideoTracks().length}
      `);
    }
  };

  const startVideo = async () => {
    setIsLoading(true);
    setCameraError(null);
    setDebugInfo('Starting camera...');
    
    try {
      // First, stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      // Wait a bit to ensure the component is fully rendered
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Double-check video element exists
      if (!videoRef.current) {
        setDebugInfo('Video element not found, retrying...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!videoRef.current) {
          throw new Error('Video element still not found after retry');
        }
      }

      const video = videoRef.current;
      setDebugInfo(`Video element found: ${video.tagName}`);

      // Request media stream with simple constraints first
      let mediaStream: MediaStream;
      
      try {
        // Try with basic constraints first
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false
        });
        setDebugInfo('Basic media stream obtained');
      } catch (basicError) {
        // If basic fails, try with no constraints
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: {},
          audio: false
        });
        setDebugInfo('Fallback media stream obtained');
      }
      
      // Verify we got a video track
      const videoTracks = mediaStream.getVideoTracks();
      if (videoTracks.length === 0) {
        throw new Error('No video track found in media stream');
      }
      
      setDebugInfo(`Media stream has ${videoTracks.length} video track(s)`);
      
      // Set the stream to video element
      video.srcObject = mediaStream;
      setStream(mediaStream);
      
      // Create a promise that resolves when video is ready to play
      const videoReady = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Video loading timeout (10s)'));
        }, 10000);

        const onCanPlay = () => {
          clearTimeout(timeout);
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          setDebugInfo('Video can play - attempting to start');
          resolve();
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

      // Wait for video to be ready
      await videoReady;
      
      // Now try to play the video
      try {
        await video.play();
        setDebugInfo('Video playing successfully!');
        setIsVideoOn(true);
      } catch (playError: any) {
        throw new Error(`Failed to play video: ${playError.message}`);
      }
      
    } catch (error: any) {
      console.error('Error in startVideo:', error);
      let errorMessage = 'Camera setup failed: ';
      
      if (error.message.includes('Video element')) {
        errorMessage += 'Could not find video display element. Please refresh the page.';
      } else if (error.name === 'NotAllowedError') {
        errorMessage += 'Camera permission denied. Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found. Please check if a camera is connected.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application. Please close other apps using the camera.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage += 'Camera settings not supported by your device.';
      } else if (error.message.includes('timeout')) {
        errorMessage += 'Camera took too long to start. Please try again.';
      } else {
        errorMessage += error.message || 'Unknown error occurred.';
      }
      
      setCameraError(errorMessage);
      setDebugInfo(`Error: ${error.message}`);
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
    setDebugInfo('');
  };

  const toggleAudio = async () => {
    setCameraError(null);
    
    if (isAudioOn) {
      // Turn off audio
      if (stream) {
        stream.getAudioTracks().forEach(track => track.stop());
      }
      setIsAudioOn(false);
    } else {
      // Turn on audio
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioTrack = audioStream.getAudioTracks()[0];
        if (stream && audioTrack) {
          stream.addTrack(audioTrack);
        }
        setIsAudioOn(true);
      } catch (error: any) {
        console.error('Error accessing microphone:', error);
        setCameraError('Unable to access microphone. Please check your permissions.');
      }
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    setIsRecording(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setIsRecording(false);
  };

  const resetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
    setIsRecording(false);
  };

  const getNewTopic = () => {
    const availableTopics = practiceTopics.filter(topic => topic !== currentTopic);
    const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
    setCurrentTopic(randomTopic);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mirror Practice Studio
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice your speaking skills while watching yourself. Perfect your body language, 
            pronunciation, and confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
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
                      <button
                        onClick={startVideo}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Loading State */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-lg">Starting camera...</p>
                      <p className="text-sm opacity-75 mt-2">Please allow camera permissions if prompted</p>
                    </div>
                  </div>
                )}
                
                {/* Debug Info */}
                {debugInfo && (
                  <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded text-xs font-mono max-w-xs z-10">
                    <div className="text-green-400 mb-1">Debug Info:</div>
                    <pre className="whitespace-pre-wrap">{debugInfo}</pre>
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={updateDebugInfo}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                      >
                        Refresh
                      </button>
                      <button 
                        onClick={() => window.location.reload()}
                        className="px-2 py-1 bg-orange-600 text-white rounded text-xs"
                      >
                        Reload Page
                      </button>
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
                  onLoadedData={() => {
                    console.log('Video loaded data');
                    updateDebugInfo();
                  }}
                  onCanPlay={() => {
                    console.log('Video can play');
                    updateDebugInfo();
                  }}
                  onPlay={() => {
                    console.log('Video playing');
                    updateDebugInfo();
                  }}
                  onError={(e) => {
                    console.error('Video element error:', e);
                    setCameraError('Video display error occurred');
                  }}
                />
                
                {!isVideoOn && !cameraError && !isLoading && (
                  <div className="w-full h-full flex items-center justify-center text-white absolute inset-0">
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Camera is off</p>
                      <p className="text-sm opacity-75 mb-4">Click the camera button to start</p>
                      <div className="text-xs opacity-60 space-y-1">
                        <p>• Allow camera permissions when prompted</p>
                        <p>• Works best in Chrome, Firefox, or Safari</p>
                        <p>• Requires HTTPS or localhost</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center z-10">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    REC
                  </div>
                )}

                {/* Timer Display */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg text-lg font-mono z-10">
                  {formatTime(timer)}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button
                  onClick={isVideoOn ? stopVideo : startVideo}
                  disabled={isLoading}
                  className={`p-4 rounded-full transition-all duration-200 ${
                    isVideoOn
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}`}
                  title={isVideoOn ? 'Stop Camera' : 'Start Camera'}
                >
                  {isVideoOn ? <CameraOff className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                </button>

                <button
                  onClick={toggleAudio}
                  disabled={isLoading || !isVideoOn}
                  className={`p-4 rounded-full transition-all duration-200 ${
                    isAudioOn
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                  } ${(isLoading || !isVideoOn) ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}`}
                  title={isAudioOn ? 'Mute Microphone' : 'Enable Microphone'}
                >
                  {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>

                <button
                  onClick={isTimerRunning ? stopTimer : startTimer}
                  disabled={isLoading}
                  className={`p-4 rounded-full transition-all duration-200 ${
                    isTimerRunning
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}`}
                  title={isTimerRunning ? 'Stop Recording' : 'Start Recording'}
                >
                  {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>

                <button
                  onClick={resetTimer}
                  disabled={isLoading}
                  className={`p-4 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-all duration-200 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
                  }`}
                  title="Reset Timer"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>

              {/* Control Labels */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-500 mb-4">
                <div>Camera</div>
                <div>Audio</div>
                <div>Record</div>
                <div>Reset</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 text-center text-sm text-gray-600">
                <div>
                  <div className="font-medium text-gray-900">Camera</div>
                  <div className={isVideoOn ? 'text-green-600' : 'text-red-600'}>
                    {isVideoOn ? 'ON' : 'OFF'}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Microphone</div>
                  <div className={isAudioOn ? 'text-green-600' : 'text-red-600'}>
                    {isAudioOn ? 'ON' : 'OFF'}
                  </div>
                </div>
              </div>
              
              {/* Browser Compatibility Notice */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700">
                  <strong>Troubleshooting:</strong> If camera doesn't show, try refreshing the page, 
                  check browser permissions, ensure you're using HTTPS/localhost, and try a different browser.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Topic */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-900">Practice Topic</h3>
                <button
                  onClick={getNewTopic}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  title="Get new topic"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
              <p className="text-blue-800 leading-relaxed">
                {currentTopic}
              </p>
            </div>

            {/* Body Language Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Body Language Tips</h3>
              <ul className="space-y-3">
                {bodyLanguageTips.map((tip, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Practice Guidelines */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Practice Guidelines</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <div className="font-medium text-gray-900 mb-1">🕐 Duration</div>
                  <div>Practice for 2-5 minutes per topic</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">🎯 Focus Areas</div>
                  <div>Pronunciation, pace, and body language</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">🔄 Repetition</div>
                  <div>Try the same topic multiple times to improve</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">📝 Self-Assessment</div>
                  <div>Notice areas for improvement after each session</div>
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">📊 Today's Session</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-purple-800">Practice Time</span>
                  <span className="font-semibold text-purple-900">{formatTime(timer)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-800">Status</span>
                  <span className={`font-semibold ${isRecording ? 'text-red-600' : 'text-purple-900'}`}>
                    {isRecording ? 'Recording' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MirrorPractice;