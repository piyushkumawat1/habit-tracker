import { useRef } from 'react';
import { getToday, dateKey, calcOverallStreak } from '../lib/utils';
import { Card, CardContent } from '../components/ui/Card.jsx';
import DataExport from '../components/DataExport.jsx';

function generateTimelineEvents(habits, logs) {
  const events = [];
  if (habits.length === 0) {
    return [{ type: 'info', title: 'Journey Awaits', desc: 'Add your first habit to begin.', date: getToday(), icon: '🌟' }];
  }

  habits.forEach(h => {
    events.push({ type: 'milestone', title: 'New Habit Added', desc: `You committed to "${h.name}".`, date: h.createdAt || getToday(), icon: '🌱' });
  });

  const earliestDate = events.map(e => e.date).sort()[0];
  events.push({ type: 'milestone', title: 'Journey Began', desc: 'You started your path to better habits!', date: earliestDate, icon: '🚀' });

  let totalCompletions = 0, currentStreak = 0, maxStreakHit = 0;
  const allLogDates = Object.keys(logs).sort();

  allLogDates.forEach(dk => {
    const dayLogs = logs[dk];
    const doneCount = Object.keys(dayLogs).length;

    if (doneCount > 0) {
      totalCompletions += doneCount;
      if (totalCompletions >= 50 && totalCompletions - doneCount < 50) events.push({ type: 'milestone', title: '50 Habit Completions!', desc: 'Incredible consistency.', date: dk, icon: '🎯' });
      if (totalCompletions >= 100 && totalCompletions - doneCount < 100) events.push({ type: 'milestone', title: '100 Habit Completions!', desc: 'A major milestone reached.', date: dk, icon: '💯' });

      const activeHabits = habits.filter(h => h.createdAt <= dk).length;
      if (activeHabits > 0 && doneCount >= activeHabits) {
        currentStreak++;
      } else {
        if (currentStreak >= 7 && currentStreak > maxStreakHit) events.push({ type: 'coaching', title: 'Streak Broken', desc: `You lost a ${currentStreak}-day streak, but every day is a fresh start!`, date: dk, icon: '💬' });
        currentStreak = 0;
      }
      if (currentStreak === 7 && maxStreakHit < 7) { events.push({ type: 'milestone', title: 'First 7-Day Streak', desc: 'You completed a full week perfectly!', date: dk, icon: '🔥' }); maxStreakHit = 7; }
      if (currentStreak === 30 && maxStreakHit < 30) { events.push({ type: 'milestone', title: '30-Day Streak', desc: 'A whole month of perfect habits.', date: dk, icon: '🏆' }); maxStreakHit = 30; }

      const dt = new Date(dk);
      if (dt.getDay() === 0) {
        const satDk = dateKey(new Date(dt.getTime() - 86400000));
        const satLogs = logs[satDk] || {};
        if (Object.keys(satLogs).length > 0 && activeHabits > 0 && Object.keys(satLogs).length >= activeHabits && doneCount >= activeHabits) {
          events.push({ type: 'milestone', title: 'Weekend Warrior', desc: 'Conquered Saturday and Sunday.', date: dk, icon: '⚔️' });
        }
      }
    } else {
      if (currentStreak >= 7) events.push({ type: 'coaching', title: 'Streak Broken', desc: `You lost a ${currentStreak}-day streak. Time to bounce back!`, date: dk, icon: '💬' });
      currentStreak = 0;
    }
  });

  events.sort((a, b) => new Date(b.date) - new Date(a.date));
  const seen = new Set();
  return events.filter(e => { const k = e.date + '-' + e.title; if (seen.has(k)) return false; seen.add(k); return true; });
}

