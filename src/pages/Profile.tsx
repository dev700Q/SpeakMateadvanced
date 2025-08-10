import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, Flame, Target, Star, Edit2, Save, X } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  if (!user) return null;

  const handleSave = () => {
    if (editedName.trim()) {
      updateUser({ name: editedName.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(user.name);
    setIsEditing(false);
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset your progress? This action cannot be undone.')) {
      updateUser({
        currentStreak: 0,
        completedChallenges: 0
      });
      localStorage.removeItem('lastChallengeCompleted');
    }
  };

  const joinDate = new Date(user.joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Completed your first challenge',
      icon: Target,
      earned: user.completedChallenges > 0,
      color: 'text-blue-500'
    },
    {
      id: 2,
      title: 'Week Warrior',
      description: 'Completed a 7-day challenge',
      icon: Flame,
      earned: user.completedChallenges >= 1,
      color: 'text-orange-500'
    },
    {
      id: 3,
      title: 'Consistency King',
      description: 'Maintained a 7-day streak',
      icon: Star,
      earned: user.currentStreak >= 7,
      color: 'text-yellow-500'
    },
    {
      id: 4,
      title: 'Speaking Star',
      description: 'Completed 3 full challenges',
      icon: Star,
      earned: user.completedChallenges >= 3,
      color: 'text-purple-500'
    }
  ];

  const stats = [
    {
      label: 'Current Streak',
      value: user.currentStreak,
      unit: 'days',
      icon: Flame,
      color: 'text-orange-500'
    },
    {
      label: 'Challenges Completed',
      value: user.completedChallenges,
      unit: 'total',
      icon: Target,
      color: 'text-blue-500'
    },
    {
      label: 'Days Since Joining',
      value: Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24)),
      unit: 'days',
      icon: Calendar,
      color: 'text-green-500'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Profile
          </h1>
          <p className="text-lg text-gray-600">
            Track your progress and manage your account
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your name"
                        />
                        <button
                          onClick={handleSave}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium text-gray-900">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Member Since</div>
                      <div className="font-medium text-gray-900">{joinDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                      <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{stat.label}</div>
                      <div className="text-sm text-gray-600">{stat.unit}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Actions</h2>
              <div className="space-y-4">
                <button
                  onClick={resetProgress}
                  className="w-full md:w-auto px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                >
                  Reset Progress
                </button>
                <button
                  onClick={logout}
                  className="w-full md:w-auto px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium ml-0 md:ml-4"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Achievements Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-start space-x-3 p-4 rounded-lg transition-colors ${
                        achievement.earned
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 mt-1 ${
                          achievement.earned ? achievement.color : 'text-gray-400'
                        }`}
                      />
                      <div className="flex-1">
                        <div
                          className={`font-medium ${
                            achievement.earned ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {achievement.title}
                        </div>
                        <div
                          className={`text-sm ${
                            achievement.earned ? 'text-gray-600' : 'text-gray-400'
                          }`}
                        >
                          {achievement.description}
                        </div>
                        {achievement.earned && (
                          <div className="text-xs text-green-600 font-medium mt-1">
                            ✓ Earned
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Keep Going!</h3>
              <p className="text-blue-800 mb-4 leading-relaxed">
                You're making great progress on your English speaking journey. 
                Consistency is key to improvement!
              </p>
              <div className="bg-white/50 rounded-lg p-4">
                <div className="text-sm text-blue-700 mb-2">Next Milestone</div>
                <div className="font-semibold text-blue-900">
                  {user.currentStreak < 7
                    ? `${7 - user.currentStreak} days to Week Warrior`
                    : 'Complete another challenge!'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;