import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { 
  Users, 
  BookOpen, 
  FolderKanban, 
  Award,
  Plus,
  Settings,
  TrendingUp,
  Activity
} from 'lucide-react';

const ManagerDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalProjects: 0,
    totalBadges: 0
  });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const data = await apiClient.getAdminAnalytics();
        setStats({
          totalUsers: data.overview.totalUsers,
          totalCourses: data.overview.totalCourses,
          totalProjects: data.overview.totalProjects,
          totalBadges: data.overview.totalBadges
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      change: '+12%'
    },
    {
      name: 'Active Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      change: '+8%'
    },
    {
      name: 'Active Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      change: '+15%'
    },
    {
      name: 'Total Badges',
      value: stats.totalBadges,
      icon: Award,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      change: '+3%'
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your team's learning and development
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className={`${card.bgColor} p-6 rounded-lg shadow-sm`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{card.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
                <div className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {card.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Manager Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/courses" className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Plus className="h-8 w-8 text-blue-500 mb-3" />
              <p className="font-medium text-gray-900">Create Course</p>
              <p className="text-sm text-gray-500 text-center">Add new training content</p>
            </Link>
            <Link to="/projects" className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FolderKanban className="h-8 w-8 text-green-500 mb-3" />
              <p className="font-medium text-gray-900">New Project</p>
              <p className="text-sm text-gray-500 text-center">Create project assignments</p>
            </Link>
            <Link to="/manager/team" className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="h-8 w-8 text-purple-500 mb-3" />
              <p className="font-medium text-gray-900">Manage Team</p>
              <p className="text-sm text-gray-500 text-center">Assign projects to users</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;