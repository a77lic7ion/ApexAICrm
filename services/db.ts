import { Dexie, type Table } from 'dexie';
import { Staff, Task, Project, TaskStatus, TaskPriority, Attachment } from '../types';

export class ApexCrmTaskDB extends Dexie {
  staff!: Table<Staff, number>;
  tasks!: Table<Task, number>;
  projects!: Table<Project, number>;
  attachments!: Table<Attachment, number>;

  constructor() {
    super('ApexCrmTaskDB');
    this.version(1).stores({
      staff: '++id, name, email, role, *skills, isActive',
      tasks: '++id, title, assigneeId, creatorId, projectId, status, priority, dueDate',
      projects: '++id, name, status, startDate, endDate, clientName',
    });
    this.version(2).stores({
      staff: '++id, name, email, role, *skills, isActive',
      tasks: '++id, title, assigneeId, creatorId, projectId, status, priority, dueDate',
      projects: '++id, name, status, startDate, endDate, clientName',
      attachments: '++id, projectId, name, type, size, createdAt',
    });
    this.version(3).stores({
      staff: '++id, name, email, role, *skills, isActive',
      tasks: '++id, title, assigneeId, creatorId, projectId, status, priority, dueDate',
      projects: '++id, name, status, startDate, endDate, clientName, ownerId',
      attachments: '++id, projectId, name, type, size, createdAt',
    });
  }
}

export const db = new ApexCrmTaskDB();

export async function populate() {
  const staffCount = await db.staff.count();
  if (staffCount === 0) {
    await db.staff.bulkAdd([
      { name: 'Alice Johnson', email: 'alice@example.com', role: 'Frontend Developer', skills: ['React', 'TypeScript', 'TailwindCSS'], createdAt: new Date(), updatedAt: new Date(), isActive: true, avatar: 'https://picsum.photos/seed/alice/100/100' },
      { name: 'Bob Williams', email: 'bob@example.com', role: 'Backend Developer', skills: ['Node.js', 'Python', 'Databases'], createdAt: new Date(), updatedAt: new Date(), isActive: true, avatar: 'https://picsum.photos/seed/bob/100/100' },
      { name: 'Charlie Brown', email: 'charlie@example.com', role: 'UI/UX Designer', skills: ['Figma', 'User Research', 'Prototyping'], createdAt: new Date(), updatedAt: new Date(), isActive: true, avatar: 'https://picsum.photos/seed/charlie/100/100' },
      { name: 'Diana Miller', email: 'diana@example.com', role: 'Project Manager', skills: ['Agile', 'Scrum', 'JIRA'], createdAt: new Date(), updatedAt: new Date(), isActive: false, avatar: 'https://picsum.photos/seed/diana/100/100' },
      { name: 'Ethan Garcia', email: 'ethan@example.com', role: 'Full-stack Developer', skills: ['React', 'Node.js', 'GraphQL', 'DevOps'], createdAt: new Date(), updatedAt: new Date(), isActive: true, avatar: 'https://picsum.photos/seed/ethan/100/100' },
    ]);

     await db.projects.bulkAdd([
        { id: 1, name: 'CRM Revamp', description: 'Overhaul the customer relationship management system.', status: 'Active', startDate: new Date('2025-10-01'), createdAt: new Date(), updatedAt: new Date(), color: '#3b82f6'},
        { id: 2, name: 'Mobile App Launch', description: 'Develop and launch the new mobile application.', status: 'Active', startDate: new Date('2025-11-01'), createdAt: new Date(), updatedAt: new Date(), color: '#10b981'},
    ]);
    
    await db.tasks.bulkAdd([
        { title: 'Design login page mockups', description: 'Create high-fidelity mockups in Figma for the new login page.', assigneeId: 3, creatorId: 4, projectId: 1, status: TaskStatus.Done, priority: TaskPriority.High, createdAt: new Date(), updatedAt: new Date(), completedAt: new Date() },
        { title: 'Develop authentication API', description: 'Build the backend endpoints for user registration and login.', assigneeId: 2, creatorId: 4, projectId: 1, status: TaskStatus.InProgress, priority: TaskPriority.Urgent, createdAt: new Date(), updatedAt: new Date() },
        { title: 'Implement frontend login UI', description: 'Code the login page using React and Tailwind CSS.', assigneeId: 1, creatorId: 4, projectId: 1, status: TaskStatus.ToDo, priority: TaskPriority.High, dueDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), createdAt: new Date(), updatedAt: new Date() },
        { title: 'User research for mobile app', description: 'Conduct interviews with target users to gather requirements.', assigneeId: 3, creatorId: 4, projectId: 2, status: TaskStatus.ToDo, priority: TaskPriority.Medium, createdAt: new Date(), updatedAt: new Date() },
        { title: 'Setup CI/CD pipeline', description: 'Configure the continuous integration and deployment pipeline for the mobile app project.', assigneeId: 5, creatorId: 4, projectId: 2, status: TaskStatus.Backlog, priority: TaskPriority.Low, createdAt: new Date(), updatedAt: new Date() },
    ]);
  }
}