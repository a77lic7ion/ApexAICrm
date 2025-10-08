
import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { suggestAssignee } from '../services/geminiService';
import { Task, TaskPriority, TaskStatus, Staff } from '../types';
import { AILogo } from './icons';

interface AddTaskModalProps {
  onClose: () => void;
  mode?: 'add' | 'edit';
  initialTask?: Task;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, mode = 'add', initialTask }) => {
  const staff = useLiveQuery(() => db.staff.where('isActive').equals(true).toArray(), []);
  const projects = useLiveQuery(() => db.projects.where('status').equals('Active').toArray(), []);
  const [task, setTask] = useState<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'creatorId'>>({
    title: '',
    description: '',
    status: TaskStatus.ToDo,
    priority: TaskPriority.Medium,
  });
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initialTask) {
      setTask({
        title: initialTask.title,
        description: initialTask.description,
        status: initialTask.status,
        priority: initialTask.priority,
        assigneeId: initialTask.assigneeId,
        projectId: initialTask.projectId,
        dueDate: initialTask.dueDate,
        tags: initialTask.tags,
        color: initialTask.color,
      } as any);
    }
  }, [mode, initialTask]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setTask(prev => ({ ...prev, assigneeId: value ? parseInt(value) : undefined }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setTask(prev => ({ ...prev, projectId: value ? parseInt(value) : undefined }));
  };

  const handleSuggestAssignee = async () => {
    if (!task.description || !staff) return;
    setIsSuggesting(true);
    const suggestedId = await suggestAssignee(task.description, staff);
    if (suggestedId) {
      setTask(prev => ({ ...prev, assigneeId: suggestedId }));
    }
    setIsSuggesting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'edit' && initialTask?.id) {
      await db.tasks.update(initialTask.id, {
        ...task,
        updatedAt: new Date(),
      });
    } else {
      await db.tasks.add({
        ...task,
        creatorId: 1, // Hardcoded creator
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[--card] rounded-lg shadow-xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-[--card-foreground]">{mode === 'edit' ? 'Edit Task' : 'Add New Task'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              name="title"
              value={task.title}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]"
              placeholder="Enter task title"
              title="Task title"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]"
              placeholder="Enter task description"
              title="Task description"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block mb-1 font-medium">Assignee</label>
                <div className="flex items-center space-x-2">
                    <select name="assigneeId" value={task.assigneeId || ''} onChange={handleAssigneeChange} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" title="Assignee">
                        <option value="">Unassigned</option>
                        {staff?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <button type="button" onClick={handleSuggestAssignee} disabled={isSuggesting || !task.description} className="p-2 bg-[--accent-green] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" title="Suggest assignee with AI">
                        {isSuggesting ? '...' : <AILogo className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Project</label>
              <select name="projectId" value={task.projectId || ''} onChange={handleProjectChange} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" title="Project">
                <option value="">No Project</option>
                {projects?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select name="status" value={task.status} onChange={handleInputChange} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" title="Status">
                {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Priority</label>
              <select name="priority" value={task.priority} onChange={handleInputChange} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" title="Priority">
                {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block mb-1 font-medium">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  onChange={e => setTask(p => ({...p, dueDate: e.target.valueAsDate || undefined}))}
                  className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]"
                  title="Due date"
                  placeholder="Select due date"
                />
            </div>
           </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-[--secondary-green] hover:opacity-80">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[--primary-green] text-[--primary-foreground] rounded-lg hover:opacity-90">{mode === 'edit' ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
