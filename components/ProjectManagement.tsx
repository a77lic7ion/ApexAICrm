import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { Project } from '../types';
import { AddProjectModal } from './AddProjectModal';
import { EditProjectModal } from './EditProjectModal';

export const ProjectManagement: React.FC = () => {
    const projects = useLiveQuery(() => db.projects.toArray(), []);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const handleEditClick = (project: Project) => {
        setSelectedProject(project);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = async (projectId: number) => {
        if (window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks and cannot be undone.')) {
            try {
                const tasksToDelete = await db.tasks.where('projectId').equals(projectId).toArray();
                const taskIds = tasksToDelete.map(t => t.id!);
                await db.tasks.bulkDelete(taskIds);
                await db.projects.delete(projectId);
            } catch (error) {
                console.error("Failed to delete project:", error);
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Project Management</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-[--primary-green] text-[--primary-foreground] rounded-lg hover:opacity-90 transition-opacity"
                >
                    + Add Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects?.map(project => (
                    <div key={project.id} className="bg-[--card] border border-[--border] rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg">{project.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full text-white ${project.status === 'Active' ? 'bg-green-500' : project.status === 'Completed' ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-sm text-[--text]/80 mt-2">{project.description}</p>
                        <div className="mt-4 text-sm text-[--text]/60">
                            <p>Client: {project.clientName || 'N/A'}</p>
                            <p>Budget: ${project.budget?.toLocaleString() || 'N/A'}</p>
                            <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
                            <p>End Date: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                         <div className="mt-4 flex justify-end space-x-2">
                            <button onClick={() => handleEditClick(project)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                            <button onClick={() => handleDeleteClick(project.id!)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {isAddModalOpen && <AddProjectModal onClose={() => setIsAddModalOpen(false)} />}
            {isEditModalOpen && selectedProject && (
                <EditProjectModal project={selectedProject} onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedProject(null);
                }} />
            )}
        </div>
    );
};