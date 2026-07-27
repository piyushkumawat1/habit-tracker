import { useRef, useState, useEffect } from 'react';
import { calcOverallStreak, dateKey, calcHabitStreak } from '../lib/utils';
import { challengesApi } from '../lib/api';
import { useToast } from '../context/ToastContext';
import Dialog from '../components/ui/Dialog.jsx';

export default function Challenges({ habits, logs }) {
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const showToast = useToast();

  const [customChallenges, setCustomChallenges] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newChallenge, setNewChallenge] = useState({ title: '', type: 'total_logs', target: 10, habitId: '' });
  const [loading, setLoading] = useState(false);
  const [showCertificate, setShowCertificate] = useState(null);
  const certCanvasRef = useRef(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await challengesApi.getAll();
      setCustomChallenges(res.data);
    } catch (err) {
      console.error('Failed to load challenges:', err);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    if (!newChallenge.title || !newChallenge.target) return;
    setLoading(true);
    try {
      if (editingId) {
        const res = await challengesApi.update(editingId, {
          ...newChallenge,
          target: parseInt(newChallenge.target)
        });
        setCustomChallenges(customChallenges.map(c => c.id === editingId ? res.data : c));
        showToast('Challenge updated!', '✅');
      } else {
        const res = await challengesApi.create({
          ...newChallenge,
          target: parseInt(newChallenge.target),
          reward: 'Certificate of Completion'
        });
        setCustomChallenges([res.data, ...customChallenges]);
        showToast('Challenge added!', '✅');
      }
      setShowAddForm(false);
      setEditingId(null);
      setNewChallenge({ title: '', type: 'total_logs', target: 10, habitId: '' });
    } catch (err) {
      showToast(err.message || 'Failed to save challenge', '❌');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChallenge = (c) => {
    setNewChallenge({ title: c.title, type: c.type, target: c.target, habitId: c.habit_id || '' });
    setEditingId(c.id);
    setShowAddForm(true);
  };

  const handleDeleteChallenge = async (id) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;
    try {
      await challengesApi.delete(id);
      setCustomChallenges(customChallenges.filter(c => c.id !== id));
      showToast('Challenge deleted', '🗑️');
    } catch (err) {
      showToast(err.message || 'Failed to delete challenge', '❌');
    }
  };

  const overallStreak = calcOverallStreak(habits, logs);
  const totalHabits = habits.length;
  let totalCompletions = 0;
  Object.values(logs).forEach(day => { totalCompletions += Object.keys(day).length; });

  let weekendDone = false;
  const dt = new Date();
  const dayOfWeek = dt.getDay();
  let lastSunday = new Date(dt);
  lastSunday.setDate(dt.getDate() - dayOfWeek);
  let lastSaturday = new Date(lastSunday);
  lastSaturday.setDate(lastSunday.getDate() - 1);
  const sunK = dateKey(lastSunday);
  const satK = dateKey(lastSaturday);
  if (totalHabits > 0 && logs[sunK] && logs[satK]) {
    weekendDone = Object.keys(logs[sunK]).length === totalHabits && Object.keys(logs[satK]).length === totalHabits;
  }

  const defaultChallenges = [
    { title: '7-Day Streak', icon: '🔥', current: Math.min(overallStreak, 7), target: 7, desc: 'Complete all habits for 7 consecutive days.' },
    { title: 'Weekend Warrior', icon: '⚔️', current: weekendDone ? 2 : 0, target: 2, desc: 'Complete all habits on Saturday and Sunday.' },
    { title: 'First 50 Completions', icon: '🎯', current: Math.min(totalCompletions, 50), target: 50, desc: 'Log 50 total habit completions.' },
  ];

  // Calculate Custom Challenges Progress
  const processedCustomChallenges = customChallenges.map(cc => {
    let current = 0;
    if (cc.type === 'total_logs') {
      if (cc.habitId) {
        Object.values(logs).forEach(day => { if (day[cc.habitId]) current++; });
      } else {
        current = totalCompletions;
      }
    } else if (cc.type === 'habit_streak') {
      if (cc.habitId) current = calcHabitStreak(cc.habitId, logs);
    } else if (cc.type === 'overall_streak') {
      current = overallStreak;
    }
    
    current = Math.min(current, cc.target);
    const done = current >= cc.target;

    // Notify if newly done
    if (done && !cc.notified) {
      cc.notified = true; // Optimistic update
      setShowCertificate(cc); // Trigger certificate modal!
      challengesApi.notify(cc.id).catch(console.error);
    }

    return { ...cc, current, icon: '🌟', desc: `Target: ${cc.target} ${cc.type.replace('_', ' ')}` };
  });

  const allChallenges = [...defaultChallenges, ...processedCustomChallenges];

  const badges = [
    { id: 'streak-7', name: '7-Day Streak', icon: '🔥', unlocked: overallStreak >= 7 },
    { id: 'streak-30', name: '30-Day Streak', icon: '🏆', unlocked: overallStreak >= 30 },
    { id: 'habits-50', name: '50 Logs', icon: '🎯', unlocked: totalCompletions >= 50 },
    { id: 'habits-100', name: '100 Logs', icon: '💯', unlocked: totalCompletions >= 100 },
    { id: 'weekend', name: 'Weekend Warrior', icon: '⚔️', unlocked: weekendDone },
    ...processedCustomChallenges.filter(c => c.current >= c.target).map(c => ({ id: c.id, name: c.title, icon: '🌟', unlocked: true }))
  ];

  function generateShareCard() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 600, 400);
    const grad = ctx.createLinearGradient(0, 0, 600, 400);
    grad.addColorStop(0, 'rgba(139, 132, 255, 0.15)');
    grad.addColorStop(1, 'rgba(45, 212, 191, 0.05)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 400);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(40, 40, 520, 320, 20);
    else ctx.rect(40, 40, 520, 320);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('My Habitley Stats', 300, 100);
    ctx.font = 'bold 80px sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`🔥 ${overallStreak}`, 300, 210);
    ctx.font = '500 20px sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('Day Streak', 300, 250);
    ctx.font = '600 18px sans-serif';
    ctx.fillStyle = '#2dd4bf';
    ctx.fillText(`Total Completions: ${totalCompletions}`, 300, 310);

    const dataUrl = canvas.toDataURL('image/png');
    if (previewRef.current) {
      previewRef.current.src = dataUrl;
      previewRef.current.style.display = 'block';
    }
    const link = document.createElement('a');
    link.download = 'habitley-stats.png';
    link.href = dataUrl;
    link.click();
  }

  // Draw Certificate Modal
  useEffect(() => {
    if (showCertificate && certCanvasRef.current) {
      const ctx = certCanvasRef.current.getContext('2d');
      // Certificate Background
      ctx.fillStyle = '#1e293b'; // slate-800
      ctx.fillRect(0, 0, 800, 600);
      
      // Border
      ctx.strokeStyle = '#eab308'; // yellow-500
      ctx.lineWidth = 15;
      ctx.strokeRect(20, 20, 760, 560);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, 740, 540);

      // Text
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      
      ctx.font = 'bold 50px serif';
      ctx.fillText('CERTIFICATE OF COMPLETION', 400, 150);
      
      ctx.font = '24px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('This is proudly presented to', 400, 230);
      
      ctx.font = 'italic bold 45px serif';
      ctx.fillStyle = '#eab308';
      ctx.fillText('Habitley Champion', 400, 310);
      
      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('For successfully completing the challenge:', 400, 380);
      
      ctx.font = 'bold 35px sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`"${showCertificate.title}"`, 400, 440);

      // Gold Seal
      ctx.beginPath();
      ctx.arc(400, 520, 40, 0, Math.PI * 2);
      ctx.fillStyle = '#eab308';
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('★', 400, 532);
    }
  }, [showCertificate]);

  const downloadCertificate = () => {
    if (!certCanvasRef.current) return;
    const dataUrl = certCanvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Certificate_${showCertificate.title.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <section id="page-challenges" className="page active">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Challenges</h1>
          <p className="page-subtitle">Push your limits & earn badges</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          if (showAddForm) {
            setShowAddForm(false);
            setEditingId(null);
            setNewChallenge({ title: '', type: 'total_logs', target: 10, habitId: '' });
          } else {
            setShowAddForm(true);
          }
        }}>
          {showAddForm ? 'Cancel' : '+ New Challenge'}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid var(--accent)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{editingId ? 'Edit Challenge' : 'Create Custom Challenge'}</h3>
          <form onSubmit={handleCreateChallenge} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Challenge Title</label>
              <input type="text" className="form-input" value={newChallenge.title} onChange={e => setNewChallenge({...newChallenge, title: e.target.value})} placeholder="e.g. Run 50 times" required />
            </div>
            <div className="form-group">
              <label>Challenge Type</label>
              <select className="form-input" value={newChallenge.type} onChange={e => setNewChallenge({...newChallenge, type: e.target.value})}>
                <option value="total_logs">Total Completions</option>
                <option value="habit_streak">Habit Streak</option>
                <option value="overall_streak">Overall Streak</option>
              </select>
            </div>
            <div className="form-group">
              <label>Specific Habit (Optional)</label>
              <select className="form-input" value={newChallenge.habitId} onChange={e => setNewChallenge({...newChallenge, habitId: e.target.value})}>
                <option value="">Any Habit</option>
                {habits.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Target Number</label>
              <input type="number" min="1" className="form-input" value={newChallenge.target} onChange={e => setNewChallenge({...newChallenge, target: e.target.value})} required />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Challenge')}</button>
            </div>
          </form>
        </div>
      )}

      <div className="challenges-grid">
        <div className="challenges-col">
          <h2 className="section-title">Active Challenges</h2>
          <div className="challenge-cards">
            {allChallenges.map(c => {
              const pct = (c.current / c.target) * 100;
              const done = c.current >= c.target;
              return (
                <div className={`challenge-card ${done ? 'completed' : ''}`} key={c.id || c.title}>
                  <div className="challenge-header">
                    <div className="challenge-title"><span className="challenge-icon">{c.icon}</span> {c.title}</div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="challenge-status">{done ? 'Done' : `${c.current}/${c.target}`}</span>
                      {c.id && !c.id.startsWith('streak-') && !c.id.startsWith('habits-') && !c.id.startsWith('weekend') && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button onClick={() => handleEditChallenge(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', opacity: 0.7 }} title="Edit">✏️</button>
                          <button onClick={() => handleDeleteChallenge(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', opacity: 0.7 }} title="Delete">🗑️</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="challenge-desc">{c.desc}</div>
                  <div className="challenge-progress-bar">
                    <div className="challenge-progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="section-title" style={{ marginTop: 30 }}>Milestone Badges</h2>
          <div className="badges-wallet">
            {badges.map(b => (
              <div className={`badge ${b.unlocked ? 'unlocked' : ''}`} title={b.name} key={b.id}>
                <span className="badge-icon">{b.icon}</span>
                <span className="badge-name">{b.name.split(' ')[0]}<br/>{b.name.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="share-col">
          <div className="share-card-generator glass-card">
            <h3>Share Your Stats</h3>
            <p className="form-hint" style={{ marginBottom: 20 }}>Generate a beautiful image card of your current best streaks to share with friends.</p>

            <div className="canvas-preview-wrapper">
              <canvas ref={canvasRef} width="600" height="400" style={{ display: 'none' }} />
              <img ref={previewRef} alt="Share Preview" style={{ display: 'none', width: '100%', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.2)', marginBottom: 15 }} />
            </div>

            <button className="btn btn-primary btn-block" onClick={generateShareCard}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              Generate & Download
            </button>
          </div>
        </div>
      </div>

      <Dialog isOpen={!!showCertificate} onClose={() => setShowCertificate(null)} maxWidth={800}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉 Congratulations! 🎉</h2>
          <p style={{ color: 'var(--text-tertiary)' }}>You've unlocked a new milestone certificate.</p>
        </div>
        
        <div style={{ width: '100%', overflow: 'hidden', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <canvas ref={certCanvasRef} width="800" height="600" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => setShowCertificate(null)}>
            Close
          </button>
          <button className="btn btn-primary" onClick={downloadCertificate} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Certificate
          </button>
        </div>
      </Dialog>
    </section>
  );
}
