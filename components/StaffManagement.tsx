
import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { Staff } from '../types';
import { getStaffColor } from './colors';

export const StaffManagement: React.FC = () => {
  const staff = useLiveQuery(() => db.staff.toArray(), []);
  const [newStaff, setNewStaff] = useState<Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    email: '',
    role: '',
    skills: [],
    isActive: true,
  });
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Staff | null>(null);
  const [editStaff, setEditStaff] = useState<Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    email: '',
    role: '',
    skills: [],
    isActive: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setNewStaff(prev => ({ ...prev, skills }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.staff.add({
      ...newStaff,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setNewStaff({ name: '', email: '', role: '', skills: [], isActive: true });
    setShowForm(false);
  };

  const startEdit = (member: Staff) => {
    setEditingMember(member);
    setEditStaff({
      name: member.name,
      email: member.email,
      role: member.role,
      skills: member.skills,
      isActive: member.isActive,
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setEditStaff(prev => ({ ...prev, skills }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.id) return;
    await db.staff.update(editingMember.id, {
      ...editStaff,
      updatedAt: new Date(),
    });
    setEditingMember(null);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const confirmed = window.confirm('Delete this staff member?');
    if (!confirmed) return;
    // Unassign tasks assigned to this staff to avoid dangling references
    await db.tasks.where('assigneeId').equals(id).modify({ assigneeId: undefined });
    await db.staff.delete(id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[--primary-green] text-[--primary-foreground] rounded-lg hover:opacity-90 transition-opacity"
        >
          {showForm ? 'Cancel' : '+ Add Staff'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-[--card] border border-[--border] rounded-lg space-y-4">
          <input name="name" value={newStaff.name} onChange={handleInputChange} placeholder="Name" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
          <input name="email" type="email" value={newStaff.email} onChange={handleInputChange} placeholder="Email" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
          <input name="role" value={newStaff.role} onChange={handleInputChange} placeholder="Role" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
          <input name="skills" onChange={handleSkillsChange} placeholder="Skills (comma-separated)" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
          <label className="inline-flex items-center space-x-2 text-sm">
            <input type="checkbox" checked={newStaff.isActive} onChange={e => setNewStaff(prev => ({ ...prev, isActive: e.target.checked }))} />
            <span>Active</span>
          </label>
          <button type="submit" className="px-4 py-2 bg-[--accent-green] text-white rounded-lg">Add Member</button>
        </form>
      )}

      {editingMember && (
        <form onSubmit={handleEditSubmit} className="mb-6 p-4 bg-[--card] border border-[--border] rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Edit Staff</h2>
          <input name="name" value={editStaff.name} onChange={handleEditInputChange} placeholder="Name" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
          <input name="email" type="email" value={editStaff.email} onChange={handleEditInputChange} placeholder="Email" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
          <input name="role" value={editStaff.role} onChange={handleEditInputChange} placeholder="Role" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
          <input name="skills" value={editStaff.skills.join(', ')} onChange={handleEditSkillsChange} placeholder="Skills (comma-separated)" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
          <label className="inline-flex items-center space-x-2 text-sm">
            <input type="checkbox" checked={editStaff.isActive} onChange={e => setEditStaff(prev => ({ ...prev, isActive: e.target.checked }))} />
            <span>Active</span>
          </label>
          <div className="flex space-x-3">
            <button type="button" onClick={() => setEditingMember(null)} className="px-4 py-2 rounded-lg bg-[--secondary-green] hover:opacity-80">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[--primary-green] text-[--primary-foreground] rounded-lg hover:opacity-90">Save Changes</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff?.map(member => (
          <div key={member.id} className="bg-[--card] border border-[--border] rounded-lg p-4 flex items-center space-x-4">
            <div className="relative">
              <img
                src={member.avatar || `https://i.pravatar.cc/100?u=${member.email}`}
                alt={member.name}
                className="w-16 h-16 rounded-full border-4 avatar-border"
                data-staff-id={member.id}
              />



                src={member.avatar || `https://i.pravatar.cc/100?u=${member.email}`}
                alt={member.name}
                className="w-16 h-16 rounded-full border-4"
                className="w-16 h-16 rounded-full border-4"
                style={{ borderColor: getStaffColor(member.id) }}









              />












              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full staff-dot" data-staff-id={member.id} />
            </div>
            <div>
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-sm text-[--text]/80">{member.role}</p>
              <p className="text-sm text-[--text]/60">{member.email}</p>
               <div className="mt-2 flex flex-wrap gap-1">
                {member.skills.map(skill => (
                  <span key={skill} className="text-xs bg-[--secondary-green] px-2 py-1 rounded-full">{skill}</span>
                ))}
              </div>
              <div className="mt-3 flex space-x-2">
                <button onClick={() => startEdit(member)} className="px-3 py-1 text-sm rounded bg-[--secondary-green] hover:opacity-80">Edit</button>
                <button onClick={() => handleDelete(member.id)} className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:opacity-90">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
