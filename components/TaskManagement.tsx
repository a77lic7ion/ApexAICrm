import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { Task, TaskStatus, TaskPriority } from '../types';
import { getStaffColor, priorityColors, hexWithOpacity } from './colors';
import { AddTaskModal } from './AddTaskModal';
import { CalendarIcon } from './icons';

export const TaskManagement: React.FC = () => {
    const tasks = useLiveQuery(() => db.tasks.toArray(), []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    
    const staff = useLiveQuery(() => db.staff.toArray(), []);
    const staffMap = React.useMemo(() => {
        if (!staff) return new Map();
        return new Map(staff.map(s => [s.id, s]));
    }, [staff]);

    const tasksByStatus = React.useMemo(() => {
        if (!tasks) return {} as Record<TaskStatus, Task[]>;
        return tasks.reduce((acc, task) => {
            if (!acc[task.status]) {
                acc[task.status] = [];
            }
            acc[task.status].push(task);
            return acc;
        }, {} as Record<TaskStatus, Task[]>);
    }, [tasks]);

    const handleDeleteTask = async (id?: number) => {
        if (!id) return;
        const confirmed = window.confirm('Delete this task?');
        if (!confirmed) return;
        await db.tasks.delete(id);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Task Management</h1>
                <button
                    onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}
                    className="px-4 py-2 bg-[--primary-green] text-[--primary-foreground] rounded-lg hover:opacity-90 transition-opacity"
                >
                    + Add Task
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.values(TaskStatus).map(status => (
                    <div key={status} className="bg-[--secondary-green] rounded-lg p-4">
                        <h2 className="font-bold mb-4 text-center">{status} ({tasksByStatus[status]?.length || 0})</h2>
                        <div className="space-y-4">
                            {(tasksByStatus[status] || []).map(task => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                                const isPastDue = dueDate && dueDate < today;

                                return (
                                <div key={task.id} className="bg-[--card] border border-[--border] rounded-lg p-3">
                                    <h3 className="font-semibold">{task.title}</h3>
                                    <p className="text-sm text-[--text]/70 mt-1 break-words">{task.description}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            {task.assigneeId && staffMap.get(task.assigneeId) && (
                                                <div className="relative">
                                                  <img
                                                    src={staffMap.get(task.assigneeId)?.avatar}
                                                    alt={staffMap.get(task.assigneeId)?.name}
                                                    className="w-6 h-6 rounded-full border-2 avatar-border"
                                                    title={staffMap.get(task.assigneeId)?.name}
                                                  />
                                                  <span
                                                    className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full status-dot"
                                                  />
                                                    src={staffMap.get(task.assigneeId)?.avatar}
                                                    alt={staffMap.get(task.assigneeId)?.name}
                                                    className="w-6 h-6 rounded-full border-2"
                                                    title={staffMap.get(task.assigneeId)?.name}
                                                    style={{ borderColor: getStaffColor(task.assigneeId) }}
                                                    style={{ borderColor: getStaffColor(task.assigneeId) }}
                                                  />











                                                  <span
                                                    className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: getStaffColor(task.assigneeId) }}
                                                  />
                                                </div>
                                            )}
                                            <span
                                              className="px-2 py-0.5 text-xs rounded-full"
                                              style={{
                                                backgroundColor: hexWithOpacity(priorityColors[task.priority] || '#10b981', 0.2),
                                                color: priorityColors[task.priority] || '#065f46',
                                              }}
                                            >
                                              {task.priority}
                                            </span>
                                        </div>
                                         {dueDate && (
                                            <div className={`flex items-center space-x-1 text-xs ${isPastDue ? 'text-red-500' : 'text-[--text]/60'}`}>
                                                <span className="[&>svg]:w-4 [&>svg]:h-4"><CalendarIcon /></span>
                                                <span>{dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3 flex space-x-2">
                                        <button onClick={() => { setSelectedTask(task); setIsModalOpen(true); }} className="px-3 py-1 text-sm rounded bg-[--secondary-green] hover:opacity-80">Edit</button>
                                        <button onClick={() => handleDeleteTask(task.id)} className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:opacity-90">Delete</button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} mode={selectedTask ? 'edit' : 'add'} initialTask={selectedTask ?? undefined} />}
        </div>
    );
};