import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-yellow-300 text-gray-900 font-semibold px-4 py-2 rounded"
      : "text-white hover:bg-yellow-100 hover:text-gray-800 px-4 py-2 rounded transition";

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen sticky top-0 p-6">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>📊 Dashboard</NavLink>
        <NavLink to="/admin/employees" className={linkClass}>👥 Employees</NavLink>
        <NavLink to="/admin/projects" className={linkClass}>🧠 Projects</NavLink>
        <NavLink to="/admin/training" className={linkClass}>📚 Training</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
