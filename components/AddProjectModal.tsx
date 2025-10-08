import React, { useState } from 'react';
import { db } from '../services/db';
import { Project } from '../types';

interface AddProjectModalProps {
    onClose: () => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ onClose }) => {
    const [project, setProject] = useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>({
        name: '',
        description: '',
        status: 'Active',
        startDate: new Date(),
        clientName: '',
        budget: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProject(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProject(prev => ({ ...prev, [name]: new Date(value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await db.projects.add({
            ...project,
            budget: Number(project.budget),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-[--card] p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={project.name} onChange={handleChange} placeholder="Project Name" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
                    <textarea name="description" value={project.description} onChange={handleChange} placeholder="Description" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
                    <input name="clientName" value={project.clientName} onChange={handleChange} placeholder="Client Name" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
                    <input name="budget" type="number" value={project.budget} onChange={handleChange} placeholder="Budget" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date</label>
                            <input name="startDate" type="date" value={project.startDate.toISOString().split('T')[0]} onChange={handleDateChange} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Date (Optional)</label>
                            <input name="endDate" type="date" value={project.endDate ? project.endDate.toISOString().split('T')[0] : ''} onChange={handleDateChange} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
                        </div>
                    </div>
                    <select name="status" value={project.status} onChange={handleChange} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]">
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                    </select>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 text-black">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-[--primary-green] text-white">Add Project</button>
                    </div>
                </form>
            </div>
        </div>
    );
};