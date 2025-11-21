import React, { useState } from 'react';
import { useTaskStore } from '../hooks/useTaskStore';
import { Modal } from './Modal';
import { Trash2, Plus } from 'lucide-react';

interface TemplateManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({ isOpen, onClose }) => {
    const { templates, addTemplate, deleteTemplate } = useTaskStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        addTemplate(title, description);
        setTitle('');
        setDescription('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Templates">
            <div className="template-manager">
                <form onSubmit={handleSubmit} className="add-template-form">
                    <div className="form-group">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Template Title (e.g., Daily Standup)"
                            className="template-input"
                        />
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Default Description (optional)"
                            className="template-input"
                        />
                        <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
                            <Plus size={18} />
                            Add
                        </button>
                    </div>
                </form>

                <div className="template-list">
                    <h3 className="list-title">Your Templates</h3>
                    {templates.length === 0 ? (
                        <p className="empty-text">No templates yet. Add one above!</p>
                    ) : (
                        <div className="list-items">
                            {templates.map((template) => (
                                <div key={template.id} className="template-item">
                                    <div className="template-info">
                                        <span className="template-title">{template.title}</span>
                                        {template.description && (
                                            <span className="template-desc">{template.description}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => deleteTemplate(template.id)}
                                        className="btn-icon-danger"
                                        title="Delete Template"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
        .template-manager {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .add-template-form {
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        .template-input {
          width: 100%;
        }
        .list-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--text-secondary);
        }
        .list-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 300px;
          overflow-y: auto;
        }
        .template-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background-color: var(--bg-primary);
          border-radius: var(--radius-md);
          border: 1px solid transparent;
        }
        .template-item:hover {
          border-color: var(--border-color);
        }
        .template-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .template-title {
          font-weight: 500;
        }
        .template-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .empty-text {
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
      `}</style>
        </Modal>
    );
};
