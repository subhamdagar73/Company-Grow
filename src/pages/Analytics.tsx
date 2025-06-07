import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import ProgressChart from '../components/charts/ProgressChart';
import ReportGenerator from '../components/reports/ReportGenerator';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Target,
  Clock
} from 'lucide-react';

interface AnalyticsData {
  totalEnrollments: number;
  completedCourses: number;
  earnedBadges: number;
  assignedProjects: number;
  totalPoints: number;
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [analyticsData, progressData] = await Promise.all([
          apiClient.getDashboardAnalytics(),
          apiClient.getUserProgress(localStorage.getItem('user_id') || '')
        ]);
        
        setAnalytics(analyticsData);
        setProgressData(progressData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const completionRate = analytics ? 
    (analytics.totalEnrollments > 0 ? (analytics.completedCourses / analytics.totalEnrollments * 100) : 0) : 0;

  const courseProgressData = {
    labels: progressData?.courseProgress?.map((course: any) => course.courseTitle) || [],
    datasets: [
      {
        label: 'Progress (%)',
        data: progressData?.courseProgress?.map((course: any) => course.progress) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const completionData = {
    labels: ['Completed', 'In Progress'],
    datasets: [
      {
        data: [analytics?.completedCourses || 0, (analytics?.totalEnrollments || 0) - (analytics?.completedCourses || 0)],
        backgroundColor: ['#10B981', '#F59E0B'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your learning progress and performance metrics
          </p>
        </div>
        <ReportGenerator 
          data={analytics} 
          title="Performance Analytics Report" 
          type="user"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Course Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.totalEnrollments || 0}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Active learning
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(completionRate)}%</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {completionRate >= 50 ? 'Excellent' : 'Keep going!'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.assignedProjects || 0}</p>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                In progress
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.totalPoints || 0}</p>
              <p className="text-xs text-yellow-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {analytics?.earnedBadges || 0} badges earned
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {progressData?.courseProgress && progressData.courseProgress.length > 0 && (
          <ProgressChart
            type="bar"
            data={courseProgressData}
            title="Course Progress"
          />
        )}
        
        <ProgressChart
          type="doughnut"
          data={completionData}
          title="Course Completion Status"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Course Completion</span>
              <span className="font-medium">{Math.round(completionRate)}%</span>
            </div>
            <div className="mt-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Badge Collection</span>
              <span className="font-medium">{analytics?.earnedBadges || 0} badges</span>
            </div>
            <div className="mt-1 bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full w-3/4 transition-all duration-500"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Project Participation</span>
              <span className="font-medium">{analytics?.assignedProjects || 0} projects</span>
            </div>
            <div className="mt-1 bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full w-3/5 transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;