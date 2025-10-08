
import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { Staff } from '../types';

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
          <button type="submit" className="px-4 py-2 bg-[--accent-green] text-white rounded-lg">Add Member</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff?.map(member => (
          <div key={member.id} className="bg-[--card] border border-[--border] rounded-lg p-4 flex items-center space-x-4">
            <img src={member.avatar || `https://i.pravatar.cc/100?u=${member.email}`} alt={member.name} className="w-16 h-16 rounded-full" />
            <div>
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-sm text-[--text]/80">{member.role}</p>
              <p className="text-sm text-[--text]/60">{member.email}</p>
               <div className="mt-2 flex flex-wrap gap-1">
                {member.skills.map(skill => (
                  <span key={skill} className="text-xs bg-[--secondary-green] px-2 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
