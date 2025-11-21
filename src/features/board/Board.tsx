import React, { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type {
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { COLUMNS } from '../../types';
import type { Task } from '../../types';
import { useTaskStore } from '../../hooks/useTaskStore';
import { Column } from '../../components/Column';
import { TaskCard } from '../../components/TaskCard';
import { Modal } from '../../components/Modal';
import { QuickAddBar } from '../../components/QuickAddBar';
import { Plus, Mic, MicOff } from 'lucide-react';
import { format } from 'date-fns';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

export const Board: React.FC = () => {
    const { tasks, addTask, moveTask, deleteTask, clearColumn } = useTaskStore();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Form state
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');

    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        hasSupport,
        error
    } = useSpeechRecognition();

    // Sync transcript to title
    React.useEffect(() => {
        if (transcript) {
            setNewTaskTitle(transcript);
        }
    }, [transcript]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find the containers
        const activeTask = tasks.find(t => t.id === activeId);

        if (!activeTask) return;

        // If over a column directly
        const overColumn = COLUMNS.find(c => c.id === overId);
        if (overColumn) {
            if (activeTask.status !== overColumn.id) {
                // We don't move here in dragOver usually for simple kanban, 
                // but visual feedback is handled by dnd-kit.
                // We'll handle the actual move in DragEnd.
            }
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTask = tasks.find(t => t.id === activeId);
        if (!activeTask) {
            setActiveId(null);
            return;
        }

        // Check if dropped on a column
        const overColumn = COLUMNS.find(c => c.id === overId);
        if (overColumn) {
            if (activeTask.status !== overColumn.id) {
                moveTask(activeId, overColumn.id);
            }
        } else {
            // Dropped on another task
            const overTask = tasks.find(t => t.id === overId);
            if (overTask && activeTask.status !== overTask.status) {
                moveTask(activeId, overTask.status);
            }
        }

        setActiveId(null);
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        addTask(newTaskTitle, newTaskDesc);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setIsAddModalOpen(false);
    };

    const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

    return (
        <div className="board-container">
            <QuickAddBar />
            <div className="board-actions">
                <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={20} />
                    Add Task
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="board-columns">
                    {COLUMNS.map((col) => (
                        <Column
                            key={col.id}
                            column={col}
                            tasks={tasks.filter((t) => t.status === col.id)}
                            onTaskClick={setSelectedTask}
                            onClearColumn={
                                (col.id === 'done' || col.id === 'cancel')
                                    ? () => clearColumn(col.id)
                                    : undefined
                            }
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask ? <TaskCard task={activeTask} onClick={() => { }} /> : null}
                </DragOverlay>
            </DndContext>

            {/* Add Task Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Task"
            >
                <form onSubmit={handleAddTask} className="task-form">
                    <div className="form-group">
                        <label>Title</label>
                        <div className="input-with-icon">
                            <input
                                autoFocus
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder={isListening ? "Listening..." : "What needs to be done?"}
                                className={isListening ? "listening" : ""}
                            />
                            {hasSupport && (
                                <button
                                    type="button"
                                    className={`btn-icon-mic ${isListening ? 'active' : ''}`}
                                    onClick={isListening ? stopListening : startListening}
                                    title={isListening ? "Stop listening" : "Start voice input"}
                                >
                                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                </button>
                            )}
                        </div>
                        {error && <div className="voice-error">{error}</div>}
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={newTaskDesc}
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                            placeholder="Add details..."
                            rows={3}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-ghost" onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={!newTaskTitle.trim()}>
                            Create Task
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Task Detail Modal */}
            {selectedTask && (
                <Modal
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    title="Task Details"
                >
                    <div className="task-detail">
                        <div className="detail-header">
                            <div className="status-badge" style={{
                                backgroundColor: COLUMNS.find(c => c.id === selectedTask.status)?.color
                            }}>
                                {COLUMNS.find(c => c.id === selectedTask.status)?.title}
                            </div>
                            <span className="created-at">
                                Created: {format(selectedTask.createdAt, 'MMM d, yyyy HH:mm')}
                            </span>
                        </div>

                        <div className="detail-content">
                            <h3>{selectedTask.title}</h3>
                            <p className="description">{selectedTask.description || 'No description provided.'}</p>
                        </div>

                        <div className="time-logs">
                            <h4>Time Logs</h4>
                            <div className="log-grid">
                                <div className="log-item">
                                    <label>Started</label>
                                    <span>{selectedTask.startedAt ? format(selectedTask.startedAt, 'MMM d, HH:mm') : '-'}</span>
                                </div>
                                <div className="log-item">
                                    <label>Completed</label>
                                    <span>{selectedTask.completedAt ? format(selectedTask.completedAt, 'MMM d, HH:mm') : '-'}</span>
                                </div>
                                {selectedTask.startedAt && selectedTask.completedAt && (
                                    <div className="log-item">
                                        <label>Duration</label>
                                        <span>
                                            {((selectedTask.completedAt - selectedTask.startedAt) / 1000 / 60).toFixed(0)} mins
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="detail-actions">
                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    deleteTask(selectedTask.id);
                                    setSelectedTask(null);
                                }}
                            >
                                Delete Task
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            <style>{`
        .board-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .board-actions {
          margin-bottom: 1rem;
        }
        .board-columns {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding-bottom: 1rem;
          height: 100%;
        }
        .task-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        /* Detail Modal Styles */
        .task-detail {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
        }
        .created-at {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .detail-content h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .description {
          color: var(--text-secondary);
          white-space: pre-wrap;
        }
        .time-logs {
          background-color: var(--bg-primary);
          padding: 1rem;
          border-radius: var(--radius-md);
        }
        .time-logs h4 {
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
          color: var(--text-secondary);
        }
        .log-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .log-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .log-item label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .log-item span {
          font-variant-numeric: tabular-nums;
        }
        .detail-actions {
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid var(--border-color);
          padding-top: 1rem;
        }
        
        /* Voice Input Styles */
        .input-with-icon {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }
        .input-with-icon input {
            flex: 1;
        }
        .input-with-icon input.listening {
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
        }
        .btn-icon-mic {
            padding: 0.5rem;
            border-radius: var(--radius-sm);
            color: var(--text-secondary);
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            transition: all 0.2s;
        }
        .btn-icon-mic:hover {
            color: var(--text-primary);
            border-color: var(--accent-primary);
        }
        .btn-icon-mic.active {
            color: white;
            background-color: var(--danger);
            border-color: var(--danger);
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .voice-error {
            font-size: 0.75rem;
            color: var(--danger);
            margin-top: 0.25rem;
        }
      `}</style>
        </div>
    );
};
