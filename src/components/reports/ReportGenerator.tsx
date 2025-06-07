import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Download, FileText } from 'lucide-react';

interface ReportGeneratorProps {
  data: any;
  title: string;
  type: 'user' | 'admin';
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ data, title, type }) => {
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    
    try {
      const pdf = new jsPDF();
      
      pdf.setFontSize(20);
      pdf.text(title, 20, 30);
      
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      
      let yPosition = 60;
      
      if (type === 'user') {
        pdf.setFontSize(16);
        pdf.text('Performance Summary', 20, yPosition);
        yPosition += 20;
        
        pdf.setFontSize(12);
        pdf.text(`Total Enrollments: ${data.totalEnrollments || 0}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`Completed Courses: ${data.completedCourses || 0}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`Earned Badges: ${data.earnedBadges || 0}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`Total Points: ${data.totalPoints || 0}`, 20, yPosition);
        yPosition += 20;
        
        if (data.courseProgress && data.courseProgress.length > 0) {
          pdf.setFontSize(16);
          pdf.text('Course Progress', 20, yPosition);
          yPosition += 15;
          
          data.courseProgress.forEach((course: any) => {
            pdf.setFontSize(10);
            pdf.text(`${course.courseTitle}: ${course.progress}%`, 25, yPosition);
            yPosition += 8;
          });
        }
      } else {
        pdf.setFontSize(16);
        pdf.text('Platform Overview', 20, yPosition);
        yPosition += 20;
        
        pdf.setFontSize(12);
        pdf.text(`Total Users: ${data.overview?.totalUsers || 0}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`Total Courses: ${data.overview?.totalCourses || 0}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`Total Projects: ${data.overview?.totalProjects || 0}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`Total Badges: ${data.overview?.totalBadges || 0}`, 20, yPosition);
      }
      
      pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}-report.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report');
    } finally {
      setGenerating(false);
    }
  };

  const exportCSV = () => {
    let csvContent = '';
    
    if (type === 'user') {
      csvContent = 'Metric,Value\n';
      csvContent += `Total Enrollments,${data.totalEnrollments || 0}\n`;
      csvContent += `Completed Courses,${data.completedCourses || 0}\n`;
      csvContent += `Earned Badges,${data.earnedBadges || 0}\n`;
      csvContent += `Total Points,${data.totalPoints || 0}\n`;
    } else {
      csvContent = 'Metric,Value\n';
      csvContent += `Total Users,${data.overview?.totalUsers || 0}\n`;
      csvContent += `Total Courses,${data.overview?.totalCourses || 0}\n`;
      csvContent += `Total Projects,${data.overview?.totalProjects || 0}\n`;
      csvContent += `Total Badges,${data.overview?.totalBadges || 0}\n`;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex space-x-3">
      <button
        onClick={generatePDF}
        disabled={generating}
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
      >
        <FileText className="h-4 w-4 mr-2" />
        {generating ? 'Generating...' : 'Export PDF'}
      </button>
      
      <button
        onClick={exportCSV}
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </button>
    </div>
  );
};

export default ReportGenerator;