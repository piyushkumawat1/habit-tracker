import { useState } from 'react';
import { getToday, calcOverallStreak, calcHabitStreak, capitalize, formatTime } from '../lib/utils';
import { logsApi } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';
import MoodTracker from '../components/MoodTracker.jsx';

export default function Home({ habits, logs, refresh }) {
  const showToast = useToast();
  const [expandedTemplates, setExpandedTemplates] = useState({});

  const toggleTemplate = (tName) => {
    setExpandedTemplates(prev => ({
      ...prev,
      [tName]: !prev[tName]
    }));
  };

  const today = getToday();
  const todayLogs = logs[today] || {};
  const completed = habits.filter(h => todayLogs[h.id]).length;
  const total = habits.length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const streak = calcOverallStreak(habits, logs);

  async function handleToggle(habitId) {
    const wasCompleted = !!todayLogs[habitId];
    await logsApi.toggle(today, habitId);
    showToast(wasCompleted ? 'Habit unmarked' : 'Habit completed! Keep going! 🎉', wasCompleted ? '↩️' : '✅');
    refresh();
  }

  const h = new Date().getHours();
  let greeting = 'Good evening!';
  if (h < 12) greeting = 'Good morning!';
  else if (h < 17) greeting = 'Good afternoon!';
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <section id="page-home" className="page active">
      <div className="page-header">
        <div>
          <h1>{greeting}</h1>
          <p className="page-subtitle">{dateStr}</p>
        </div>
      </div>
      
      <MoodTracker />

      <div className="stats-grid">
        <div className="stat-card stat-card--primary">
          <div className="stat-icon">🔥</div>
          <div className="stat-body">
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-body">
            <span className="stat-value">{completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-body">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Total Habits</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-body">
            <span className="stat-value">{rate}%</span>
            <span className="stat-label">Today's Rate</span>
          </div>
        </div>
      </div>

      <div className="section-header" style={habits.length === 0 ? { display: 'none' } : {}}>
        <h2>Today's Habits</h2>
        <span className="remaining-badge">{total - completed} remaining</span>
      </div>

      {habits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <h3>No habits yet</h3>
          <p>Start your journey by adding your first habit!</p>
        </div>
      ) : (
        <div className="quick-log-list">
          {(() => {
            const habitGroups = [];
            const templatesMap = {};

            habits.forEach(h => {
              if (h.description && h.description.startsWith('[Template] ')) {
                const tName = h.description.replace('[Template] ', '');
                if (!templatesMap[tName]) {
                  templatesMap[tName] = { name: tName, habits: [], doneCount: 0, totalCount: 0 };
                  habitGroups.push({ type: 'template', name: tName, data: templatesMap[tName] });
                }
                templatesMap[tName].habits.push(h);
                templatesMap[tName].totalCount++;
                if (todayLogs[h.id]) templatesMap[tName].doneCount++;
              } else {
                habitGroups.push({ type: 'habit', data: h });
              }
            });

            return habitGroups.map((group, idx) => {
              if (group.type === 'template') {
                const t = group.data;
                const isExpanded = expandedTemplates[t.name];
                const isAllDone = t.doneCount === t.totalCount && t.totalCount > 0;
                
                return (
                  <div key={`template-${t.name}`} className="template-group" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div 
                      className={`quick-log-item ${isAllDone ? 'completed' : ''}`} 
                      onClick={() => toggleTemplate(t.name)}
                      style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', marginBottom: isExpanded ? '0' : '12px' }}
                    >
                      <span className="ql-icon">📁</span>
                      <div className="ql-check" style={isAllDone ? { background: 'var(--primary)', borderColor: 'var(--primary)' } : { borderColor: 'var(--border-strong)' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <div className="ql-info">
                        <div className="ql-name">{t.name} (Template)</div>
                        <div className="ql-meta">
                          <span>{t.doneCount}/{t.totalCount} completed</span>
                        </div>
                      </div>
                      <span className="ql-expand-icon" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s', padding: '0 8px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        ▼
                      </span>
                    </div>
                    
                    {isExpanded && (
                      <div className="template-habits" style={{ paddingLeft: '24px', paddingTop: '8px', marginBottom: '12px', borderLeft: '2px solid var(--border)', marginLeft: '12px' }}>
                        {t.habits.map((h) => {
                          const done = !!todayLogs[h.id];
                          const habitStreak = calcHabitStreak(h.id, logs);
                          return (
                            <div key={h.id} className={`quick-log-item ${done ? 'completed' : ''}`} onClick={() => handleToggle(h.id)}>
                              <span className="ql-icon">{h.icon}</span>
                              <div className="ql-check" style={done ? { background: h.color, borderColor: h.color } : { borderColor: h.color }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              </div>
                              <div className="ql-info">
                                <div className="ql-name">{h.name}</div>
                                <div className="ql-meta">
                                  <span>{capitalize(h.category)}</span><span>·</span><span>{formatTime(h.time)}</span>
                                </div>
                              </div>
                              {habitStreak > 0 && <span className="ql-streak">🔥 {habitStreak}d</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              } else {
                const h = group.data;
                const done = !!todayLogs[h.id];
                const habitStreak = calcHabitStreak(h.id, logs);
                return (
                  <div key={h.id} className={`quick-log-item ${done ? 'completed' : ''}`} style={{ animationDelay: `${idx * 0.05}s` }} onClick={() => handleToggle(h.id)}>
                    <span className="ql-icon">{h.icon}</span>
                    <div className="ql-check" style={done ? { background: h.color, borderColor: h.color } : { borderColor: h.color }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div className="ql-info">
                      <div className="ql-name">{h.name}</div>
                      <div className="ql-meta">
                        <span>{capitalize(h.category)}</span><span>·</span><span>{formatTime(h.time)}</span>
                      </div>
                    </div>
                    {habitStreak > 0 && <span className="ql-streak">🔥 {habitStreak}d</span>}
                  </div>
                );
              }
            });
          })()}
        </div>
      )}
    </section>
  );
}
