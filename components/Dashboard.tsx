
import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { db } from '../services/db';
import { TaskStatus, TaskPriority } from '../types';
import { getStaffColor, priorityColors, hexWithOpacity } from './colors';

export const Dashboard: React.FC = () => {
  const tasks = useLiveQuery(() => db.tasks.toArray(), []);
  const staff = useLiveQuery(() => db.staff.toArray(), []);
  const projects = useLiveQuery(() => db.projects.toArray(), []);
  const [topic, setTopic] = React.useState<'total' | 'active-staff' | 'active-projects' | 'in-progress'>('total');

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

  // Active Projects per Staff + Overdue tasks per Staff
  const activeProjectsByStaff = React.useMemo(() => {
    if (!tasks || !staff) return [] as Array<{ name: string; staffId: number; activeProjects: number; overdue: number }>;
    const today = new Date(); today.setHours(0,0,0,0);
    const byStaffProjects = new Map<number, Set<number>>();
    const overdueByStaff = new Map<number, number>();
    tasks.forEach(t => {
      if (!t.assigneeId) return;
      const isActiveTask = t.status !== TaskStatus.Done;
      if (isActiveTask && t.projectId != null) {
        if (!byStaffProjects.has(t.assigneeId)) byStaffProjects.set(t.assigneeId, new Set());
        byStaffProjects.get(t.assigneeId)!.add(t.projectId);
      }
      const isOverdue = !!t.dueDate && new Date(t.dueDate) < today && t.status !== TaskStatus.Done;
      if (isOverdue) overdueByStaff.set(t.assigneeId, (overdueByStaff.get(t.assigneeId) || 0) + 1);
    });
    return (staff || []).map(s => ({
      name: s.name,
      staffId: s.id as number,
      activeProjects: (s.id != null && byStaffProjects.get(s.id)) ? byStaffProjects.get(s.id as number)!.size : 0,
      overdue: (s.id != null && overdueByStaff.get(s.id as number)) || 0,
    }));
  }, [tasks, staff]);

  // Tasks In Progress updated per day (last 14 days), stacked by staff
  const progressByDayData = React.useMemo(() => {
    if (!tasks || !staff) return [] as Array<Record<string, number | string>>;
    const days: string[] = [];
    const today = new Date(); today.setHours(0,0,0,0);
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
      days.push(label);
    }
    const staffIds = (staff || []).map(s => s.id as number);
    const init = days.map(l => ({ day: l } as Record<string, number | string>));
    const filtered = tasks.filter(t => t.status === TaskStatus.InProgress);
    filtered.forEach(t => {
      const d = new Date(t.updatedAt); const dd = new Date(d); dd.setHours(0,0,0,0);
      const label = dd.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
      const row = init.find(r => r.day === label);
      if (!row) return;
      if (t.assigneeId && staffIds.includes(t.assigneeId)) {
        const key = String(t.assigneeId);
        row[key] = ((row[key] as number) || 0) + 1;
      }
    });
    return init;
  }, [tasks, staff]);

  // Tasks by priority per staff (stacked)
  const priorityByStaff = React.useMemo(() => {
    if (!tasks || !staff) return [] as Array<{ name: string; Low: number; Medium: number; High: number; Urgent: number; staffId: number }>;
    const grouped = new Map<number, { Low: number; Medium: number; High: number; Urgent: number }>();
    tasks.forEach(t => {
      if (!t.assigneeId) return;
      const g = grouped.get(t.assigneeId) || { Low: 0, Medium: 0, High: 0, Urgent: 0 };
      g[t.priority] = (g[t.priority] || 0) + 1;
      grouped.set(t.assigneeId, g);
    });
    return (staff || []).map(s => ({
      name: s.name,
      staffId: s.id as number,
      Low: grouped.get(s.id as number)?.Low || 0,
      Medium: grouped.get(s.id as number)?.Medium || 0,
      High: grouped.get(s.id as number)?.High || 0,
      Urgent: grouped.get(s.id as number)?.Urgent || 0,
    }));
  }, [tasks, staff]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[--text]">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={tasks?.length ?? 0} active={topic==='total'} onClick={() => setTopic('total')} />
        <StatCard title="Active Staff" value={staff?.filter(s => s.isActive).length ?? 0} active={topic==='active-staff'} onClick={() => setTopic('active-staff')} />
        <StatCard title="Active Projects" value={projects?.filter(p => p.status === 'Active').length ?? 0} active={topic==='active-projects'} onClick={() => setTopic('active-projects')} />
        <StatCard title="Tasks In Progress" value={taskStatusCounts[TaskStatus.InProgress] ?? 0} active={topic==='in-progress'} onClick={() => setTopic('in-progress')} />
      </div>

      {/* Charts - topic aware */}
      <div className="grid grid-cols-1 gap-6">
        {topic === 'total' && (
          <div className="p-4 bg-[--card] rounded-lg border border-[--border] shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-[--card-foreground]">Tasks per Project</h2>
            <ResponsiveContainer width="100%" height={320}>
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
        )}

        {topic === 'active-projects' && (
          <div className="p-4 bg-[--card] rounded-lg border border-[--border] shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-[--card-foreground]">Active Projects and Overdue Tasks per Staff</h2>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={activeProjectsByStaff} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text)" />
                <YAxis stroke="var(--text)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                <Legend />
                <Bar dataKey="activeProjects" name="Active Projects">
                  {activeProjectsByStaff.map((row, i) => {
                    const color = (staff || []).find(s => s.id === row.staffId)?.color || getStaffColor(row.staffId);
                    return <Cell key={`ap-${i}`} fill={hexWithOpacity(color, 0.8)} />;
                  })}
                </Bar>
                <Bar dataKey="overdue" name="Overdue Tasks" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {topic === 'in-progress' && (
          <div className="p-4 bg-[--card] rounded-lg border border-[--border] shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-[--card-foreground]">Tasks Updated (In Progress) - Last 14 Days</h2>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={progressByDayData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--text)" />
                <YAxis stroke="var(--text)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                <Legend />
                {(staff || []).map(s => (
                  <Bar key={`st-${s.id}`} dataKey={String(s.id)} stackId="a" name={s.name} fill={hexWithOpacity(s.color || getStaffColor(s.id as number), 0.9)} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {topic === 'active-staff' && (
          <div className="p-4 bg-[--card] rounded-lg border border-[--border] shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-[--card-foreground]">Tasks by Priority per Staff</h2>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={priorityByStaff} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text)" />
                <YAxis stroke="var(--text)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                <Legend />
                <Bar dataKey="Low" stackId="a" fill={hexWithOpacity(priorityColors[TaskPriority.Low], 0.9)} />
                <Bar dataKey="Medium" stackId="a" fill={hexWithOpacity(priorityColors[TaskPriority.Medium], 0.9)} />
                <Bar dataKey="High" stackId="a" fill={hexWithOpacity(priorityColors[TaskPriority.High], 0.9)} />
                <Bar dataKey="Urgent" stackId="a" fill={hexWithOpacity(priorityColors[TaskPriority.Urgent], 0.9)} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number | string; active?: boolean; onClick?: () => void }> = ({ title, value, active, onClick }) => (
  <button type="button" onClick={onClick} className={`bg-[--card] p-6 rounded-lg border shadow-sm text-left transition-colors ${active ? 'border-[--primary-green]' : 'border-[--border] hover:border-[--accent-green]'}`}>
    <h3 className="text-sm font-medium text-[--text]">{title}</h3>
    <p className="text-3xl font-bold text-[--primary-green]">{value}</p>
  </button>
);
