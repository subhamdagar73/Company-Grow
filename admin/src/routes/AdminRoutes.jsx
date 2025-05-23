import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import EmployeesPage from "../pages/EmployeesPage";
import ProjectsPage from "../pages/ProjectsPage";
import TrainingPage from "../pages/TrainingPage";

const AdminRoutes = () => (
  <Routes>
    <Route path="/admin/dashboard" element={<DashboardPage />} />
    <Route path="/admin/employees" element={<EmployeesPage />} />
    <Route path="/admin/projects" element={<ProjectsPage />} />
    <Route path="/admin/training" element={<TrainingPage />} />
    <Route path="*" element={<Navigate to="/admin/dashboard" />} />
  </Routes>
);

export default AdminRoutes;