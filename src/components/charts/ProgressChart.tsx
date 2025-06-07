import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ProgressChartProps {
  type: 'bar' | 'doughnut';
  data: any;
  options?: any;
  title?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ type, data, options, title }) => {
  const defaultOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    ...options,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {type === 'bar' ? (
        <Bar data={data} options={defaultOptions} />
      ) : (
        <Doughnut data={data} options={defaultOptions} />
      )}
    </div>
  );
};

export default ProgressChart;