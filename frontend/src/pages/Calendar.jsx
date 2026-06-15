import { useState } from 'react';
import { getToday, dateKey } from '../lib/utils';
import { logsApi } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';

export default function Calendar({ habits, logs, refresh }) {
  const showToast = useToast();
  const [calDate, setCalDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = getToday();
  const totalHabits = habits.length;

  let earliestDate = today;
  if (habits.length > 0) {
    const dates = habits.map(h => h.createdAt).filter(Boolean).sort();
    if (dates.length) earliestDate = dates[0];
  }

  async function handleToggle(habitId) {
    if (!selectedDate) return;
    const wasCompleted = !!(logs[selectedDate] && logs[selectedDate][habitId]);
    await logsApi.toggle(selectedDate, habitId);
    showToast(wasCompleted ? 'Habit cleared' : 'Habit logged for ' + selectedDate, wasCompleted ? '↩️' : '✅');
    if (refresh) refresh();
  }

  const dayCells = [];
  for (let i = 0; i < firstDay; i++) {
    dayCells.push(<div key={`e${i}`} className="cal-day empty" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dk = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const prevDk = dateKey(new Date(new Date(dk).getTime() - 86400000));
    const dayLogs = logs[dk] || {};
    const prevLogs = logs[prevDk] || {};

    const doneCount = totalHabits > 0 ? Object.keys(dayLogs).filter(id => habits.some(h => h.id === id)).length : 0;
    const prevDoneCount = totalHabits > 0 ? Object.keys(prevLogs).filter(id => habits.some(h => h.id === id)).length : 0;
    const pct = totalHabits > 0 ? doneCount / totalHabits : 0;

    let level = 0;
    if (pct > 0 && pct < 0.5) level = 1;
    else if (pct >= 0.5 && pct < 1) level = 2;
    else if (pct >= 1) level = 3;

    const isToday = dk === today;
    const isPast = dk < today;
    const isAfterStart = dk >= earliestDate;

    let cls = `cal-day level-${level}`;
    if (isToday) cls += ' today';
    if (pct === 1 && totalHabits > 0) cls += ' cal-day--perfect';
    if (pct === 0 && isPast && isAfterStart) cls += ' cal-day--missed';
    if (pct === 0 && isPast && isAfterStart && prevDoneCount > 0) cls += ' cal-day--break';

    const completedHabits = habits.filter(h => dayLogs[h.id]);

    dayCells.push(
      <div 
        key={dk} 
        className={cls} 
        onClick={() => setSelectedDate(dk)}
        style={{ cursor: 'pointer', flexDirection: 'column' }}
      >
        <span className="cal-day-num">{day}</span>
        {completedHabits.length > 0 && (
          <div className="cal-day-dots" style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginTop: '2px', flexWrap: 'wrap', padding: '0 4px' }}>
            {completedHabits.slice(0, 4).map(h => (
              <span key={h.id} style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: level === 3 ? '#fff' : h.color }} />
            ))}
            {completedHabits.length > 4 && <span style={{ fontSize: '6px', lineHeight: '4px' }}>+</span>}
          </div>
        )}
      </div>
    );
  }

  return (
    <section id="page-calendar" className="page active">
      <div className="page-header">
        <div>
          <h1>Calendar</h1>
          <p className="page-subtitle">Visual overview of your progress</p>
        </div>
      </div>

      <div className="calendar-card glass-card">
        <div className="calendar-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button className="btn btn-ghost" style={{ padding: '8px' }} onClick={() => setCalDate(new Date(year, month - 1, 1))}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h3 className="cal-month-year" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{monthNames[month]} {year}</h3>
          <button className="btn btn-ghost" style={{ padding: '8px' }} onClick={() => setCalDate(new Date(year, month + 1, 1))}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <div className="calendar-weekdays">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <span key={d}>{d}</span>)}
        </div>

        <div className="calendar-grid">
          {dayCells}
        </div>

        <div className="calendar-legend">
          <span className="legend-item"><span className="legend-dot legend-dot--none"></span> None</span>
          <span className="legend-item"><span className="legend-dot legend-dot--low"></span> Low</span>
          <span className="legend-item"><span className="legend-dot legend-dot--full" style={{ opacity: 0.6 }}></span> Medium</span>
          <span className="legend-item"><span className="legend-dot legend-dot--full"></span> Full</span>
          <span className="legend-item"><span className="legend-dot cal-day--perfect"></span> Perfect</span>
          <span className="legend-item"><span className="legend-dot legend-dot--missed"></span> Missed</span>
          <span className="legend-item"><span className="legend-marker legend-marker--break"></span> Streak Break</span>
        </div>
      </div>

      {selectedDate && (
        <div className="modal-overlay" style={{ display: 'flex' }} onClick={e => { if (e.target === e.currentTarget) setSelectedDate(null); }}>
          <div className="modal glass-card" style={{ maxWidth: 450, width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Logs for {selectedDate}</h3>
              <button className="btn-ghost" style={{ padding: '4px 8px', border: 'none' }} onClick={() => setSelectedDate(null)}>✕</button>
            </div>
            
            {habits.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)' }}>No habits tracked yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {habits.map(h => {
                  const isDone = !!(logs[selectedDate] && logs[selectedDate][h.id]);
                  const isPast = selectedDate < today;
                  
                  let statusLabel = 'No Entry';
                  let statusColor = 'var(--text-tertiary)';
                  let statusBg = 'var(--bg-surface)';
                  
                  if (isDone) {
                    statusLabel = 'Completed';
                    statusColor = 'var(--green)';
                    statusBg = 'var(--green-soft)';
                  } else if (isPast) {
                    statusLabel = 'Failed';
                    statusColor = 'var(--rose)';
                    statusBg = 'var(--rose-soft)';
                  }

                  return (
                    <div key={h.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '1.3rem' }}>{h.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{h.name}</div>
                          <span style={{ 
                            display: 'inline-block', 
                            marginTop: 4, 
                            padding: '2px 8px', 
                            fontSize: '0.7rem', 
                            fontWeight: 650, 
                            borderRadius: 'var(--radius-full)',
                            color: statusColor,
                            backgroundColor: statusBg
                          }}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggle(h.id)}
                        className={`btn ${isDone ? 'btn-ghost' : 'btn-primary'}`}
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                      >
                        {isDone ? 'Clear' : 'Mark Done'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
