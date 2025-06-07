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
        const userId = localStorage.getItem('user_id') || '';
        const [analyticsData, progressData] = await Promise.all([
          apiClient.getDashboardAnalytics(),
          userId ? apiClient.getUserProgress(userId) : Promise.resolve(null),
        ]);
        
        setAnalytics(analyticsData ?? null);
        setProgressData(progressData ?? null);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        setAnalytics(null);
        setProgressData(null);
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


  const completionRate = analytics && analytics.totalEnrollments > 0 
    ? (analytics.completedCourses / analytics.totalEnrollments) * 100 
    : 0;

  const courseProgressData = {
    labels: progressData?.courseProgress?.map((course: any) => course.courseTitle) ?? [],
    datasets: [
      {
        label: 'Progress (%)',
        data: progressData?.courseProgress?.map((course: any) => course.progress) ?? [],
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
        data: [
          analytics?.completedCourses ?? 0, 
          (analytics?.totalEnrollments ?? 0) - (analytics?.completedCourses ?? 0)
        ],
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
        <StatCard
          icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
          title="Course Enrollments"
          value={analytics?.totalEnrollments ?? 0}
          subText="Active learning"
          subIcon={<TrendingUp className="h-3 w-3 mr-1" />}
          bgColor="bg-blue-100"
        />
        <StatCard
          icon={<Target className="h-6 w-6 text-green-600" />}
          title="Completion Rate"
          value={`${Math.round(completionRate)}%`}
          subText={completionRate >= 50 ? 'Excellent' : 'Keep going!'}
          subIcon={<TrendingUp className="h-3 w-3 mr-1" />}
          bgColor="bg-green-100"
        />
        <StatCard
          icon={<Calendar className="h-6 w-6 text-purple-600" />}
          title="Active Projects"
          value={analytics?.assignedProjects ?? 0}
          subText="In progress"
          subIcon={<Clock className="h-3 w-3 mr-1" />}
          bgColor="bg-purple-100"
        />
        <StatCard
          icon={<Target className="h-6 w-6 text-yellow-600" />}
          title="Total Points"
          value={analytics?.totalPoints ?? 0}
          subText={`${analytics?.earnedBadges ?? 0} badges earned`}
          subIcon={<TrendingUp className="h-3 w-3 mr-1" />}
          bgColor="bg-yellow-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {progressData?.courseProgress?.length ? (
          <ProgressChart
            type="bar"
            data={courseProgressData}
            title="Course Progress"
          />
        ) : null}

        <ProgressChart
          type="doughnut"
          data={completionData}
          title="Course Completion Status"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Progress</h3>
        <ProgressBar label="Course Completion" value={completionRate} />
        <ProgressBar label="Badge Collection" value={analytics?.earnedBadges ?? 0} max={10} colorClass="bg-yellow-500" />
        <ProgressBar label="Project Participation" value={analytics?.assignedProjects ?? 0} max={10} colorClass="bg-purple-600" />
      </div>
    </div>
  );
};


interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subText: string;
  subIcon: React.ReactNode;
  bgColor: string;
}
const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subText, subIcon, bgColor }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm`}>
    <div className="flex items-center">
      <div className={`${bgColor} p-3 rounded-lg`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className={`text-xs text-green-600 flex items-center mt-1`}>
          {subIcon}
          {subText}
        </p>
      </div>
    </div>
  </div>
);

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  colorClass?: string;
}
const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, max = 100, colorClass = "bg-blue-600" }) => {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = (clampedValue / max) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{max === 100 ? `${Math.round(percentage)}%` : clampedValue + (max !== 100 ? ` / ${max}` : '')}</span>
      </div>
      <div className="mt-1 bg-gray-200 rounded-full h-2">
        <div 
          className={`${colorClass} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Analytics;
