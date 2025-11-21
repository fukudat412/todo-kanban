import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;
    return format(timestamp, 'MMM d, HH:mm');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="task-card"
    >
      <h3 className="task-title">{task.title}</h3>

      <div className="task-meta">
        {task.startedAt && (
          <div className="meta-item" title="Started At">
            <Clock size={14} />
            <span>{formatDate(task.startedAt)}</span>
          </div>
        )}
        {task.completedAt && (
          <div className="meta-item success" title="Completed At">
            <Calendar size={14} />
            <span>{formatDate(task.completedAt)}</span>
          </div>
        )}
      </div>

      <style>{`
        .task-card {
          background-color: var(--bg-card);
          padding: 1rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          cursor: grab;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .task-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .task-title {
          font-size: 0.95rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        .task-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .meta-item.success {
          color: var(--success);
        }
      `}</style>
    </div>
  );
};
