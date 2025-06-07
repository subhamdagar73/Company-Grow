import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Projects from './pages/Projects';
import Badges from './pages/Badges';
import Analytics from './pages/Analytics';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import PlatformSettings from './pages/PlatformSettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
             element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Layout>
                  <Courses />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Layout>
                  <Projects />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/badges"
            element={
              <ProtectedRoute>
                <Layout>
                  <Badges />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole={['admin', 'manager']}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
           path="/admin/users"
           element={
             <ProtectedRoute requireRole={['admin']}>
               <Layout>
                 <ManageUsers />
               </Layout>
             </ProtectedRoute>
           }
         />
         <Route
           path="/admin/settings"
           element={
             <ProtectedRoute requireRole={['admin']}>
               <Layout>
                 <PlatformSettings />
               </Layout>
             </ProtectedRoute>
           }
         />
         <Route path="/" element={<Navigate to="/dashboard" replace />} />
       </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;