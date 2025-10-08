import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { Staff } from '../types';
import { getStaffColor, brightColors } from './colors';

export const StaffManagement: React.FC = () => {
  const staff = useLiveQuery(() => db.staff.toArray(), []);
  const [newStaff, setNewStaff] = useState<Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    email: '',
    role: '',
    skills: [],
    isActive: true,
    color: undefined,
  });
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Staff | null>(null);
  const [editStaff, setEditStaff] = useState<Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    email: '',
    role: '',
    skills: [],
    isActive: true,
    color: undefined,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setNewStaff(prev => ({ ...prev, avatar: result }));
    };
    reader.readAsDataURL(file);
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
    setNewStaff({ name: '', email: '', role: '', skills: [], isActive: true, color: undefined });
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
      color: member.color,
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleEditAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setEditStaff(prev => ({ ...prev, avatar: result }));
    };
    reader.readAsDataURL(file);
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
          <div>
            <label className="block mb-1 font-medium">Profile Photo</label>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
            {newStaff.avatar && (
              <div className="mt-2 flex items-center space-x-2">
                <img src={newStaff.avatar} alt="Preview" className="w-12 h-12 rounded-full object-cover object-center border" />
                <span className="text-xs text-[--text]/70">Preview</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Assign Color</p>
            <div className="grid grid-cols-10 gap-2">
              {brightColors.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setNewStaff(prev => ({ ...prev, color: c }))}
                  className={`w-6 h-6 rounded ${newStaff.color === c ? 'ring-2 ring-offset-2 ring-[--primary-green]' : ''}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>
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
          <div>
            <label className="block mb-1 font-medium">Profile Photo</label>
            <input type="file" accept="image/*" onChange={handleEditAvatarUpload} className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
            {editStaff.avatar && (
              <div className="mt-2 flex items-center space-x-2">
                <img src={editStaff.avatar} alt="Preview" className="w-12 h-12 rounded-full object-cover object-center border" />
                <span className="text-xs text-[--text]/70">Preview</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Assign Color</p>
            <div className="grid grid-cols-10 gap-2">
              {brightColors.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setEditStaff(prev => ({ ...prev, color: c }))}
                  className={`w-6 h-6 rounded ${editStaff.color === c ? 'ring-2 ring-offset-2 ring-[--primary-green]' : ''}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>
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
                className="w-16 h-16 rounded-full border-4 object-cover object-center"
                style={{ borderColor: member.color || getStaffColor(member.id) }}
              />
              <span
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: member.color || getStaffColor(member.id), border: '2px solid white' }}
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-sm text-[--text]/80">{member.role}</p>
              <p className="text-sm text-[--text]/60">{member.email}</p>
              {member.color && (
                <div className="mt-2 flex items-center space-x-2 text-xs">
                  <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: member.color }} />
                  <span className="text-[--text]/70">Color assigned</span>
                </div>
              )}
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