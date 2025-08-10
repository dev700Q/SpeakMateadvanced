import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { MessageSquare, Shuffle, CheckCircle, Clock, Users, Lightbulb, RefreshCw } from 'lucide-react';

const Topics: React.FC = () => {
  const { completedTopics, markTopicCompleted } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [randomTopic, setRandomTopic] = useState('');

  const categories = [
    { id: 'all', name: 'All Topics', icon: MessageSquare },
    { id: 'personal', name: 'Personal', icon: Users },
    { id: 'social', name: 'Social Issues', icon: Lightbulb },
    { id: 'technology', name: 'Technology', icon: RefreshCw },
    { id: 'education', name: 'Education', icon: MessageSquare },
    { id: 'lifestyle', name: 'Lifestyle', icon: Clock },
  ];

  const topics = [
    // Personal
    { id: 1, category: 'personal', title: 'Describe your ideal weekend', difficulty: 'Easy', time: '2-3 min' },
    { id: 2, category: 'personal', title: 'Talk about a childhood memory that shaped you', difficulty: 'Medium', time: '3-4 min' },
    { id: 3, category: 'personal', title: 'Explain your biggest fear and how you deal with it', difficulty: 'Hard', time: '4-5 min' },
    { id: 4, category: 'personal', title: 'Describe your morning routine', difficulty: 'Easy', time: '2-3 min' },
    { id: 5, category: 'personal', title: 'Talk about a person who inspires you', difficulty: 'Medium', time: '3-4 min' },
    
    // Social Issues
    { id: 6, category: 'social', title: 'Should social media platforms be regulated?', difficulty: 'Hard', time: '5-6 min' },
    { id: 7, category: 'social', title: 'Discuss the importance of mental health awareness', difficulty: 'Medium', time: '4-5 min' },
    { id: 8, category: 'social', title: 'Is remote work better than office work?', difficulty: 'Medium', time: '3-4 min' },
    { id: 9, category: 'social', title: 'How can we reduce plastic waste?', difficulty: 'Easy', time: '3-4 min' },
    { id: 10, category: 'social', title: 'Discuss the role of youth in social change', difficulty: 'Hard', time: '5-6 min' },
    
    // Technology
    { id: 11, category: 'technology', title: 'How has technology changed communication?', difficulty: 'Medium', time: '4-5 min' },
    { id: 12, category: 'technology', title: 'Should artificial intelligence replace human jobs?', difficulty: 'Hard', time: '5-6 min' },
    { id: 13, category: 'technology', title: 'Describe your favorite mobile app and why', difficulty: 'Easy', time: '2-3 min' },
    { id: 14, category: 'technology', title: 'Is online learning as effective as traditional learning?', difficulty: 'Medium', time: '4-5 min' },
    
    // Education
    { id: 15, category: 'education', title: 'Should homework be abolished?', difficulty: 'Medium', time: '3-4 min' },
    { id: 16, category: 'education', title: 'What makes a good teacher?', difficulty: 'Easy', time: '3-4 min' },
    { id: 17, category: 'education', title: 'Is university education necessary for success?', difficulty: 'Hard', time: '5-6 min' },
    { id: 18, category: 'education', title: 'How can we make learning more engaging?', difficulty: 'Medium', time: '4-5 min' },
    
    // Lifestyle
    { id: 19, category: 'lifestyle', title: 'Is a healthy lifestyle expensive?', difficulty: 'Medium', time: '3-4 min' },
    { id: 20, category: 'lifestyle', title: 'Describe your favorite hobby', difficulty: 'Easy', time: '2-3 min' },
    { id: 21, category: 'lifestyle', title: 'Should people work to live or live to work?', difficulty: 'Hard', time: '4-5 min' },
    { id: 22, category: 'lifestyle', title: 'How do you manage stress?', difficulty: 'Medium', time: '3-4 min' },
  ];

  const filteredTopics = topics.filter(topic => {
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRandomTopic = () => {
    const availableTopics = topics.filter(topic => !completedTopics.includes(topic.id.toString()));
    if (availableTopics.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTopics.length);
      setRandomTopic(availableTopics[randomIndex].title);
    } else {
      setRandomTopic(topics[Math.floor(Math.random() * topics.length)].title);
    }
  };

  useEffect(() => {
    getRandomTopic();
  }, [completedTopics]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discussion Topics
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice speaking with engaging topics for group discussions, presentations, and everyday conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Random Topic Generator */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Random Topic</h3>
                <button
                  onClick={getRandomTopic}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
              <p className="text-purple-100 mb-4 leading-relaxed">
                {randomTopic || 'Click the shuffle button to get a random topic!'}
              </p>
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed Topics</span>
                  <span className="font-semibold text-green-600">{completedTopics.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Topics</span>
                  <span className="font-semibold text-gray-900">{topics.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(completedTopics.length / topics.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-center text-sm text-gray-600">
                  {Math.round((completedTopics.length / topics.length) * 100)}% Complete
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTopics.map((topic) => {
                const isCompleted = completedTopics.includes(topic.id.toString());
                
                return (
                  <div
                    key={topic.id}
                    className={`bg-white rounded-2xl shadow-lg p-6 border transition-all duration-300 hover:shadow-xl ${
                      isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-100 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-2 leading-tight ${
                          isCompleted ? 'text-green-800' : 'text-gray-900'
                        }`}>
                          {topic.title}
                        </h3>
                      </div>
                      {isCompleted && (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(topic.difficulty)}`}>
                        {topic.difficulty}
                      </span>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {topic.time}
                      </div>
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => markTopicCompleted(topic.id.toString())}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                      >
                        Mark as Practiced
                      </button>
                    )}

                    {isCompleted && (
                      <div className="text-center py-2 text-green-700 font-medium">
                        ✅ Completed
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredTopics.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No topics found</h3>
                <p className="text-gray-600">Try adjusting your search or category filter.</p>
              </div>
            )}

            {/* Speaking Tips */}
            <div className="mt-12 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-100">
              <h3 className="text-xl font-semibold text-blue-900 mb-6">💡 Speaking Tips for Topics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Structure Your Response</h4>
                  <ul className="space-y-2 text-blue-700 text-sm">
                    <li>• Start with your main point</li>
                    <li>• Provide 2-3 supporting reasons</li>
                    <li>• Give examples or personal experiences</li>
                    <li>• Conclude with a summary</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Delivery Tips</h4>
                  <ul className="space-y-2 text-blue-700 text-sm">
                    <li>• Speak at a moderate pace</li>
                    <li>• Use pause for emphasis</li>
                    <li>• Maintain eye contact</li>
                    <li>• Use natural gestures</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topics;