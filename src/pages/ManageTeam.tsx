import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const ManageTeam: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, projectsData] = await Promise.all([
          apiClient.getUsers(),
          apiClient.getProjects(),
        ]);
        setUsers(usersData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignProject = async (userId: string, projectId: string) => {
    if (!projectId) return;
    try {
      await apiClient.assignProjectToUser(userId, projectId);
      alert('Project assigned successfully');
    } catch (error) {
      console.error('Failed to assign project:', error);
      alert('Failed to assign project');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Team Projects</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Assign Project</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="py-2 px-4 border-b">{u.firstName} {u.lastName}</td>
                <td className="py-2 px-4 border-b">{u.email}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    onChange={(e) => handleAssignProject(u._id, e.target.value)}
                    className="border rounded p-1 ml-2"
                    defaultValue=""
                  >
                    <option value="" disabled>Assign Project</option>
                    {projects.map(project => (
                      <option key={project._id} value={project._id}>{project.title}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTeam;