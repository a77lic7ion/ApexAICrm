import React, { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { Project, Attachment } from '../types';

export const ProjectsManagement: React.FC = () => {
  const projects = useLiveQuery(() => db.projects.toArray(), []);
  const [uploadingProjectId, setUploadingProjectId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    status: 'Active',
    startDate: new Date(),
    endDate: undefined,
    color: '#3b82f6',
    clientName: '',
    budget: undefined,
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProject, setEditProject] = useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    status: 'Active',
    startDate: new Date(),
    endDate: undefined,
    color: '#3b82f6',
    clientName: '',
    budget: undefined,
  });

  const handleNewInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setNewProject(prev => ({ ...prev, [name]: value } as any));
  };
  const handleNewDate = (name: 'startDate' | 'endDate', date: Date | null) => {
    setNewProject(prev => ({ ...prev, [name]: date || undefined }));
  };
  const handleNewBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewProject(prev => ({ ...prev, budget: val ? parseFloat(val) : undefined }));
  };
  const submitNewProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.projects.add({
      ...newProject,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setNewProject({ name: '', description: '', status: 'Active', startDate: new Date(), endDate: undefined, color: '#3b82f6', clientName: '', budget: undefined });
    setShowForm(false);
  };

  const startEditProject = (p: Project) => {
    setEditingProject(p);
    setEditProject({
      name: p.name,
      description: p.description,
      status: p.status,
      startDate: p.startDate,
      endDate: p.endDate,
      color: p.color,
      clientName: p.clientName,
      budget: p.budget,
    });
  };
  const handleEditInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setEditProject(prev => ({ ...prev, [name]: value } as any));
  };
  const handleEditDate = (name: 'startDate' | 'endDate', date: Date | null) => {
    setEditProject(prev => ({ ...prev, [name]: date || undefined }));
  };
  const handleEditBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditProject(prev => ({ ...prev, budget: val ? parseFloat(val) : undefined }));
  };
  const submitEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.id) return;
    await db.projects.update(editingProject.id, {
      ...editProject,
      updatedAt: new Date(),
    });
    setEditingProject(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[--primary-green] text-[--primary-foreground] rounded-lg hover:opacity-90 transition-opacity">
          {showForm ? 'Cancel' : '+ Add Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitNewProject} className="mb-6 p-4 bg-[--card] border border-[--border] rounded-lg space-y-4">
          <input name="name" value={newProject.name} onChange={handleNewInput} placeholder="Name" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
          <textarea name="description" value={newProject.description} onChange={handleNewInput} placeholder="Description" rows={3} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select name="status" value={newProject.status} onChange={handleNewInput} title="Project Status" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]">
                {(['Active','Completed','On Hold'] as const).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Color</label>
              <input
                type="color"
                name="color"
                value={newProject.color || '#3b82f6'}
                onChange={handleNewInput}
                title="Project Color"
                placeholder="Choose project color"
                className="w-16 h-10 p-1 rounded bg-[--secondary-green] border border-[--border]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Start Date</label>
              <input
                type="date"
                title="Start Date"
                placeholder="YYYY-MM-DD"
                onChange={e => handleNewDate('startDate', e.target.valueAsDate)}
                className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">End Date</label>
              <input
                type="date"
                title="End Date"
                placeholder="YYYY-MM-DD"
                onChange={e => handleNewDate('endDate', e.target.valueAsDate)}
                className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input name="clientName" value={newProject.clientName || ''} onChange={handleNewInput} placeholder="Client Name" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
            <input name="budget" type="number" step="0.01" value={newProject.budget ?? ''} onChange={handleNewBudget} placeholder="Budget" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
          </div>
          <button type="submit" className="px-4 py-2 bg-[--accent-green] text-white rounded-lg">Create Project</button>
        </form>
      )}

      {editingProject && (
        <form onSubmit={submitEditProject} className="mb-6 p-4 bg-[--card] border border-[--border] rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Edit Project</h2>
          <input name="name" value={editProject.name} onChange={handleEditInput} placeholder="Name" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
          <textarea name="description" value={editProject.description} onChange={handleEditInput} placeholder="Description" rows={3} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select name="status" value={editProject.status} onChange={handleEditInput} title="Project Status" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]">
                {(['Active','Completed','On Hold'] as const).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Color</label>
              <input
                type="color"
                name="color"
                value={editProject.color || '#3b82f6'}
                onChange={handleEditInput}
                title="Project Color"
                placeholder="Choose project color"
                className="w-16 h-10 p-1 rounded bg-[--secondary-green] border border-[--border]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Start Date</label>
              <input
                type="date"
                value={editProject.startDate ? new Date(editProject.startDate).toISOString().slice(0,10) : ''}
                onChange={e => handleEditDate('startDate', e.target.valueAsDate)}
                title="Start Date"
                placeholder="YYYY-MM-DD"
                className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">End Date</label>
              <input
                type="date"
                value={editProject.endDate ? new Date(editProject.endDate).toISOString().slice(0,10) : ''}
                onChange={e => handleEditDate('endDate', e.target.valueAsDate)}
                title="End Date"
                placeholder="YYYY-MM-DD"
                className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input name="clientName" value={editProject.clientName || ''} onChange={handleEditInput} placeholder="Client Name" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
            <input name="budget" type="number" step="0.01" value={editProject.budget ?? ''} onChange={handleEditBudget} placeholder="Budget" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
          </div>
          <div className="flex space-x-3">
            <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 rounded-lg bg-[--secondary-green] hover:opacity-80">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[--primary-green] text-[--primary-foreground] rounded-lg hover:opacity-90">Save Changes</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            uploadingProjectId={uploadingProjectId}
            setUploadingProjectId={setUploadingProjectId}
            onEdit={() => startEditProject(project)}
            onDelete={async () => {
              if (!project.id) return;
              const confirmed = window.confirm('Delete this project and its attachments?');
              if (!confirmed) return;
              await db.attachments.where('projectId').equals(project.id).delete();
              await db.projects.delete(project.id);
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ProjectCard: React.FC<{ project: Project; uploadingProjectId: number | null; setUploadingProjectId: (id: number | null) => void; onEdit: () => void; onDelete: () => void }> = ({ project, uploadingProjectId, setUploadingProjectId, onEdit, onDelete }) => {
  const attachments = useLiveQuery(() => db.attachments.where('projectId').equals(project.id as number).toArray(), [project.id]);
  const isUploading = uploadingProjectId === project.id;

  const handleFiles = async (files: FileList | null) => {
    if (!files || !project.id) return;
    setUploadingProjectId(project.id);
    try {
      const adds = Array.from(files).map(async (file) => {
        const blob = new Blob([await file.arrayBuffer()], { type: file.type || 'application/octet-stream' });
        await db.attachments.add({
          projectId: project.id!,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          data: blob,
          createdAt: new Date(),
        });
      });
      await Promise.all(adds);
    } finally {
      setUploadingProjectId(null);
    }
  };

  const handleDeleteAttachment = async (id?: number) => {
    if (!id) return;
    const confirmed = window.confirm('Delete this attachment?');
    if (!confirmed) return;
    await db.attachments.delete(id);
  };

  return (
    <div className="bg-[--card] border border-[--border] rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">{project.name}</h3>
          <p className="text-sm text-[--text]/70">{project.description}</p>
          <div className="text-xs text-[--text]/60 mt-1">Status: {project.status}</div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onEdit} className="px-3 py-1 text-sm rounded bg-[--secondary-green] hover:opacity-80">Edit</button>
          <button onClick={onDelete} className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:opacity-90">Delete</button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Append files, docs or images</label>
        <input
          type="file"
          multiple
          onChange={e => handleFiles(e.target.files)}
          className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]"
          aria-label="Upload attachments"
          title="Select files to attach to this project"
        />
        {isUploading && <div className="text-xs text-[--text]/60">Uploading...</div>}
      </div>

      <div>
        <h4 className="font-semibold mb-2">Attachments ({attachments?.length || 0})</h4>
        <div className="space-y-2">
          {attachments?.map(att => (
            <AttachmentRow key={att.id} attachment={att} onDelete={() => handleDeleteAttachment(att.id)} />
          ))}
          {attachments && attachments.length === 0 && (
            <div className="text-sm text-[--text]/60">No attachments yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const AttachmentRow: React.FC<{ attachment: Attachment; onDelete: () => void }> = ({ attachment, onDelete }) => {
  const isImage = attachment.type.startsWith('image/');
  const objectUrl = useMemo(() => URL.createObjectURL(attachment.data), [attachment.data]);

  return (
    <div className="flex items-center justify-between bg-[--secondary-green] rounded p-2">
      <div className="flex items-center space-x-3">
        {isImage ? (
          <img src={objectUrl} alt={attachment.name} className="w-12 h-12 object-cover rounded" />
        ) : (
          <div className="w-12 h-12 flex items-center justify-center rounded bg-[--card] border border-[--border] text-xs">{attachment.type || 'file'}</div>
        )}
        <div>
          <div className="text-sm font-medium">{attachment.name}</div>
          <div className="text-xs text-[--text]/60">{(attachment.size / 1024).toFixed(1)} KB • {new Date(attachment.createdAt).toLocaleString()}</div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <a href={objectUrl} download={attachment.name} className="px-3 py-1 text-sm rounded bg-[--primary-green] text-[--primary-foreground] hover:opacity-90">Download</a>
        <button onClick={onDelete} className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:opacity-90">Delete</button>
      </div>
    </div>
  );
};

export default ProjectsManagement;