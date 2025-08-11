import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Play, Pause, Square, Download, Trash2, Volume2 } from 'lucide-react';
import { VoiceVisualizer } from '../ui/voice-visualizer';
import { InteractiveCard } from '../ui/interactive-card';
import { GlassCard } from '../ui/glass-card';
import toast from 'react-hot-toast';

interface Recording {
  id: string;
  name: string;
  blob: Blob;
  duration: number;
  timestamp: Date;
}

export const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
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
  }, [isRecording]);

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
        const newRecording: Recording = {
          id: Date.now().toString(),
          name: `Recording ${recordings.length + 1}`,
          blob,
          duration: recordingTime,
          timestamp: new Date()
        };
        
        setRecordings(prev => [...prev, newRecording]);
        setCurrentRecording(newRecording);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
        toast.success('Recording saved successfully!');
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Unable to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const playRecording = (recording: Recording) => {
    if (audioRef.current) {
      if (isPlaying && currentRecording?.id === recording.id) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const url = URL.createObjectURL(recording.blob);
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
        setCurrentRecording(recording);
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
      }
    }
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
    if (currentRecording?.id === id) {
      setCurrentRecording(null);
      setAudioUrl(null);
      setIsPlaying(false);
    }
    toast.success('Recording deleted');
  };

  const downloadRecording = (recording: Recording) => {
    const url = URL.createObjectURL(recording.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.name}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Recording downloaded');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Recording Interface */}
      <GlassCard className="p-8 backdrop-blur-xl">
        <div className="text-center">
          <motion.div
            className="mb-8"
            animate={{ scale: isRecording ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <VoiceVisualizer isActive={isRecording} className="mb-6" />
            
            <div className="text-4xl font-mono font-bold text-gray-800 mb-4">
              {formatTime(recordingTime)}
            </div>
            
            <motion.button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25'
                  : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25'
              } text-white`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRecording ? (
                <Square className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </motion.button>
            
            <p className="text-gray-600 mt-4">
              {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
            </p>
          </motion.div>
        </div>
      </GlassCard>

      {/* Recordings List */}
      <InteractiveCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Your Recordings</h3>
          <div className="text-sm text-gray-600">
            {recordings.length} recording{recordings.length !== 1 ? 's' : ''}
          </div>
        </div>

        <AnimatePresence>
          {recordings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500"
            >
              <Volume2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recordings yet. Start by recording your first practice session!</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {recordings.map((recording, index) => (
                <motion.div
                  key={recording.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => playRecording(recording)}
                      className={`p-3 rounded-full transition-colors ${
                        isPlaying && currentRecording?.id === recording.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isPlaying && currentRecording?.id === recording.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                    
                    <div>
                      <div className="font-medium text-gray-900">{recording.name}</div>
                      <div className="text-sm text-gray-600">
                        {formatTime(recording.duration)} • {recording.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => downloadRecording(recording)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteRecording(recording.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </InteractiveCard>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
};