export default function Journey({ habits, logs }) {
  const canvasRef = useRef(null);
  const events = generateTimelineEvents(habits, logs);

  function generateInfographic() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, 800, 1600);
    const grad = ctx.createLinearGradient(0, 0, 800, 1600);
    grad.addColorStop(0, '#312e81');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 1600);

    ctx.fillStyle = 'rgba(139, 132, 255, 0.1)';
    ctx.beginPath(); ctx.arc(100, 200, 300, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(45, 212, 191, 0.08)';
    ctx.beginPath(); ctx.arc(700, 1200, 400, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
    ctx.font = 'bold 50px sans-serif'; ctx.fillText('My Habit Journey', 400, 120);
    ctx.font = '24px sans-serif'; ctx.fillStyle = '#cbd5e1'; ctx.fillText('Generated with Habitly', 400, 160);

    const overallStreak = calcOverallStreak(habits, logs);
    let totalCompletions = 0;
    Object.values(logs).forEach(day => { totalCompletions += Object.keys(day).length; });

    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    if (ctx.roundRect) { ctx.roundRect(100, 220, 180, 160, 20); ctx.roundRect(310, 220, 180, 160, 20); ctx.roundRect(520, 220, 180, 160, 20); }
    else { ctx.rect(100, 220, 180, 160); ctx.rect(310, 220, 180, 160); ctx.rect(520, 220, 180, 160); }
    ctx.fill();

    ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 46px sans-serif'; ctx.fillText(overallStreak, 190, 300);
    ctx.fillStyle = '#cbd5e1'; ctx.font = '18px sans-serif'; ctx.fillText('Day Streak', 190, 340);
    ctx.fillStyle = '#2dd4bf'; ctx.font = 'bold 46px sans-serif'; ctx.fillText(totalCompletions, 400, 300);
    ctx.fillStyle = '#cbd5e1'; ctx.font = '18px sans-serif'; ctx.fillText('Completions', 400, 340);
    ctx.fillStyle = '#8b84ff'; ctx.font = 'bold 46px sans-serif'; ctx.fillText(habits.length, 610, 300);
    ctx.fillStyle = '#cbd5e1'; ctx.font = '18px sans-serif'; ctx.fillText('Active Habits', 610, 340);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 36px sans-serif'; ctx.fillText('Timeline', 100, 460);
    let yPos = 500;
    events.slice(0, 8).forEach(e => {
      ctx.fillStyle = '#475569'; ctx.fillRect(130, yPos, 4, 100);
      ctx.fillStyle = '#8b84ff'; ctx.beginPath(); ctx.arc(132, yPos + 30, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#94a3b8'; ctx.font = '18px sans-serif'; ctx.fillText(new Date(e.date).toLocaleDateString(), 170, yPos + 20);
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 26px sans-serif'; ctx.fillText(`${e.icon}  ${e.title}`, 170, yPos + 55);
      ctx.fillStyle = '#cbd5e1'; ctx.font = '20px sans-serif'; ctx.fillText(e.desc, 170, yPos + 85);
      yPos += 120;
    });

    ctx.fillStyle = '#64748b'; ctx.textAlign = 'center'; ctx.font = '18px sans-serif';
    ctx.fillText('Keep pushing your limits. The journey continues.', 400, 1500);

    const link = document.createElement('a');
    link.download = 'habit-journey-infographic.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  return (
    <section id="page-journey" className="page active">
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Journey</h1>
          <p className="page-subtitle">Your habit history and milestones</p>
        </div>
        <button className="btn btn-primary" onClick={generateInfographic}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Infographic
        </button>
      </div>

      <div className="timeline-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <div className="timeline">
          {events.map((e, i) => (
            <div key={i} className={`timeline-event ${e.type}`}>
              <span className="timeline-date">{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <Card className="timeline-content">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start gap-4" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px' }}>
                  <div className="timeline-icon" style={{ flexShrink: 0, marginTop: '2px' }}>{e.icon}</div>
                  <div className="timeline-text" style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{e.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{e.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <DataExport habits={habits} logs={logs} />
      <canvas ref={canvasRef} width="800" height="1600" style={{ display: 'none' }} />
    </section>
  );
}
