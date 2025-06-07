import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { 
  BookOpen, 
  FolderKanban, 
  Award, 
  TrendingUp,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalEnrollments: number;
  completedCourses: number;
  earnedBadges: number;
  assignedProjects: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data: DashboardStats = await apiClient.getDashboardAnalytics();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setStats({
          totalEnrollments: 0,
          completedCourses: 0,
          earnedBadges: 0,
          assignedProjects: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: 'Course Enrollments',
      value: stats?.totalEnrollments ?? 0,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Completed Courses',
      value: stats?.completedCourses ?? 0,
      icon: Award,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Earned Badges',
      value: stats?.earnedBadges ?? 0,
      icon: Award,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Active Projects',
      value: stats?.assignedProjects ?? 0,
      icon: FolderKanban,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your development journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className={`${card.bgColor} p-6 rounded-lg shadow-sm`}>
              <div className="flex items-center">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/courses" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BookOpen className="h-8 w-8 text-blue-500 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Browse Courses</p>
                <p className="text-sm text-gray-500">Discover new training</p>
              </div>
            </Link>

            <Link to="/projects" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FolderKanban className="h-8 w-8 text-green-500 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">View Projects</p>
                <p className="text-sm text-gray-500">Check assignments</p>
              </div>
            </Link>

            <Link to="/analytics" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-500">Track progress</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-gray-900">Welcome to CompanyGrow!</p>
                <p className="text-xs text-gray-500">Start by browsing available courses</p>
              </div>
              <div className="text-xs text-gray-400">
                <Clock className="h-3 w-3 inline mr-1" />
                Just now
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
