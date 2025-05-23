import React from "react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow px-6 py-4 flex justify-between items-center border-b border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800">CompanyGrow Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Admin</span>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
