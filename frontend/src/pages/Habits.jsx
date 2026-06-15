import { useState } from 'react';
import { calcHabitStreak, categoryLabel, capitalize, difficultyLabel } from '../lib/utils';
import { habitsApi } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';

export default function Habits({ habits, logs, refresh, onNavigate }) {
  const showToast = useToast();
  const [activeFilter, setActiveFilter] = useState('all');
  const [confirmId, setConfirmId] = useState(null);

  const filtered = activeFilter === 'all' ? habits : habits.filter(h => h.category === activeFilter);

  async function handleDelete() {
    if (!confirmId) return;
    await habitsApi.delete(confirmId);
    showToast('Habit deleted', '🗑️');
    setConfirmId(null);
    refresh();
  }

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'health', label: '🏃 Health' },
    { key: 'mindfulness', label: '🧘 Mindfulness' },
    { key: 'learning', label: '📚 Learning' },
    { key: 'productivity', label: '💼 Productivity' },
    { key: 'social', label: '🤝 Social' },
  ];

  return (
    <section id="page-habits" className="page active">
      <div className="page-header" style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <div>
          <h1>My Habits</h1>
          <p className="page-subtitle">{habits.length} habits tracked</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('add-habit')}>+ New Habit</button>
      </div>

      <div className="filter-bar" id="filter-bar">
        {filters.map(f => (
          <button key={f.key} className={`filter-chip ${activeFilter === f.key ? 'active' : ''}`} onClick={() => setActiveFilter(f.key)}>{f.label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state" style={{ display: 'flex' }}>
          <div className="empty-icon">📋</div>
          <h3>No habits found</h3>
          <p>Try a different filter or add a new habit.</p>
        </div>
      ) : (
        <div className="habits-grid" style={{ display: 'grid' }}>
          {filtered.map(h => {
            const streak = calcHabitStreak(h.id, logs);
            return (
              <div className="habit-card" key={h.id}>
                <div className="habit-card-accent" style={{ background: h.color }} />
                <div className="habit-card-header">
                  <span className="habit-card-icon">{h.icon}</span>
                  <div className="habit-card-actions">
                    <button className="delete-btn" onClick={() => setConfirmId(h.id)} title="Delete habit">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
                <div className="habit-card-name">{h.name}</div>
                <div className="habit-card-desc">{h.description || 'No description'}</div>
                <div className="habit-card-meta">
                  <span className="habit-tag">{categoryLabel(h.category)}</span>
                  <span className="habit-tag">{capitalize(h.frequency)}</span>
                  <span className="habit-tag">{difficultyLabel(h.difficulty || 'easy')}</span>
                  {streak > 0 && <span className="habit-card-streak">🔥 {streak}d</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmId && (
        <div className="modal-overlay" style={{ display: 'flex' }} onClick={e => { if (e.target === e.currentTarget) setConfirmId(null); }}>
          <div className="modal glass-card">
            <h3>Delete Habit</h3>
            <p>Are you sure you want to delete "{habits.find(h => h.id === confirmId)?.name}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
