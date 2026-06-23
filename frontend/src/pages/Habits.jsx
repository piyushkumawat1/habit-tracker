import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calcHabitStreak, categoryLabel, capitalize, difficultyLabel } from '../lib/utils';
import { habitsApi } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';
import CreateHabitModal from '../components/CreateHabitModal.jsx';
import { Edit2 } from 'lucide-react';

export default function Habits({ habits, logs, refresh }) {
  const navigate = useNavigate();
  const showToast = useToast();
  const [activeFilter, setActiveFilter] = useState('all');
  const [confirmId, setConfirmId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editHabit, setEditHabit] = useState(null);

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
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95" onClick={() => setAddDialogOpen(true)}>+ New Habit</button>
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
              <div className="group relative rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:bg-card/80 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm hover:shadow-md active:scale-[0.98] flex flex-col gap-4" key={h.id}>
                {/* Accent top border */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: h.color || 'hsl(var(--brand))' }} />
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl font-medium text-primary">
                      {h.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base tracking-tight">{h.name}</h3>
                    </div>
                  </div>
                  <button 
                    className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
                    onClick={() => { setEditHabit(h); setEditDialogOpen(true); }} 
                    title="Edit habit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive active:scale-95"
                    onClick={() => setConfirmId(h.id)} 
                    title="Delete habit"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>

                <div className="mt-auto pt-2 flex items-center flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground border border-border">
                    {categoryLabel(h.category)}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground border border-border">
                    {capitalize(h.frequency)}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground border border-border">
                    {difficultyLabel(h.difficulty || 'easy')}
                  </span>
                  {h.Time && (
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground border border-border">
                      ⏱️ {h.Time} mins
                    </span>
                  )}
                  {streak > 0 && (
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ backgroundColor: 'hsl(var(--energy-soft))', color: 'hsl(var(--energy))' }}>
                      🔥 {streak}d
                    </span>
                  )}
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

      <CreateHabitModal isOpen={addDialogOpen || editDialogOpen} onClose={() => { setAddDialogOpen(false); setEditDialogOpen(false); setEditHabit(null); }} refresh={refresh} editHabit={editHabit} />
    </section>
  );
}
