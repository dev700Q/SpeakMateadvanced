import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Volume2, Target, Award, Zap } from 'lucide-react';
import { InteractiveCard } from '../ui/interactive-card';
import { ProgressRing } from '../ui/progress-ring';
import { GradientText } from '../ui/gradient-text';

const weeklyData = [
  { day: 'Mon', fluency: 75, confidence: 68, clarity: 82 },
  { day: 'Tue', fluency: 78, confidence: 72, clarity: 85 },
  { day: 'Wed', fluency: 82, confidence: 75, clarity: 88 },
  { day: 'Thu', fluency: 85, confidence: 80, clarity: 90 },
  { day: 'Fri', fluency: 88, confidence: 85, clarity: 92 },
  { day: 'Sat', fluency: 90, confidence: 88, clarity: 94 },
  { day: 'Sun', fluency: 92, confidence: 90, clarity: 96 }
];

const skillsData = [
  { name: 'Pronunciation', value: 85, color: '#3B82F6' },
  { name: 'Grammar', value: 78, color: '#8B5CF6' },
  { name: 'Vocabulary', value: 92, color: '#06B6D4' },
  { name: 'Fluency', value: 88, color: '#10B981' }
];

export const SpeechAnalytics: React.FC = () => {
  const metrics = [
    {
      icon: Clock,
      label: 'Practice Time',
      value: '2h 34m',
      change: '+12%',
      color: 'blue'
    },
    {
      icon: Volume2,
      label: 'Words/Minute',
      value: '145',
      change: '+8%',
      color: 'green'
    },
    {
      icon: Target,
      label: 'Accuracy',
      value: '94%',
      change: '+5%',
      color: 'purple'
    },
    {
      icon: Award,
      label: 'Confidence',
      value: '88%',
      change: '+15%',
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <GradientText className="text-3xl font-bold mb-2">
          Speech Analytics Dashboard
        </GradientText>
        <p className="text-gray-600">Track your speaking progress with AI-powered insights</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <InteractiveCard className="p-6" glowColor={metric.color}>
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 text-${metric.color}-500`} />
                  <span className="text-green-500 text-sm font-medium">{metric.change}</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-gray-600 text-sm">{metric.label}</div>
              </InteractiveCard>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress */}
        <InteractiveCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Weekly Progress</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line type="monotone" dataKey="fluency" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} />
              <Line type="monotone" dataKey="confidence" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} />
              <Line type="monotone" dataKey="clarity" stroke="#06B6D4" strokeWidth={3} dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </InteractiveCard>

        {/* Skills Breakdown */}
        <InteractiveCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Skills Breakdown</h3>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {skillsData.map((skill, index) => (
              <div key={skill.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: skill.color }}
                />
                <span className="text-sm text-gray-600">{skill.name}</span>
                <span className="text-sm font-semibold text-gray-900">{skill.value}%</span>
              </div>
            ))}
          </div>
        </InteractiveCard>
      </div>

      {/* Overall Progress */}
      <InteractiveCard className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Overall Speaking Score</h3>
          <p className="text-gray-600">Your comprehensive speaking ability assessment</p>
        </div>
        
        <div className="flex items-center justify-center">
          <ProgressRing progress={88} size={200} strokeWidth={12}>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">88%</div>
              <div className="text-gray-600">Excellent</div>
            </div>
          </ProgressRing>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">A+</div>
            <div className="text-blue-800 font-medium">Pronunciation</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">A</div>
            <div className="text-green-800 font-medium">Fluency</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">A-</div>
            <div className="text-purple-800 font-medium">Confidence</div>
          </div>
        </div>
      </InteractiveCard>
    </div>
  );
};