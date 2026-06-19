import { useState, useEffect } from 'react';
import { moodApi } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';

const MOODS = [
  { level: 1, label: 'Awful', icon: '😫', color: 'var(--danger)' },
  { level: 2, label: 'Bad', icon: '🙁', color: 'var(--warning)' },
  { level: 3, label: 'Okay', icon: '😐', color: 'var(--text-secondary)' },
  { level: 4, label: 'Good', icon: '🙂', color: 'var(--primary)' },
  { level: 5, label: 'Great', icon: '😁', color: 'var(--success)' },
];

const ENERGIES = [
  { level: 1, label: 'Low', icon: '🔋' },
  { level: 2, label: 'Medium', icon: '⚡' },
  { level: 3, label: 'High', icon: '🔥' },
];

export default function MoodTracker() {
  const [mood, setMood] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadToday();
  }, []);

  async function loadToday() {
    try {
      const res = await moodApi.getToday();
      if (res.data) {
        setMood(res.data.mood);
        setEnergy(res.data.energy);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLog(newMood, newEnergy) {
    // 1. Optimistic Update (Instant UI feedback)
    const prevMood = mood;
    const prevEnergy = energy;
    
    setMood(newMood);
    setEnergy(newEnergy);
    
    // 2. Background Sync
    try {
      await moodApi.logToday(newMood, newEnergy);
      showToast('Logged successfully!', '✅');
    } catch (err) {
      // 3. Rollback on failure
      setMood(prevMood);
      setEnergy(prevEnergy);
      showToast('Failed to save log', '❌');
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="card" style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 600 }}>How are you feeling today?</h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Log your mood and energy to unlock AI insights.</p>
      </div>

      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mood</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {MOODS.map(m => (
            <button
              key={m.level}
              type="button"
              onClick={() => handleLog(m.level, energy || 2)}
              style={{
                flex: 1,
                minWidth: '60px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 8px',
                borderRadius: 'var(--radius-md)',
                background: mood === m.level ? 'var(--bg-raised)' : 'transparent',
                border: `1px solid ${mood === m.level ? m.color : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                transform: mood === m.level ? 'scale(1.05)' : 'scale(1)',
                boxShadow: mood === m.level ? `0 0 12px ${m.color}33` : 'none',
              }}
            >
              <span style={{ fontSize: '1.5rem', filter: mood && mood !== m.level ? 'grayscale(1) opacity(0.5)' : 'none' }}>{m.icon}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: mood === m.level ? 600 : 400, color: mood === m.level ? m.color : 'var(--text-secondary)' }}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {mood && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Energy Level</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {ENERGIES.map(e => (
              <button
                key={e.level}
                type="button"
                onClick={() => handleLog(mood, e.level)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  background: energy === e.level ? 'var(--primary)' : 'var(--bg-raised)',
                  color: energy === e.level ? '#fff' : 'var(--text-primary)',
                  border: '1px solid',
                  borderColor: energy === e.level ? 'var(--primary)' : 'var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: energy === e.level ? 600 : 400,
                }}
              >
                <span>{e.icon}</span>
                <span>{e.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
