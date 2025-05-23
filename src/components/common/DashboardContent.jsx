import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const activeProjects = [
  { name: "New Onboarding Flow", completed: 18, total: 25, deadline: "2024-11-15" },
  { name: "Q4 Performance Review System", completed: 5, total: 12, deadline: "2024-12-01" },
  { name: "Skills Gap Analysis Report", completed: 7, total: 7, deadline: "2024-10-28" },
  { name: "Employee Wellness Program", completed: 10, total: 15, deadline: "2024-11-20" },
  { name: "Platform Security Audit", completed: 2, total: 8, deadline: "2024-12-10" }
];

const recentActivity = [
  "Sarah Lee completed 'Project Management Basics' course.",
  "Project 'New Onboarding Flow' task 'Define requirements' updated by John Smith.",
  "New skill 'Data Analysis' added to Michael Brown's profile.",
  "Upcoming deadline for 'Q4 Performance Review System' project.",
  "Emily Davis enrolled in 'Advanced Communication Skills' course.",
  "Team meeting scheduled for 'Skills Gap Analysis Report'.",
  "Performance feedback submitted for Alex Johnson.",
  "Training reminder sent for 'Cybersecurity Fundamentals'.",
  "Project 'Employee Wellness Program' task 'Plan activities' completed.",
  "Badge 'Training Champion' awarded to Jessica White."
];

const riskData = [
  { week: "Week 1", v1: 2, v2: 3, v3: 1 },
  { week: "Week 2", v1: 1, v2: 2, v3: 2 },
  { week: "Week 3", v1: 3, v2: 1, v3: 3 },
  { week: "Week 4", v1: 2, v2: 2, v3: 4 },
  { week: "Week 5", v1: 1, v2: 3, v3: 5 }
];

const controlData = [
  { week: "Week 1", c1: 90, c2: 30 },
  { week: "Week 2", c1: 85, c2: 35 },
  { week: "Week 3", c1: 95, c2: 25 },
  { week: "Week 4", c1: 88, c2: 30 },
  { week: "Week 5", c1: 92, c2: 26 }
];

export default function DashboardContent() {
  return (
    <div className="p-6 space-y-6">
      {/* Active Projects */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-blue-500">📘</span> Active Projects
        </h2>
        <div className="divide-y mt-4">
          {activeProjects.map((project, idx) => (
            <div key={idx} className="py-2 flex justify-between items-center">
              <div>
                <p className="font-medium">{project.name}</p>
                <p className="text-sm text-gray-500">
                  {project.completed}/{project.total} tasks completed
                </p>
              </div>
              <div className="text-sm text-gray-500">📅 {project.deadline}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4 text-blue-500 font-medium cursor-pointer">View All Projects</div>
      </div>

      {/* Analytics */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inherent Risk */}
          <div>
            <h3 className="text-md font-medium mb-2">Inherent Risk</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={riskData}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="v1" fill="#00BCD4" />
                <Bar dataKey="v2" fill="#FF9800" />
                <Bar dataKey="v3" fill="#263238" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Assigned Controls */}
          <div>
            <h3 className="text-md font-medium mb-2">Assigned Controls</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={controlData}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="c1" fill="#FFEB3B" />
                <Bar dataKey="c2" fill="#FF9800" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-2">
          {recentActivity.map((activity, idx) => (
            <li key={idx} className="text-sm text-gray-700 border-b pb-1">{activity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
