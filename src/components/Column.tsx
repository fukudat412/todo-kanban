import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column as ColumnType, Task } from '../types';
import { TaskCard } from './TaskCard';
import { Trash2 } from 'lucide-react';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onClearColumn?: () => void;
}

export const Column: React.FC<ColumnProps> = ({ column, tasks, onTaskClick, onClearColumn }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="column">
      <div className="column-header">
        <div className="column-title-wrapper">
          <div className="column-indicator" style={{ backgroundColor: column.color }} />
          <h2 className="column-title">
            {column.title}
            <span className="task-count">{tasks.length}</span>
          </h2>
        </div>
        {onClearColumn && tasks.length > 0 && (
          <button
            className="btn-icon-danger"
            onClick={onClearColumn}
            title={`Clear all ${column.title} tasks`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div ref={setNodeRef} className="task-list">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
      </div>

      <style>{`
        .column {
          background-color: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          min-width: 280px;
          height: 100%;
        }
        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--bg-primary);
        }
        .column-title-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .column-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .column-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .task-count {
          font-size: 0.75rem;
          background-color: var(--bg-primary);
          padding: 0.1rem 0.5rem;
          border-radius: 1rem;
          color: var(--text-secondary);
        }
        .task-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          overflow-y: auto;
          min-height: 100px;
        }
        .btn-icon-danger {
          color: var(--text-secondary);
          padding: 0.25rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s;
        }
        .btn-icon-danger:hover {
          color: var(--danger);
          background-color: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
};
