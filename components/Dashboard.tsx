
import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { db } from '../services/db';
import { TaskStatus } from '../types';

export const Dashboard: React.FC = () => {
  const tasks = useLiveQuery(() => db.tasks.toArray(), []);
  const staff = useLiveQuery(() => db.staff.toArray(), []);
  const projects = useLiveQuery(() => db.projects.toArray(), []);

  const taskStatusCounts = React.useMemo(() => {
    if (!tasks) return {};
    return tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<TaskStatus, number>);
  }, [tasks]);

  const tasksPerProjectData = React.useMemo(() => {
    if (!tasks || !projects) return [];
    return projects.map(project => ({
      name: project.name,
      tasks: tasks.filter(task => task.projectId === project.id).length,
    }));
  }, [tasks, projects]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[--text]">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={tasks?.length ?? 0} />
        <StatCard title="Active Staff" value={staff?.filter(s => s.isActive).length ?? 0} />
        <StatCard title="Active Projects" value={projects?.filter(p => p.status === 'Active').length ?? 0} />
        <StatCard title="Tasks In Progress" value={taskStatusCounts[TaskStatus.InProgress] ?? 0} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-[--card] rounded-lg border border-[--border] shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[--card-foreground]">Tasks per Project</h2>
           <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tasksPerProjectData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--text)" />
                    <YAxis stroke="var(--text)" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                    <Legend />
                    <Bar dataKey="tasks" fill="var(--primary-green)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="p-4 bg-[--card] rounded-lg border border-[--border] shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-[--card-foreground]">Task Status Distribution</h2>
            <div className="flex flex-col space-y-2">
                {Object.values(TaskStatus).map(status => (
                    <div key={status} className="flex justify-between items-center">
                        <span>{status}</span>
                        <span className="font-bold">{taskStatusCounts[status] || 0}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number | string }> = ({ title, value }) => (
  <div className="bg-[--card] p-6 rounded-lg border border-[--border] shadow-sm">
    <h3 className="text-sm font-medium text-[--text]">{title}</h3>
    <p className="text-3xl font-bold text-[--primary-green]">{value}</p>
  </div>
);
