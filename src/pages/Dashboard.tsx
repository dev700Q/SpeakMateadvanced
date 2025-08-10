import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Target, Calendar, Flame, BookOpen, Mic, TrendingUp, Star, Play } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentChallenge, dailyQuote, setDailyQuote, powerWord, setPowerWord } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDailyData();
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
    } catch (error) {
      console.log('Error fetching daily data:', error);
      setDailyQuote('Success is not final, failure is not fatal: it is the courage to continue that counts.');
      setPowerWord({
        word: 'Perseverance',
        definition: 'Persistence in doing something despite difficulty or delay in achieving success.'
      });
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
    { label: 'Current Streak', value: user?.currentStreak || 0, icon: Flame, color: 'text-orange-500' },
    { label: 'Day of Challenge', value: `${currentChallenge}/7`, icon: Calendar, color: 'text-blue-500' },
    { label: 'Completed Challenges', value: user?.completedChallenges || 0, icon: Star, color: 'text-yellow-500' },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Ready to continue your English speaking journey?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Challenge */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl shadow-xl p-8 text-white mb-8">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 mr-3" />
                <h2 className="text-2xl font-bold">Today's Challenge</h2>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-blue-100">Day {currentChallenge} of 7</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {currentChallengeData.duration}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{currentChallengeData.title}</h3>
                <p className="text-blue-100 leading-relaxed mb-6">
                  {currentChallengeData.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/challenge"
                    className="flex items-center justify-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Challenge
                  </Link>
                  <Link
                    to="/mirror-practice"
                    className="flex items-center justify-center border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Practice with Mirror
                  </Link>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round((currentChallenge / 7) * 100)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentChallenge / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/topics"
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Discussion Topics</h3>
                <p className="text-gray-600 text-sm">Practice with engaging conversation starters</p>
              </Link>

              <Link
                to="/motivation"
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Motivation</h3>
                <p className="text-gray-600 text-sm">Get inspired with quotes and power words</p>
              </Link>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Daily Quote */}
            {dailyQuote && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Daily Inspiration
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
              </div>
            )}

            {/* Power Word */}
            {powerWord && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Power Word of the Day
                </h3>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-green-200 rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-green-200 rounded mb-1"></div>
                    <div className="h-4 bg-green-200 rounded w-3/4"></div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-xl font-bold text-green-800 mb-2 capitalize">
                      {powerWord.word}
                    </h4>
                    <p className="text-green-700 leading-relaxed text-sm">
                      {powerWord.definition}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Quick Tips</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Practice speaking slowly and clearly
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Record yourself to track improvement
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Don't worry about mistakes - keep going!
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Practice for at least 10 minutes daily
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;