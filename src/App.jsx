import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import Sidebar from "./components/common/Sidebar";
import Navbar from "./components/common/Navbar";

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="p-4">
            <AdminRoutes />
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;