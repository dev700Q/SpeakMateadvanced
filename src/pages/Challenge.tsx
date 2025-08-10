import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Mic, MicOff, Play, Pause, Square, RotateCcw, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const Challenge: React.FC = () => {
  const { currentChallenge, setCurrentChallenge } = useApp();
  const { updateUser } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const challengeData = [
    {
      day: 1,
      title: 'Introduction & Goals',
      description: 'Introduce yourself and share your speaking goals',
      duration: 120,
      prompt: 'Please introduce yourself. Share your name, where you\'re from, and what you hope to achieve with your English speaking practice.',
      tips: ['Speak slowly and clearly', 'Don\'t worry about perfect grammar', 'Be authentic and natural']
    },
    {
      day: 2,
      title: 'Daily Routine',
      description: 'Describe your typical day in detail',
      duration: 180,
      prompt: 'Describe your typical day from morning to evening. What activities do you do? What do you enjoy most about your daily routine?',
      tips: ['Use time expressions (first, then, after that)', 'Include specific details', 'Practice past and present tenses']
    },
    {
      day: 3,
      title: 'Favorite Memory',
      description: 'Share a cherished memory and why it matters',
      duration: 180,
      prompt: 'Tell us about one of your favorite memories. What happened? Who was there? Why is this memory special to you?',
      tips: ['Use past tense consistently', 'Include emotions and feelings', 'Paint a picture with your words']
    },
    {
      day: 4,
      title: 'Problem Solving',
      description: 'Discuss a challenge you overcame',
      duration: 240,
      prompt: 'Think of a challenge or problem you faced and overcame. How did you solve it? What did you learn from the experience?',
      tips: ['Structure: Problem → Solution → Result', 'Use linking words (however, therefore, finally)', 'Share the lesson learned']
    },
    {
      day: 5,
      title: 'Future Plans',
      description: 'Talk about your dreams and aspirations',
      duration: 240,
      prompt: 'What are your goals and dreams for the future? Where do you see yourself in 5 years? What steps will you take to achieve these goals?',
      tips: ['Use future tenses (will, going to, might)', 'Be specific about your plans', 'Explain why these goals matter to you']
    },
    {
      day: 6,
      title: 'Opinion Piece',
      description: 'Express your views on a current topic',
      duration: 300,
      prompt: 'Choose a topic you care about (technology, environment, education, etc.) and share your opinion. Support your views with reasons and examples.',
      tips: ['State your opinion clearly', 'Provide 2-3 supporting reasons', 'Use opinion phrases (I believe, In my view, I think)']
    },
    {
      day: 7,
      title: 'Reflection & Growth',
      description: 'Reflect on your week of practice',
      duration: 300,
      prompt: 'Reflect on your speaking practice this week. What have you learned? How have you improved? What will you continue practicing?',
      tips: ['Compare your first day to today', 'Acknowledge your progress', 'Set goals for continued practice']
    }
  ];

  const currentChallengeData = challengeData[currentChallenge - 1];

  useEffect(() => {
    // Check if user completed today's challenge
    const today = new Date().toDateString();
    const lastCompleted = localStorage.getItem('lastChallengeCompleted');
    setHasCompletedToday(lastCompleted === today);
  }, []);

  useEffect(() => {
    if (recordingTime > 0 && isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
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
  }, [isRecording, recordingTime]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
      }
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const completeChallenge = () => {
    const today = new Date().toDateString();
    localStorage.setItem('lastChallengeCompleted', today);
    setHasCompletedToday(true);
    
    // Update user progress
    updateUser({
      currentStreak: (currentChallenge === 7) ? 0 : currentChallenge,
      completedChallenges: (currentChallenge === 7) ? 1 : 0
    });

    // Move to next challenge or reset
    if (currentChallenge < 7) {
      setCurrentChallenge(currentChallenge + 1);
    } else {
      setCurrentChallenge(1); // Reset to day 1 for new cycle
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Day {currentChallenge} of 7
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {currentChallengeData.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {currentChallengeData.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Challenge Prompt */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Challenge</h2>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-gray-800 leading-relaxed">
                  {currentChallengeData.prompt}
                </p>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-6">
                <Clock className="w-4 h-4 mr-2" />
                Target Duration: {Math.floor(currentChallengeData.duration / 60)} minutes
              </div>

              {/* Recording Interface */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-500 animate-pulse shadow-lg shadow-red-200' 
                        : 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl cursor-pointer'
                    }`}>
                      {isRecording ? (
                        <Square 
                          className="w-8 h-8 text-white cursor-pointer" 
                          onClick={stopRecording}
                        />
                      ) : (
                        <Mic 
                          className="w-8 h-8 text-white cursor-pointer" 
                          onClick={startRecording}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="text-2xl font-mono font-semibold text-gray-800 mb-2">
                    {formatTime(recordingTime)}
                  </div>
                  
                  <p className="text-gray-600">
                    {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                  </p>
                </div>

                {/* Playback Controls */}
                {audioUrl && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Your Recording</h3>
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={playRecording}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {isPlaying ? 'Pause' : 'Play'}
                      </button>
                      
                      <button
                        onClick={resetRecording}
                        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </button>
                    </div>
                    
                    <audio ref={audioRef} src={audioUrl} className="hidden" />
                  </div>
                )}

                {/* Complete Challenge Button */}
                {audioUrl && !hasCompletedToday && (
                  <div className="border-t pt-6 text-center">
                    <button
                      onClick={completeChallenge}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <CheckCircle className="w-5 h-5 mr-2 inline" />
                      Complete Challenge
                    </button>
                  </div>
                )}

                {hasCompletedToday && (
                  <div className="border-t pt-6 text-center">
                    <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg inline-flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Challenge completed for today! 🎉
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Speaking Tips</h3>
              <ul className="space-y-3">
                {currentChallengeData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-3">
                {challengeData.map((challenge, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ${
                      index + 1 < currentChallenge
                        ? 'bg-green-500 text-white'
                        : index + 1 === currentChallenge
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1 < currentChallenge ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        index + 1 === currentChallenge ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {challenge.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Challenge Preview */}
            {currentChallenge < 7 && (
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Day {currentChallenge + 1}: {challengeData[currentChallenge].title}</div>
                  <div className="text-blue-600">{challengeData[currentChallenge].description}</div>
                </div>
                <div className="flex items-center mt-3 text-xs text-blue-600">
                  <ArrowRight className="w-3 h-3 mr-1" />
                  Complete today's challenge to unlock
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenge;