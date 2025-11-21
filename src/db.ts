import Dexie, { type Table } from 'dexie';
import type { Task, TaskTemplate } from './types';

export class TodoKanbanDB extends Dexie {
    tasks!: Table<Task>;
    templates!: Table<TaskTemplate>;

    constructor() {
        super('TodoKanbanDB');
        this.version(1).stores({
            tasks: 'id, status, createdAt', // Primary key and indexed props
            templates: 'id, title'
        });
    }
}

export const db = new TodoKanbanDB();
