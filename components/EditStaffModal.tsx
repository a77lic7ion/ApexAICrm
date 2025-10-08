import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Staff } from '../types';

interface EditStaffModalProps {
    staffMember: Staff;
    onClose: () => void;
}

export const EditStaffModal: React.FC<EditStaffModalProps> = ({ staffMember, onClose }) => {
    const [formData, setFormData] = useState<Staff>(staffMember);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(staffMember.avatar || null);

    useEffect(() => {
        setFormData(staffMember);
        setAvatarPreview(staffMember.avatar || null);
    }, [staffMember]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, skills }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setAvatarPreview(result);
                setFormData(prev => ({...prev, avatar: result}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await db.staff.update(staffMember.id!, {
            ...formData,
            updatedAt: new Date(),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-[--card] p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Edit Staff Member</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <img src={avatarPreview || `https://i.pravatar.cc/100?u=${formData.email}`} alt="Avatar" className="w-20 h-20 rounded-full" />
                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="text-sm" />
                    </div>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
                    <input name="role" value={formData.role} onChange={handleChange} placeholder="Role" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" required />
                    <input name="skills" value={formData.skills.join(', ')} onChange={handleSkillsChange} placeholder="Skills (comma-separated)" className="w-full p-2 rounded bg-[--secondary-green] border border-[--border]" />
                    <div className="flex items-center">
                        <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={(e) => setFormData(prev => ({...prev, isActive: e.target.checked}))} className="h-4 w-4 rounded" />
                        <label htmlFor="isActive" className="ml-2">Active</label>
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