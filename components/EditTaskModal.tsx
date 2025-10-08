import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { Task, TaskStatus, TaskPriority, Staff } from '../types';

interface EditTaskModalProps {
    task: Task;
    onClose: () => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose }) => {
    const [formData, setFormData] = useState<Task>(task);
    const staff = useLiveQuery(() => db.staff.toArray(), []);

    useEffect(() => {
        setFormData(task);
    }, [task]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value ? new Date(value) : undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await db.tasks.update(task.id!, {
            ...formData,
            assigneeId: Number(formData.assigneeId) || undefined,
            updatedAt: new Date(),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-[--card] p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Task Title" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
                    <div className="grid grid-cols-2 gap-4">
                        <select name="assigneeId" value={formData.assigneeId || ''} onChange={handleChange} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]">
                            <option value="">Unassigned</option>
                            {staff?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]">
                            {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]">
                            {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <input name="dueDate" type="date" value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''} onChange={handleDateChange} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 text-black">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};