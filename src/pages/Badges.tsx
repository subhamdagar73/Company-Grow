import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { Award, Star, Trophy, Zap } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earned_at: string;
}

const Badges: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const data = await apiClient.getMyBadges();
        setBadges(data.badges);
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch badges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return Trophy;
      case 'star': return Star;
      case 'zap': return Zap;
      default: return Award;
    }
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Badges & Achievements</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your accomplishments and earn rewards for your achievements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center">
            <Award className="h-8 w-8 mr-3" />
            <div>
              <p className="text-purple-100">Total Badges</p>
              <p className="text-2xl font-bold">{badges.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center">
            <Star className="h-8 w-8 mr-3" />
            <div>
              <p className="text-blue-100">Total Points</p>
              <p className="text-2xl font-bold">{user?.totalPoints || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 mr-3" />
            <div>
              <p className="text-green-100">Rank</p>
              <p className="text-2xl font-bold">
                {user?.rank || 'Beginner'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {badges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => {
            const IconComponent = getIconComponent(badge.icon);
            return (
              <div key={badge.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <IconComponent className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {badge.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {badge.points} points
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">
                  {badge.description}
                </p>
                
                <div className="text-xs text-gray-500">
                  Earned on {new Date(badge.earned_at).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Award className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No badges earned yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Complete courses and projects to start earning badges!
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">How to Earn Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
              <Award className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Course Completionist</h4>
              <p className="text-sm text-gray-600">Complete your first course</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-purple-100 p-2 rounded-full mr-3 mt-1">
              <Star className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Skill Master</h4>
              <p className="text-sm text-gray-600">Reach level 5 in any skill</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-3 mt-1">
              <Trophy className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Project Hero</h4>
              <p className="text-sm text-gray-600">Complete 5 projects successfully</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
              <Zap className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Quick Learner</h4>
              <p className="text-sm text-gray-600">Complete a course in under a week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badges;