import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

import { useAuth } from '../contexts/AuthContext';

const ManageUsers: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.getProjects();
        setProjects(response);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    const fetchUsers = async () => {
      try {
        const response = await apiClient.getUsers();
        setUsers(response);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchProjects();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await apiClient.updateUserRole(userId, role);
      setUsers(users.map(u => u._id === userId ? { ...u, role } : u));
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleAssignProject = async (userId: string, projectId: string) => {
    if (!projectId) return;
    try {
      await apiClient.assignProjectToUser(userId, projectId);
      // Optionally, you can refresh data or give feedback
      alert('Project assigned successfully');
    } catch (error) {
      console.error('Failed to assign project:', error);
      alert('Failed to assign project');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b">{user.firstName} {user.lastName}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  {user.role !== 'admin' && (
                    <select
                      defaultValue={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}
                  {(user.role !== 'admin') && (
                    <select
                      onChange={(e) => handleAssignProject(user._id, e.target.value)}
                      className="border rounded p-1 ml-2"
                      defaultValue=""
                    >
                      <option value="" disabled>Assign Project</option>
                      {projects.map(project => (
                        <option key={project._id} value={project._id}>{project.title}</option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;