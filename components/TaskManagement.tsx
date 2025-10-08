import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { Task, TaskStatus } from '../types';
import { AddTaskModal } from './AddTaskModal';
import { CalendarIcon } from './icons';

export const TaskManagement: React.FC = () => {
    const tasks = useLiveQuery(() => db.tasks.toArray(), []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
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

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Task Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
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
                                                <img src={staffMap.get(task.assigneeId)?.avatar} alt={staffMap.get(task.assigneeId)?.name} className="w-6 h-6 rounded-full" title={staffMap.get(task.assigneeId)?.name}/>
                                            )}
                                             <span className={`px-2 py-0.5 text-xs rounded-full bg-[--accent-green]/20 text-[--accent-green]`}>{task.priority}</span>
                                        </div>
                                         {dueDate && (
                                            <div className={`flex items-center space-x-1 text-xs ${isPastDue ? 'text-red-500' : 'text-[--text]/60'}`}>
                                                <span className="[&>svg]:w-4 [&>svg]:h-4"><CalendarIcon /></span>
                                                <span>{dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};