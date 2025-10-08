
export interface Staff {
  id?: number;
  name: string;
  email: string;
  role: string;
  skills: string[]; // Stored as a string array
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
  Backlog = 'Backlog',
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent',
}


export interface Task {
    id?: number;
    title: string;
    description: string;
    assigneeId?: number;
    creatorId: number; // Assuming a logged in user, hardcoded for now
    projectId?: number;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    tags?: string[];
    color?: string;
}

export interface Project {
    id?: number;
    name: string;
    description: string;
    status: 'Active' | 'Completed' | 'On Hold';
    startDate: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    color?: string;
    clientName?: string;
    budget?: number;
}
