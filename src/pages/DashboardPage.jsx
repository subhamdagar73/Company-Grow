import React from "react";
import DashboardContent from "../components/common/DashboardContent";
import Footer from "../components/common/Footer";

const DashboardPage = () => {
  return (
    <>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white shadow rounded p-6">📈 Employees: 30</div>
          <div className="bg-white shadow rounded p-6">📂 Projects: 12</div>
          <div className="bg-white shadow rounded p-6">🎓 Courses: 15</div>
          <div className="bg-white shadow rounded p-6">✅ Trainings Completed: 67%</div>
        </div>
      </div>
      <DashboardContent />
      <Footer />
    </>
  );
};

export default DashboardPage;
