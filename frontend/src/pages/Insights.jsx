import { useState, useEffect } from 'react';
import { dateKey, calcHabitStreak, categoryLabel, capitalize } from '../lib/utils';
import supabase from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Insights({ habits, logs }) {
  const { user } = useAuth();
  const [smartTrends, setSmartTrends] = useState(null);
  const [trendsLoading, setTrendsLoading] = useState(true);

  useEffect(() => {
    async function loadTrends() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch('/api/mood-insights', {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSmartTrends(data);
        }
      } catch (err) {
        console.error("Failed to load smart trends", err);
      } finally {
        setTrendsLoading(false);
      }
    }
    loadTrends();
  }, [habits, logs]);

  const totalHabits = habits.length;

  // ── Consistency (30 days) ──
  const consistencyData = [];
  for (let d = 29; d >= 0; d--) {
    const dk = dateKey(new Date(Date.now() - d * 86400000));
    const dayLogs = logs[dk] || {};
    const done = Object.keys(dayLogs).filter(id => habits.some(h => h.id === id)).length;
    consistencyData.push(totalHabits > 0 ? (done / totalHabits) * 100 : 0);
  }
  const consPoints = consistencyData.map((val, i) => `${(i / 29) * 100},${100 - val}`).join(' ');

  // ── Streak Growth (30 days) ──
  const streakData = [];
  for (let d = 29; d >= 0; d--) {
    const dt = new Date(Date.now() - d * 86400000);
    let maxS = 0;
    habits.forEach(h => {
      let hs = 0;
      for (let p = 0; p < 365; p++) {
        const pk = dateKey(new Date(dt.getTime() - p * 86400000));
        if (logs[pk] && logs[pk][h.id]) hs++;
        else break;
      }
      if (hs > maxS) maxS = hs;
    });
    streakData.push(maxS);
  }
  const maxStreak = Math.max(...streakData, 5);
  const streakPoints = streakData.map((val, i) => `${(i / 29) * 100},${100 - (val / maxStreak) * 100}`).join(' ');

  // ── Behavioral Patterns ──
  const times = { morning: { done: 0, total: 0 }, afternoon: { done: 0, total: 0 }, evening: { done: 0, total: 0 }, anytime: { done: 0, total: 0 } };
  for (let d = 0; d < 30; d++) {
    const dk = dateKey(new Date(Date.now() - d * 86400000));
    const dayLogs = logs[dk] || {};
    habits.forEach(h => {
      const t = h.time || 'anytime';
      times[t].total++;
      if (dayLogs[h.id]) times[t].done++;
    });
  }
  const timeLabels = ['Morning', 'Afternoon', 'Evening', 'Anytime'];
  const timeKeys = ['morning', 'afternoon', 'evening', 'anytime'];
  const timeRates = timeKeys.map(k => times[k].total > 0 ? (times[k].done / times[k].total) * 100 : 0);
  const maxTimeRate = Math.max(...timeRates, 1);

  // ── Weekly Chart ──
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daySums = [0, 0, 0, 0, 0, 0, 0];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  for (let d = 0; d < 56; d++) {
    const dt = new Date(Date.now() - d * 86400000);
    const dk = dateKey(dt);
    const dow = dt.getDay();
    const dayLogs = logs[dk] || {};
    const done = totalHabits > 0 ? Object.keys(dayLogs).filter(id => habits.some(h => h.id === id)).length : 0;
    daySums[dow] += totalHabits > 0 ? (done / totalHabits) * 100 : 0;
    dayCounts[dow]++;
  }
  const avgRates = daySums.map((s, i) => dayCounts[i] > 0 ? Math.round(s / dayCounts[i]) : 0);
  const maxAvg = Math.max(...avgRates, 1);

  // ── Best Streaks ──
  const sorted = habits.map(h => ({ ...h, streak: calcHabitStreak(h.id, logs) })).sort((a, b) => b.streak - a.streak).slice(0, 5);

  // ── Category Chart ──
  const categories = {};
  const categoryColors = { health: 'hsl(var(--success))', productivity: 'hsl(var(--brand))', mindfulness: 'hsl(var(--freeze))', learning: 'hsl(var(--energy))', social: 'hsl(var(--text-tertiary))', fitness: 'hsl(var(--success))', finance: 'hsl(var(--text-primary))', hobbies: 'hsl(var(--energy))' };
  habits.forEach(h => { categories[h.category] = (categories[h.category] || 0) + 1; });
  const catEntries = Object.entries(categories);
  const radius = 50, circumference = 2 * Math.PI * radius;
  let cumPct = 0;

  // ── Heatmap ──
  const heatCells = [];
  const todayDate = new Date();
  const currentDow = todayDate.getDay();
  // Calculate the Saturday of the current week to ensure 7-row alignment
  const endOfThisWeek = new Date(todayDate);
  endOfThisWeek.setDate(todayDate.getDate() + (6 - currentDow));

  const daysLimit = user?.is_pro ? 83 : 83; // Keep loop 83 to maintain grid size

  for (let d = daysLimit; d >= 0; d--) {
    const dt = new Date(endOfThisWeek.getTime() - d * 86400000);
    // If it's a future day in the current week, render a faint empty placeholder
    if (dt > todayDate) {
      heatCells.push(<div key={`future-${d}`} className="heatmap-cell" style={{ opacity: 0.1 }} title="Future" />);
      continue;
    }
    
    // Pro Gate for Heatmap
    if (!user?.is_pro && d > 6) {
      heatCells.push(<div key={`locked-${d}`} className="heatmap-cell" style={{ opacity: 0.1, background: 'hsl(var(--border))' }} title="Pro Feature: View full history" />);
      continue;
    }

    const dk = dateKey(dt);
    const dayLogs = logs[dk] || {};
    const done = Object.keys(dayLogs).filter(id => habits.some(h => h.id === id)).length;
    const pct = totalHabits > 0 ? done / totalHabits : 0;
    let lvl = '';
    if (pct > 0 && pct <= 0.25) lvl = 'h-1';
    else if (pct > 0.25 && pct <= 0.5) lvl = 'h-2';
    else if (pct > 0.5 && pct < 1) lvl = 'h-3';
    else if (pct >= 1) lvl = 'h-4';
    heatCells.push(<div key={dk} className={`heatmap-cell ${lvl}`} title={`${dk}: ${done}/${totalHabits}`} />);
  }

  const empty = <p className="empty-state">No habits to show.</p>;

  return (
    <section id="page-insights" className="page active">
      <div className="page-header">
        <div>
          <h1>Insights</h1>
          <p className="page-subtitle">Your progress over time.</p>
        </div>
      </div>

      {/* Smart Trends (AI) */}
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)', border: '1px solid hsl(var(--brand))' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--brand))' }}>✨ Smart AI Trends</h3>
        {trendsLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'hsl(var(--text-secondary))' }}>
            <div className="loading-spinner" style={{ width: '20px', height: '20px', borderTopColor: 'hsl(var(--brand))' }} />
            <span>Analyzing your habits and mood...</span>
          </div>
        ) : smartTrends ? (
          <div>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.6', margin: '0 0 16px 0' }}>{smartTrends.insight}</p>
            {smartTrends.topHabit && (
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ background: 'hsl(var(--surface))', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid hsl(var(--border))' }}>
                  <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', marginBottom: '4px' }}>Top Driver</div>
                  <div style={{ fontWeight: 600, color: 'hsl(var(--text-primary))' }}>{smartTrends.topHabit}</div>
                </div>
                <div style={{ background: 'hsl(var(--surface))', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid hsl(var(--border))' }}>
                  <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', marginBottom: '4px' }}>Correlation</div>
                  <div style={{ fontWeight: 600, color: 'hsl(var(--success))' }}>+{smartTrends.correlation}% Mood</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: 'hsl(var(--text-secondary))', margin: 0 }}>Log your mood for a few days to unlock personalized insights.</p>
        )}
      </div>

      <div className="insights-grid">
        {/* Consistency */}
        <div className="insight-card glass-card">
          <h3>Consistency Trend (30 Days)</h3>
          <div className="chart-container">
            {totalHabits === 0 ? empty : (
              <div className="svg-chart-wrapper" style={{ width: '100%', height: 160, position: 'relative', overflow: 'hidden' }}>
                <svg viewBox="-5 -5 110 110" width="100%" height="100%" preserveAspectRatio="none">
                  <polyline fill="none" stroke="hsl(var(--success))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={consPoints} />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Streak Growth */}
        <div className="insight-card glass-card">
          <h3>Streak Growth</h3>
          <div className="chart-container">
            {totalHabits === 0 ? empty : (
              <div className="svg-chart-wrapper" style={{ width: '100%', height: 160, position: 'relative', overflow: 'hidden' }}>
                <svg viewBox="-5 -5 110 110" width="100%" height="100%" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="streakGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--energy))" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="hsl(var(--energy))" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon points={`0,100 ${streakPoints} 100,100`} fill="url(#streakGrad)" />
                  <polyline fill="none" stroke="hsl(var(--energy))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={streakPoints} />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Behavioral Patterns */}
        <div className="insight-card glass-card">
          <h3>Behavioral Patterns</h3>
          <div className="chart-container">
            {totalHabits === 0 ? empty : (
              <div className="weekly-bars" style={{ height: 160 }}>
                {timeRates.map((rate, i) => (
                  <div className="bar-col" key={timeKeys[i]}>
                    <span className="bar-value" style={{ fontSize: '0.75rem' }}>{Math.round(rate)}%</span>
                    <div className="bar" style={{ height: Math.max(3, (rate / maxTimeRate) * 120), background: 'hsl(var(--brand))' }} />
                    <span className="bar-label">{timeLabels[i].slice(0, 3)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="insight-card glass-card">
          <h3>Weekly Completion Rate</h3>
          <div className="chart-container">
            <div className="weekly-bars">
              {avgRates.map((rate, i) => (
                <div className="bar-col" key={dayNames[i]}>
                  <span className="bar-value">{rate}%</span>
                  <div className={`bar ${i === new Date().getDay() ? 'today-bar' : ''}`} style={{ height: Math.max(3, (rate / maxAvg) * 140), background: i === new Date().getDay() ? 'hsl(var(--energy))' : 'hsl(var(--brand))' }} />
                  <span className="bar-label">{dayNames[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Best Streaks */}
        <div className="insight-card glass-card">
          <h3>Best Streaks</h3>
          <div className="streaks-list">
            {habits.length === 0 ? <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>Add habits to see your streaks.</p> :
              sorted.map(h => (
                <div className="streak-item" key={h.id}>
                  <span className="streak-item-icon">{h.icon}</span>
                  <div className="streak-item-info">
                    <div className="streak-item-name">{h.name}</div>
                    <div className="streak-item-days">{h.streak > 0 ? h.streak + ' day streak' : 'No streak yet'}</div>
                  </div>
                  <span className="streak-item-value">{h.streak > 0 ? '🔥' : '—'}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Category Chart */}
        <div className="insight-card glass-card">
          <h3>Habit Breakdown by Category</h3>
          <div className="chart-container">
            {habits.length === 0 ? <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>Add habits to see the breakdown.</p> : (
              <div className="donut-chart-wrapper">
                <svg className="donut-svg" viewBox="0 0 140 140">
                  {catEntries.map(([cat, count]) => {
                    const pct = count / totalHabits;
                    const da = pct * circumference;
                    const doff = -cumPct * circumference;
                    const color = categoryColors[cat] || '#888';
                    cumPct += pct;
                    return <circle key={cat} cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="18" strokeDasharray={`${da} ${circumference}`} strokeDashoffset={doff} transform="rotate(-90 70 70)" />;
                  })}
                  <text x="70" y="66" textAnchor="middle" fill="hsl(var(--text-primary))" fontSize="22" fontWeight="800">{totalHabits}</text>
                  <text x="70" y="84" textAnchor="middle" fill="hsl(var(--text-secondary))" fontSize="10" fontWeight="500">habits</text>
                </svg>
                <div className="donut-legend">
                  {catEntries.map(([cat, count]) => (
                    <div className="donut-legend-item" key={cat}>
                      <span className="donut-legend-dot" style={{ background: categoryColors[cat] || '#888' }} />
                      {categoryLabel(cat)} ({count})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Heatmap */}
        <div className="insight-card glass-card span-2" style={{ position: 'relative' }}>
          <h3>Consistency Heatmap {user?.is_pro ? '(Last 12 Weeks)' : '(Last 7 Days)'}</h3>
          <div className="heatmap-container">
            {totalHabits === 0 ? <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>Add habits to see the heatmap.</p> : (
              <div className="heatmap-wrapper">
                <div className="heatmap-days">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}
                </div>
                <div className="heatmap-grid">{heatCells}</div>
              </div>
            )}
          </div>
          {!user?.is_pro && totalHabits > 0 && (
            <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'hsl(var(--surface))', padding: '6px 12px', borderRadius: '16px', border: '1px solid hsl(var(--brand))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <span style={{ fontSize: '0.8rem', color: 'hsl(var(--brand))', fontWeight: 600 }}>🌟 Pro: View full 12 weeks</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
