import React, { useState } from 'react';
import { useTaskStore } from '../hooks/useTaskStore';
import { TemplateManager } from './TemplateManager';
import { Settings, PlusCircle } from 'lucide-react';

export const QuickAddBar: React.FC = () => {
    const { templates, addTask } = useTaskStore();
    const [isManagerOpen, setIsManagerOpen] = useState(false);

    return (
        <div className="quick-add-bar">
            <div className="quick-add-label">
                <span className="label-text">Quick Add:</span>
            </div>

            <div className="chips-container">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        className="template-chip"
                        onClick={() => addTask(template.title, template.description)}
                        title={`Add "${template.title}" to To Do`}
                    >
                        <PlusCircle size={14} />
                        {template.title}
                    </button>
                ))}

                {templates.length === 0 && (
                    <span className="no-templates-hint">
                        Create templates for frequent tasks →
                    </span>
                )}
            </div>

            <button
                className="btn-icon-secondary"
                onClick={() => setIsManagerOpen(true)}
                title="Manage Templates"
            >
                <Settings size={18} />
            </button>

            <TemplateManager
                isOpen={isManagerOpen}
                onClose={() => setIsManagerOpen(false)}
            />

            <style>{`
        .quick-add-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background-color: var(--bg-secondary);
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
          border: 1px solid var(--border-color);
        }
        .quick-add-label {
          display: flex;
          align-items: center;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
        }
        .chips-container {
          flex: 1;
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          align-items: center;
          padding-bottom: 2px; /* For scrollbar space if needed */
        }
        .template-chip {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          color: var(--text-primary);
          font-size: 0.8rem;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .template-chip:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          background-color: rgba(56, 189, 248, 0.1);
        }
        .btn-icon-secondary {
          color: var(--text-secondary);
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s;
        }
        .btn-icon-secondary:hover {
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }
        .no-templates-hint {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-style: italic;
        }
      `}</style>
        </div>
    );
};
