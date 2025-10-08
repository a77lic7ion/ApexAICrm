import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Project } from '../types';

interface EditProjectModalProps {
    project: Project;
    onClose: () => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onClose }) => {
    const [formData, setFormData] = useState<Project>(project);

    useEffect(() => {
        setFormData(project);
    }, [project]);

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
        await db.projects.update(project.id!, {
            ...formData,
            budget: Number(formData.budget),
            updatedAt: new Date(),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-[--card] p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Project Name" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
                    <input name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Client Name" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
                    <input name="budget" type="number" value={formData.budget} onChange={handleChange} placeholder="Budget" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date</label>
                            <input name="startDate" type="date" value={new Date(formData.startDate).toISOString().split('T')[0]} onChange={handleDateChange} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Date (Optional)</label>
                            <input name="endDate" type="date" value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''} onChange={handleDateChange} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
                        </div>
                    </div>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]">
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                    </select>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 text-black">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};