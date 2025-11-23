import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useSettingsStore } from '../hooks/useSettingsStore';
import { Github } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { settings, saveSettings } = useSettingsStore();
    const [token, setToken] = useState('');
    const [owner, setOwner] = useState('');
    const [repo, setRepo] = useState('');

    useEffect(() => {
        if (isOpen) {
            setToken(settings.githubToken || '');
            setOwner(settings.githubOwner || '');
            setRepo(settings.githubRepo || '');
        }
    }, [isOpen, settings]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveSettings({
            githubToken: token,
            githubOwner: owner,
            githubRepo: repo
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Settings">
            <form onSubmit={handleSave} className="settings-form">
                <div className="section-title">
                    <Github size={20} />
                    <h3>GitHub Integration</h3>
                </div>

                <div className="form-group">
                    <label>Personal Access Token</label>
                    <input
                        type="password"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="ghp_..."
                        className="input"
                    />
                    <p className="help-text">
                        Generate a token with 'repo' scope at GitHub Settings {'>'} Developer settings.
                    </p>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Owner / Organization</label>
                        <input
                            type="text"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                            placeholder="e.g. facebook"
                            className="input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Repository</label>
                        <input
                            type="text"
                            value={repo}
                            onChange={(e) => setRepo(e.target.value)}
                            placeholder="e.g. react"
                            className="input"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Save Settings
                    </button>
                </div>
            </form>
            <style>{`
                .settings-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid var(--border-color);
                    color: var(--text-primary);
                }
                .section-title h3 {
                    font-size: 1rem;
                    font-weight: 600;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .help-text {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    margin-top: 0.25rem;
                }
                .input {
                    width: 100%;
                }
            `}</style>
        </Modal>
    );
};
