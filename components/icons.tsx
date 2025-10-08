import React from 'react';
import { CiUser, CiCirclePlus, CiCircleCheck, CiTrash, CiEdit, CiCalendar, CiStar } from 'react-icons/ci';

export const DashboardIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
);

export const TasksIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="m16 13-6 6" /><path d="m16 17-6-6" /></svg>
);

export const ProjectsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
);

export const StaffIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

export const CalendarIcon: React.FC = () => (
    <CiCalendar className="w-6 h-6" />
);

export const AILogo: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5001 2.2002C12.3001 1.9002 11.7001 1.9002 11.5001 2.2002L3.30005 16.2002C3.10005 16.5002 3.40005 16.9002 3.70005 16.7002L11.5001 12.2002C11.8001 12.0002 12.2001 12.0002 12.5001 12.2002L20.3001 16.7002C20.6001 16.9002 20.9001 16.5002 20.7001 16.2002L12.5001 2.2002Z" /><path d="M12.5001 21.8002C12.3001 22.1002 11.7001 22.1002 11.5001 21.8002L3.30005 7.8002C3.10005 7.5002 3.40005 7.1002 3.70005 7.3002L11.5001 11.8002C11.8001 12.0002 12.2001 12.0002 12.5001 11.8002L20.3001 7.3002C20.6001 7.1002 20.9001 7.5002 20.7001 7.8002L12.5001 21.8002Z" /></svg>
);

// Convenience exports for common Circum Icons
export const UserIcon: React.FC<{className?: string}> = ({className}) => <CiUser className={className} />;
export const AddIcon: React.FC<{className?: string}> = ({className}) => <CiCirclePlus className={className} />;
export const CheckIcon: React.FC<{className?: string}> = ({className}) => <CiCircleCheck className={className} />;
export const TrashIcon: React.FC<{className?: string}> = ({className}) => <CiTrash className={className} />;
export const EditIcon: React.FC<{className?: string}> = ({className}) => <CiEdit className={className} />;
export const StarIcon: React.FC<{className?: string}> = ({className}) => <CiStar className={className} />;