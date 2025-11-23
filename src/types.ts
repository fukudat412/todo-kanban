export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'cancel';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  tags?: string[];
}

export interface TaskTemplate {
  id: string;
  title: string;
  description?: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', color: 'var(--column-todo)' },
  { id: 'in-progress', title: 'In Progress', color: 'var(--column-inprogress)' },
  { id: 'review', title: 'Review', color: 'var(--column-review)' },
  { id: 'done', title: 'Done', color: 'var(--column-done)' },
  { id: 'cancel', title: 'Cancel', color: 'var(--column-cancel)' },
];

export interface AppSettings {
  id: string; // 'default'
  githubToken?: string;
  githubOwner?: string;
  githubRepo?: string;
}
