import { useState } from 'react';
import Dialog from './ui/Dialog.jsx';
import { habitsApi } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';

const CATEGORIES = ['health', 'productivity', 'learning', 'mindfulness', 'finance', 'social', 'other'];
const ICONS = ['💧', '🏃', '📚', '🧘', '💰', '👥', '⭐', '🎨', '💻', '🏋️'];

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function CreateHabitModal({ isOpen, onClose, refresh }) {
  const { showToast } = useToast();
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('health');
  const [newFrequency, setNewFrequency] = useState('daily');
  const [newDifficulty, setNewDifficulty] = useState('easy');
  const [newIcon, setNewIcon] = useState('💧');
  const [newTime, setNewTime] = useState('morning');
  const [targetTime, setTargetTime] = useState('');
  const [targetUnit, setTargetUnit] = useState('minutes');

  async function handleCreateHabit(e) {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      await habitsApi.create({
        name: newName.trim(),
        category: newCategory,
        frequency: newFrequency,
        difficulty: newDifficulty,
        icon: newIcon,
        time: newTime,
        // Description field will safely store our time target without altering DB columns
        description: targetTime ? JSON.stringify({ targetTime: parseInt(targetTime), targetUnit }) : null,
      });
      showToast('Habit created!', '🎉');
      onClose();
      // Reset form
      setNewName('');
      setNewCategory('health');
      setNewFrequency('daily');
      setNewDifficulty('easy');
      setNewIcon('💧');
      setNewTime('morning');
      setTargetTime('');
      setTargetUnit('minutes');
      if (refresh) refresh();
    } catch (err) {
      showToast('Failed to create habit', '❌');
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth={520}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>Create New Habit</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 20 }}>Define your daily commitment</p>

      <form className="add-habit-dialog-form" onSubmit={handleCreateHabit}>
        <div className="dialog-form-group">
          <label htmlFor="new-habit-name">Habit Name *</label>
          <input
            id="new-habit-name"
            type="text"
            placeholder="e.g. Morning Meditation"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            maxLength={60}
            autoFocus
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="dialog-form-row" style={{ display: 'flex', gap: '1rem' }}>
          <div className="dialog-form-group" style={{ flex: 1 }}>
            <label htmlFor="new-habit-category">Category</label>
            <select 
              id="new-habit-category" 
              value={newCategory} 
              onChange={e => setNewCategory(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{capitalize(c)}</option>)}
            </select>
          </div>
          <div className="dialog-form-group" style={{ flex: 1 }}>
            <label htmlFor="new-habit-frequency">Frequency</label>
            <select 
              id="new-habit-frequency" 
              value={newFrequency} 
              onChange={e => setNewFrequency(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>

        {/* NEW TIME TARGET SECTION */}
        <div className="dialog-form-row" style={{ display: 'flex', gap: '1rem' }}>
          <div className="dialog-form-group" style={{ flex: 1 }}>
            <label htmlFor="new-habit-target-time">Time Target (Optional)</label>
            <input
              id="new-habit-target-time"
              type="number"
              min="1"
              placeholder="e.g. 30"
              value={targetTime}
              onChange={e => setTargetTime(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="dialog-form-group" style={{ flex: 1 }}>
            <label htmlFor="new-habit-target-unit">Unit</label>
            <select 
              id="new-habit-target-unit" 
              value={targetUnit} 
              onChange={e => setTargetUnit(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="times">Times</option>
            </select>
          </div>
        </div>

        <div className="dialog-form-group">
          <label>Difficulty</label>
          <div className="dialog-difficulty-group" style={{ display: 'flex', gap: '8px' }}>
            {['easy', 'medium', 'hard'].map(d => (
              <button
                key={d}
                type="button"
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${newDifficulty === d ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                onClick={() => setNewDifficulty(d)}
              >
                {d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'} {capitalize(d)}
              </button>
            ))}
          </div>
        </div>

        <div className="dialog-form-group" style={{ marginTop: '1rem' }}>
          <label>Time of Day</label>
          <div className="dialog-difficulty-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { key: 'morning', label: '🌅 Morning' },
              { key: 'afternoon', label: '☀️ Afternoon' },
              { key: 'evening', label: '🌙 Evening' },
              { key: 'anytime', label: '⏰ Anytime' },
            ].map(t => (
              <button
                key={t.key}
                type="button"
                className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${newTime === t.key ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                onClick={() => setNewTime(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="dialog-form-group" style={{ marginTop: '1rem' }}>
          <label>Icon</label>
          <div className="dialog-icon-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ICONS.map(i => (
              <button
                key={i}
                type="button"
                className={`flex h-10 w-10 items-center justify-center rounded-md border text-lg transition-colors ${newIcon === i ? 'border-primary bg-primary/10' : 'border-input bg-transparent hover:bg-accent'}`}
                onClick={() => setNewIcon(i)}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className="dialog-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            Create Habit
          </button>
        </div>
      </form>
    </Dialog>
  );
}
