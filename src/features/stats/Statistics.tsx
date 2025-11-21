import React, { useMemo } from 'react';
import { useTaskStore } from '../../hooks/useTaskStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, startOfDay, isSameDay, subDays } from 'date-fns';
import { CheckCircle2, XCircle } from 'lucide-react';

export const Statistics: React.FC = () => {
    const { tasks } = useTaskStore();

    const chartData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = subDays(new Date(), 6 - i);
            return startOfDay(d);
        });

        return last7Days.map(date => {
            const completedCount = tasks.filter(t =>
                t.status === 'done' &&
                t.completedAt &&
                isSameDay(new Date(t.completedAt), date)
            ).length;

            return {
                date: format(date, 'MMM d'),
                count: completedCount,
            };
        });
    }, [tasks]);

    const history = useMemo(() => {
        return tasks
            .filter(t => t.status === 'done' || t.status === 'cancel')
            .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
    }, [tasks]);

    return (
        <div className="stats-container">
            <div className="stats-section">
                <h2 className="section-title">Weekly Progress</h2>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="date"
                                stroke="var(--text-secondary)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="var(--text-secondary)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px'
                                }}
                                cursor={{ fill: 'var(--bg-secondary)' }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="var(--accent-primary)" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="stats-section">
                <h2 className="section-title">History</h2>
                <div className="history-list">
                    {history.length === 0 ? (
                        <div className="empty-state">No completed or cancelled tasks yet.</div>
                    ) : (
                        history.map(task => (
                            <div key={task.id} className="history-item">
                                <div className="history-icon">
                                    {task.status === 'done' ? (
                                        <CheckCircle2 size={20} color="var(--success)" />
                                    ) : (
                                        <XCircle size={20} color="var(--text-secondary)" />
                                    )}
                                </div>
                                <div className="history-content">
                                    <div className="history-title">{task.title}</div>
                                    <div className="history-date">
                                        {task.completedAt ? format(task.completedAt, 'MMM d, yyyy HH:mm') : 'Unknown date'}
                                    </div>
                                </div>
                                <div className="history-status" style={{
                                    color: task.status === 'done' ? 'var(--success)' : 'var(--text-secondary)'
                                }}>
                                    {task.status.toUpperCase()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>{`
        .stats-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          padding: 1rem;
          overflow-y: auto;
        }
        @media (min-width: 1024px) {
          .stats-container {
            grid-template-columns: 1fr 1fr;
          }
        }
        .stats-section {
          background-color: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .chart-wrapper {
          height: 300px;
          width: 100%;
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .history-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background-color: var(--bg-primary);
          border-radius: var(--radius-md);
          transition: transform 0.2s;
        }
        .history-item:hover {
          transform: translateX(4px);
        }
        .history-content {
          flex: 1;
        }
        .history-title {
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        .history-date {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .history-status {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          background-color: var(--bg-secondary);
          border-radius: var(--radius-sm);
        }
        .empty-state {
          text-align: center;
          color: var(--text-secondary);
          padding: 2rem;
        }
      `}</style>
        </div>
    );
};
