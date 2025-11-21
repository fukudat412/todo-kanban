import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { Task, TaskStatus, TaskTemplate } from '../types';

export const useTaskStore = () => {
    // useLiveQuery automatically updates the component when DB changes
    const tasks = useLiveQuery(() => db.tasks.toArray()) ?? [];
    const templates = useLiveQuery(() => db.templates.toArray()) ?? [];

    const addTask = async (title: string, description?: string) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            description,
            status: 'todo',
            createdAt: Date.now(),
        };
        await db.tasks.add(newTask);
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        await db.tasks.update(id, updates);
    };

    const moveTask = async (id: string, newStatus: TaskStatus) => {
        const task = await db.tasks.get(id);
        if (!task) return;

        const updates: Partial<Task> = { status: newStatus };

        // Logic for timestamps
        if (newStatus === 'in-progress' && !task.startedAt) {
            updates.startedAt = Date.now();
        }
        if (newStatus === 'done' && !task.completedAt) {
            updates.completedAt = Date.now();
        }
        if (newStatus !== 'done' && task.completedAt) {
            updates.completedAt = undefined;
        }

        await db.tasks.update(id, updates);
    };

    const deleteTask = async (id: string) => {
        await db.tasks.delete(id);
    };

    const clearColumn = async (status: TaskStatus) => {
        // Find all tasks in this column and delete them
        const tasksToDelete = await db.tasks.where('status').equals(status).toArray();
        const ids = tasksToDelete.map((t: Task) => t.id);
        await db.tasks.bulkDelete(ids);
    };

    // Template actions
    const addTemplate = async (title: string, description?: string) => {
        const newTemplate: TaskTemplate = {
            id: crypto.randomUUID(),
            title,
            description,
        };
        await db.templates.add(newTemplate);
    };

    const deleteTemplate = async (id: string) => {
        await db.templates.delete(id);
    };

    return {
        tasks,
        templates,
        addTask,
        updateTask,
        moveTask,
        deleteTask,
        clearColumn,
        addTemplate,
        deleteTemplate,
    };
};
