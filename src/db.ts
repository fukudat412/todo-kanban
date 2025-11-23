import Dexie, { type Table } from 'dexie';
import type { Task, TaskTemplate, AppSettings } from './types';

export class TodoKanbanDB extends Dexie {
    tasks!: Table<Task>;
    templates!: Table<TaskTemplate>;
    settings!: Table<AppSettings>;

    constructor() {
        super('TodoKanbanDB');
        this.version(1).stores({
            tasks: 'id, status, createdAt', // Primary key and indexed props
            templates: 'id, title'
        });
        this.version(2).stores({
            settings: 'id'
        });
    }
}

export const db = new TodoKanbanDB();
