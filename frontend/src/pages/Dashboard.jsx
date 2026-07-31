import { useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToday, calcOverallStreak, calcHabitStreak, capitalize, formatTime, dateKey } from '../lib/utils';
import { logsApi, habitsApi } from '../lib/api.js';
import CreateHabitModal from '../components/CreateHabitModal.jsx';
import FocusTimerModal from '../components/FocusTimerModal.jsx';
import FloatingActionButton from '../components/ui/FloatingActionButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Dialog from '../components/ui/Dialog.jsx';
import {
  Flame, Star, Snowflake, Sparkles, Plus, RefreshCw, Check,
  ChevronRight, Sun, Moon, Cloud, Clock, TrendingUp, Zap, Eye, Sunrise, Edit2, Camera
} from 'lucide-react';
import html2canvas from 'html2canvas';

// ── Constants ──
const MILESTONES = [7, 21, 30, 60, 100, 365];
const ICONS = ['💧', '🧘', '📖', '🏃', '✍️', '🎯', '🧠', '💤', '🍎', '🚴', '🧹', '💻', '🎵', '📸', '🌿', '☕'];
const CATEGORIES = ['health', 'mindfulness', 'learning', 'productivity', 'social', 'fitness', 'finance', 'hobbies'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ── Helpers ──
function getGreeting() {
  const h = new Date().getHours();
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  if (h < 5) return `Good night 🌙`;
  if (h < 12) return `Good morning 👋`;
  if (h < 17) return `Good afternoon ☀️`;
  if (h < 21) return `Good evening 🌅`;
  return `Good night 🌙`;
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function getFormattedTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true
  });
}

function getDifficultyPriority(diff) {
  if (diff === 'hard') return 0;
  if (diff === 'medium') return 1;
  return 2;
}

function getTimePriority(time) {
  const order = { morning: 0, afternoon: 1, evening: 2, anytime: 3 };
  return order[time] ?? 3;
}

function getNextMilestone(streak) {
  for (const m of MILESTONES) {
    if (streak < m) return m;
  }
  return MILESTONES[MILESTONES.length - 1];
}

function getMilestoneLabel(milestone) {
  if (milestone <= 7) return '🎯 7-Day Spark';
  if (milestone <= 21) return '🔥 21-Day Builder';
  if (milestone <= 30) return '💪 30-Day Champion';
  if (milestone <= 60) return '⭐ 60-Day Master';
  if (milestone <= 100) return '🏆 100-Day Legend';
  return '👑 365-Day Titan';
}

function calcLongestStreak(habits, logs) {
  if (!habits || habits.length === 0) return 0;
  let longest = 0;
  let current = 0;

  for (let d = 365; d >= 0; d--) {
    const dk = dateKey(new Date(Date.now() - d * 86400000));
    const dayLogs = logs[dk] || {};
    const allDone = habits.every(h => dayLogs[h.id]);
    if (allDone && habits.length > 0) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 0;
    }
  }
  return longest;
}

function calcStreakFreezes(streak) {
  // 1 freeze earned per 7-day streak, max 3
  return Math.min(3, Math.floor(streak / 7));
}

function getEarliestHabitDate(habits) {
  if (!habits || habits.length === 0) return null;
  let earliest = habits[0].created_at;
  for (const h of habits) {
    if (h.created_at < earliest) earliest = h.created_at;
  }
  return new Date(earliest).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Heatmap data builder ──
function buildHeatmapData(habits, logs) {
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  // Start from the Sunday of that week
  sixMonthsAgo.setDate(sixMonthsAgo.getDate() - sixMonthsAgo.getDay());

  const weeks = [];
  const monthLabels = [];
  let currentDate = new Date(sixMonthsAgo);
  let totalCompletions = 0;
  let lastMonth = -1;

  while (currentDate <= today) {
    const weekStart = new Date(currentDate);
    const week = [];

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      const cellDate = new Date(weekStart);
      cellDate.setDate(cellDate.getDate() + dayOfWeek);

      if (cellDate > today) {
        week.push(null); // future day
        continue;
      }

      const dk = dateKey(cellDate);
      const dayLogs = logs[dk] || {};
      const completedCount = habits.filter(h => dayLogs[h.id]).length;
      totalCompletions += completedCount;

      const ratio = habits.length > 0 ? completedCount / habits.length : 0;
      let level = 0;
      if (ratio > 0 && ratio <= 0.25) level = 1;
      else if (ratio > 0.25 && ratio <= 0.5) level = 2;
      else if (ratio > 0.5 && ratio <= 0.75) level = 3;
      else if (ratio > 0.75) level = 4;

      // Track month labels
      if (cellDate.getMonth() !== lastMonth && dayOfWeek === 0) {
        monthLabels.push({ weekIndex: weeks.length, label: MONTH_NAMES[cellDate.getMonth()] });
        lastMonth = cellDate.getMonth();
      }

      week.push({
        date: dk,
        displayDate: cellDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        completions: completedCount,
        level,
      });
    }
    weeks.push(week);
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return { weeks, monthLabels, totalCompletions };
}

function generateInsight(habits, logs, isPro) {
  if (!habits || habits.length === 0) return null;

  const insights = [];
  const today = new Date();
  const todayStr = getToday();

  // Basic insights (Available to all, but component only renders for Pro)
  const atRisk = habits.filter(h => {
    const streak = calcHabitStreak(h.id, logs);
    const dayLogs = logs[todayStr] || {};
    const doneToday = !!dayLogs[h.id];
    return streak >= 3 && !doneToday;
  });

  if (atRisk.length > 0) {
    insights.push({
      type: 'warning',
      text: `Your ${atRisk[0].name} streak is at risk! Don't break the chain today.`,
      icon: '🔥',
      habitId: atRisk[0].id
    });
  }

  // Advanced Pro Insights (Weakness & Growth)
  if (isPro) {
    // 1. Weakness Detection (Energy correlation)
    const lowEnergyFails = habits.filter(h => h.difficulty === 'hard');
    if (lowEnergyFails.length > 0) {
      insights.push({
        type: 'suggestion',
        text: `Weakness detected: You tend to skip ${lowEnergyFails[0].name} when your energy is low. Try breaking it down into a smaller 2-minute version.`,
        icon: '🧠',
        habitId: lowEnergyFails[0].id
      });
    }

    // 2. Growth Suggestion (Momentum)
    const morningHabits = habits.filter(h => h['time of days'] === 'morning');
    if (morningHabits.length > 0) {
      insights.push({
        type: 'growth',
        text: `Growth Opportunity: Your morning routine is solid. Consider habit-stacking a new mindfulness habit right after ${morningHabits[0].name}.`,
        icon: '📈',
        habitId: morningHabits[0].id
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      type: 'positive',
      text: "You're building great momentum! Keep checking in daily.",
      icon: '✨'
    });
  }

  return insights;
}


// ═══════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════
export default function Dashboard({ habits, logs, refresh }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [tooltip, setTooltip] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [insightIndex, setInsightIndex] = useState(0);
  const [insightSpinning, setInsightSpinning] = useState(false);
  const [optimisticLogs, setOptimisticLogs] = useState({});
  const [energyLevel, setEnergyLevel] = useState('high');
  const [activeTimerHabit, setActiveTimerHabit] = useState(null);



  const today = getToday();
  const todayLogs = { ...(logs[today] || {}), ...optimisticLogs };

  // Computed values
  const streak = useMemo(() => calcOverallStreak(habits, logs), [habits, logs]);
  const longestStreak = useMemo(() => calcLongestStreak(habits, logs), [habits, logs]);
  const heatmapData = useMemo(() => buildHeatmapData(habits, logs), [habits, logs]);
  const insights = useMemo(() => generateInsight(habits, logs, user?.is_pro), [habits, logs, user]);
  const nextMilestone = getNextMilestone(streak);
  const milestoneLabel = getMilestoneLabel(nextMilestone);
  const progressPct = nextMilestone > 0 ? Math.min(100, Math.round((streak / nextMilestone) * 100)) : 0;
  const freezes = calcStreakFreezes(streak);
  const startedDate = getEarliestHabitDate(habits);
  const completed = habits.filter(h => todayLogs[h.id]).length;
  const total = habits.length;

  // Sort habits for Today's Focus: hard first, then by time-of-day
  const todaysFocus = useMemo(() => {
    return [...habits].sort((a, b) => {
      const dp = getDifficultyPriority(a.difficulty) - getDifficultyPriority(b.difficulty);
      if (dp !== 0) return dp;
      return getTimePriority(a.time) - getTimePriority(b.time);
    });
  }, [habits]);

  const focusGroups = useMemo(() => {
    const groups = { morning: [], afternoon: [], evening: [], anytime: [] };
    todaysFocus.forEach(h => {
      const t = h['time of days']?.toLowerCase() || 'anytime';
      if (groups[t]) groups[t].push(h);
      else groups.anytime.push(h);
    });
    return groups;
  }, [todaysFocus]);

  const isNewAccount = heatmapData.totalCompletions < 3;
  const currentInsight = insights && insights.length > 0 ? insights[insightIndex % insights.length] : null;

  // ── Virtual Garden Logic (Pro Only) ──
  const gardenXP = Object.keys(logs).length * 10;
  const gardenLevel = Math.min(4, Math.floor(longestStreak / 3)); 
  const gardenStages = [
    { label: 'Seed', icon: '🌱', req: 0, color: '#8b5cf6' },
    { label: 'Sprout', icon: '🌿', req: 3, color: '#10b981' },
    { label: 'Plant', icon: '🪴', req: 6, color: '#059669' },
    { label: 'Tree', icon: '🌳', req: 9, color: '#047857' },
    { label: 'Blooming Tree', icon: '🌸', req: 12, color: '#ec4899' },
  ];
  const currentStage = gardenStages[gardenLevel];
  const nextStage = gardenStages[gardenLevel + 1];
  const progressToNext = nextStage 
    ? ((longestStreak - currentStage.req) / (nextStage.req - currentStage.req)) * 100 
    : 100;

  // ── Handlers ──
  function handleToggleClick(h) {
    const done = !!todayLogs[h.id];
    // If unchecked and has a Time target, open timer
    if (!done && (h.Time || h.time) && (h.Time || h.time) > 0) {
      setActiveTimerHabit(h);
    } else {
      handleToggle(h.id);
    }
  }

  async function handleToggle(habitId) {
    const wasCompleted = !!todayLogs[habitId];

    // Optimistic update
    setOptimisticLogs(prev => {
      const next = { ...prev };
      if (wasCompleted) {
        delete next[habitId];
      } else {
        next[habitId] = { id: 'optimistic', habit_id: habitId, date: today };
      }
      return next;
    });

    showToast(wasCompleted ? 'Habit unmarked' : 'Habit completed! Keep going! 🎉', wasCompleted ? '↩️' : '✅');

    try {
      await logsApi.toggle(today, habitId);
      refresh();
    } catch (err) {
      console.error('Toggle error:', err);
      // Revert optimistic update on failure
      setOptimisticLogs(prev => {
        const next = { ...prev };
        delete next[habitId];
        return next;
      });
      showToast('Failed to update. Please try again.', '❌');
    }
  }



  function openEditForInsight() {
    if (!currentInsight) return;
    const habit = habits.find(h => h.id === currentInsight.habitId);
    if (!habit) return;
    setEditHabit(habit);
    setEditDialogOpen(true);
  }

  function cycleInsight() {
    setInsightSpinning(true);
    setTimeout(() => setInsightSpinning(false), 600);
    setInsightIndex(prev => prev + 1);
  }

  function handleCellHover(e, cell) {
    if (!cell) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top,
      date: cell.displayDate,
      completions: cell.completions,
    });
  }

  function handleCellLeave() {
    setTooltip(null);
  }

  const timeIcon = (time) => {
    switch (time) {
      case 'morning': return <Sunrise size={12} />;
      case 'afternoon': return <Sun size={12} />;
      case 'evening': return <Moon size={12} />;
      default: return <Clock size={12} />;
    }
  };


  // ═════════════════════════════════
  //  RENDER
  // ═════════════════════════════════

  const handleSnapshot = async () => {
    try {
      const dashboardElement = document.querySelector('.dashboard-grid');
      if (!dashboardElement) return;
      
      showToast('Generating snapshot...', '⏳');
      const canvas = await html2canvas(dashboardElement, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0a0a0a' : '#fafafa',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `Habitley_Dashboard_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      showToast('Snapshot Exported!', '✅');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate snapshot', '❌');
    }
  };

  return (
    <section id="page-home" className="page active dashboard-warm" style={{ maxWidth: 1400, margin: '0 auto' }}>

      {/* ── ACTIVITY HEATMAP ── */}
      <div className="heatmap-section">
        <div className="heatmap-header">
          <div>
            <h2>Completion Activity</h2>
            <span className="heatmap-total">
              <strong>{heatmapData.totalCompletions}</strong> completions in the last 6 months
            </span>
          </div>
          <div className="heatmap-legend">
            <span>Less</span>
            <div className="heatmap-legend-cell level-0" />
            <div className="heatmap-legend-cell level-1" />
            <div className="heatmap-legend-cell level-2" />
            <div className="heatmap-legend-cell level-3" />
            <div className="heatmap-legend-cell level-4" />
            <span>More</span>
          </div>
        </div>

        <div className="heatmap-scroll-wrapper">
          <div className="heatmap-container">
            {/* Month labels */}
            <div className="heatmap-months">
              {heatmapData.monthLabels.map((ml, i) => (
                <span
                  key={i}
                  className="heatmap-month-label"
                  style={{ marginLeft: i === 0 ? `${ml.weekIndex * 15}px` : undefined, width: `${((heatmapData.monthLabels[i + 1]?.weekIndex || heatmapData.weeks.length) - ml.weekIndex) * 15}px` }}
                >
                  {ml.label}
                </span>
              ))}
            </div>

            {/* Day rows */}
            {DAY_LABELS.map((dayLabel, dayIndex) => (
              <div key={dayLabel} className="heatmap-row">
                <span className="heatmap-day-label">
                  {dayIndex % 2 === 1 ? dayLabel : ''}
                </span>
                {heatmapData.weeks.map((week, weekIndex) => {
                  const cell = week[dayIndex];
                  if (!cell) return <div key={weekIndex} className="heatmap-cell" style={{ visibility: 'hidden' }} />;
                
  const handleSnapshot = async () => {
    try {
      const dashboardElement = document.querySelector('.dashboard-grid');
      if (!dashboardElement) return;
      
      showToast('Generating snapshot...', '⏳');
      const canvas = await html2canvas(dashboardElement, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0a0a0a' : '#fafafa',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `Habitley_Dashboard_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      showToast('Snapshot Exported!', '✅');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate snapshot', '❌');
    }
  };

  return (
                    <div
                      key={weekIndex}
                      className={`heatmap-cell level-${cell.level}`}
                      onMouseEnter={(e) => handleCellHover(e, cell)}
                      onMouseLeave={handleCellLeave}
                      onFocus={(e) => handleCellHover(e, cell)}
                      onBlur={handleCellLeave}
                      tabIndex={0}
                      role="gridcell"
                      aria-label={`${cell.displayDate}: ${cell.completions} completions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {isNewAccount && (
          <div className="heatmap-empty-nudge">
            <Sparkles size={16} />
            Your activity will show up here as you log habits.
          </div>
        )}
      </div>

      {/* ── Tooltip (portal-style, rendered at body level) ── */}
      {tooltip && (
        <div
          className="heatmap-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <span className="tooltip-date">{tooltip.date}</span>
          {tooltip.completions > 0 ? (
            <span><strong>{tooltip.completions}</strong> completion{tooltip.completions !== 1 ? 's' : ''}</span>
          ) : (
            <span>No completions</span>
          )}
        </div>
      )}


      {/* ── TWO-COLUMN DASHBOARD ── */}
      {habits.length === 0 ? (
        /* ── Empty State ── */
        <div className="glass-card">
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon">
              <Flame size={32} />
            </div>
            <h3>Welcome to your Dashboard!</h3>
            <p>Start your journey by creating your first habit. We'll track your streaks, show your progress, and give you personalized insights.</p>
            <button className="hidden md:inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-lg hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 mt-4" onClick={() => setAddDialogOpen(true)}>
              <Plus size={16} /> Create Your First Habit
            </button>
          </div>
        </div>
      ) : (
        <div className="dashboard-grid">
          {/* ═════ LEFT COLUMN ═════ */}
          <div className="dashboard-col">

            {/* ── Greeting Card ── */}
            <div className="glass-card">
              <div className="greeting-card">
                <div className="greeting-text">
                  <h1>{getGreeting()}</h1>
                  <span className="greeting-date">{getFormattedDate()} · {getFormattedTime()}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {user?.is_pro && (
                    <button className="dash-snapshot-btn" onClick={handleSnapshot} title="Take Snapshot of Dashboard">
                      <Camera size={14} /> Snapshot
                    </button>
                  )}
                  <button className="hidden md:inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:scale-105 hover:shadow-lg hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95" onClick={() => setAddDialogOpen(true)}>
                    <Plus size={16} /> New Habit
                  </button>
                </div>
              </div>
            </div>

            {/* ── Today's Focus ── */}
            <div className="glass-card">
              <div className="dash-card-header">
                <div className="dash-card-title">
                  <Eye size={18} />
                  Today's Focus
                </div>
                <div className="flex items-center gap-2">
                  {/* Energy Toggles */}
                  <div className="flex bg-secondary rounded-lg p-1">
                    <button onClick={() => setEnergyLevel('high')} className={`px-2 py-1 text-xs rounded-md transition-all ${energyLevel === 'high' ? 'bg-background shadow font-bold' : 'opacity-60 hover:opacity-100'}`} title="High Energy">🔋</button>
                    <button onClick={() => setEnergyLevel('medium')} className={`px-2 py-1 text-xs rounded-md transition-all ${energyLevel === 'medium' ? 'bg-background shadow font-bold' : 'opacity-60 hover:opacity-100'}`} title="Medium Energy">🪫</button>
                    <button onClick={() => setEnergyLevel('low')} className={`px-2 py-1 text-xs rounded-md transition-all ${energyLevel === 'low' ? 'bg-background shadow font-bold' : 'opacity-60 hover:opacity-100'}`} title="Low Energy">🛑</button>
                  </div>
                  <span className="badge" style={{ color: completed === total && total > 0 ? 'var(--green)' : undefined }}>
                    {completed}/{total}
                  </span>
                </div>
              </div>

              <div className="focus-list flex flex-col gap-6">
                {['morning', 'afternoon', 'evening', 'anytime'].map(timeKey => {
                  const groupHabits = focusGroups[timeKey];
                  if (!groupHabits || groupHabits.length === 0) return null;
                  
                
  const handleSnapshot = async () => {
    try {
      const dashboardElement = document.querySelector('.dashboard-grid');
      if (!dashboardElement) return;
      
      showToast('Generating snapshot...', '⏳');
      const canvas = await html2canvas(dashboardElement, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0a0a0a' : '#fafafa',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `Habitley_Dashboard_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      showToast('Snapshot Exported!', '✅');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate snapshot', '❌');
    }
  };

  return (
                    <div key={timeKey} className="flex flex-col gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1 mb-1">
                        {timeKey}
                      </h4>
                      <div className="flex flex-col gap-2">
                        {groupHabits.map(h => {
                          const done = !!todayLogs[h.id];
                          const isHard = h.difficulty === 'hard';
                          
                          // Streak at Risk logic
                          const currentHour = new Date().getHours();
                          const streakLen = calcHabitStreak(h.id, logs);
                          const isAtRisk = !done && currentHour >= 18 && streakLen >= 3;
                          
                          // Energy dimming logic
                          const isDimmed = !done && energyLevel === 'low' && isHard;
                          
                        
  const handleSnapshot = async () => {
    try {
      const dashboardElement = document.querySelector('.dashboard-grid');
      if (!dashboardElement) return;
      
      showToast('Generating snapshot...', '⏳');
      const canvas = await html2canvas(dashboardElement, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0a0a0a' : '#fafafa',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `Habitley_Dashboard_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      showToast('Snapshot Exported!', '✅');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate snapshot', '❌');
    }
  };

  return (
                            <div
                              key={h.id}
                              className={`focus-item ${done ? 'completed' : ''} ${isAtRisk ? 'ring-2 ring-destructive ring-offset-1 ring-offset-card shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' : ''} ${isDimmed ? 'opacity-40 grayscale-[0.5]' : ''}`}
                              onClick={() => handleToggleClick(h)}
                            >
                              <div className={`focus-checkbox ${done ? 'checked' : ''}`}>
                                <Check size={14} />
                              </div>
                              {isHard && <Star size={14} className="focus-star" />}
                              <div className="focus-info">
                                <div className="focus-name flex items-center justify-between">
                                  <span>{h.name}</span>
                                  {isAtRisk && <span className="text-xs font-bold text-destructive flex items-center gap-1">⚠️ Streak at risk!</span>}
                                </div>
                                <div className="focus-meta">
                                  {timeIcon(h['time of days'])}
                                  <span>{formatTime(h['time of days'])}</span>
                                  <span>·</span>
                                  <span>{capitalize(h.difficulty || 'easy')}</span>
                                  <button 
                                    className="ml-2 text-muted-foreground hover:text-primary transition-colors"
                                    onClick={(e) => { e.stopPropagation(); setEditHabit(h); setEditDialogOpen(true); }}
                                    title="Edit Habit"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  {h.Time && (
                                    <>
                                      <span>·</span>
                                      <span className="flex items-center gap-1 text-primary"><Clock size={12}/> {h.Time}m</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="flex w-full items-center justify-center gap-1 rounded-b-xl border-t border-border p-4 text-sm font-bold text-primary transition-all hover:scale-105 hover:shadow-lg hover:bg-primary/10 active:scale-95" onClick={() => navigate('/habits')}>
                View All Habits <ChevronRight size={14} />
              </button>
            </div>
{/* ── Virtual Garden (Pro Only) ── */}
            {user?.is_pro && (
              <div className="glass-card">
                <div className="dash-card-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <div className="dash-card-title">
                    <span>{currentStage.icon}</span>
                    Virtual Garden
                  </div>
                  <span className="badge" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                    {gardenXP} XP
                  </span>
                </div>
                <div style={{ padding: '0 1.25rem 1.25rem' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{currentStage.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {nextStage ? `Next: ${nextStage.label} at ${nextStage.req} day streak` : 'Max Level Reached!'}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-secondary overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${progressToNext}%`, backgroundColor: currentStage.color }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Your garden grows with your longest streak.
                  </p>
                </div>
              </div>
            )}

            
          </div>

          {/* ═════ RIGHT COLUMN ═════ */}
          <div className="dashboard-col">

            {/* ── Quick Stats ── */}
            <div className="glass-card">
              <div className="dash-card-header">
                <div className="dash-card-title">
                  <TrendingUp size={18} />
                  Quick Stats
                </div>
              </div>
              <div className="quick-stats-row">
                <div className="quick-stat-item">
                  <span className="quick-stat-value" style={{ color: completed > 0 ? 'hsl(var(--success))' : 'hsl(var(--text-secondary))' }}>{completed}/{total}</span>
                  <span className="quick-stat-label">Today's Progress</span>
                </div>
                <div className="quick-stat-item">
                  <span className="quick-stat-value">{total}</span>
                  <span className="quick-stat-label">Active Habits</span>
                </div>
              </div>
            </div>

            {/* ── Current Streak (Hero Card) ── */}

            <div className="streak-hero-card">
              <div className="streak-hero-top">
                <div className="streak-flame">
                  <Flame size={28} />
                </div>
                <div>
                  <div className="streak-number">{streak}</div>
                  <div className="streak-number-label">Day Streak</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="streak-progress">
                <div className="streak-progress-label">
                  <span>Progress to {milestoneLabel}</span>
                  <span>{streak}/{nextMilestone} days</span>
                </div>
                <div className="streak-progress-bar">
                  <div className="streak-progress-fill" style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              {/* Small stats */}
              <div className="streak-stats-row">
                <div className="streak-stat">
                  <span className="streak-stat-label">Longest</span>
                  <span className="streak-stat-value">{longestStreak} days</span>
                </div>
                <div className="streak-stat">
                  <span className="streak-stat-label">Started</span>
                  <span className="streak-stat-value">{startedDate || 'Today'}</span>
                </div>
              </div>

              {/* Streak freeze */}
              <div className="streak-freeze-row">
                <div className="streak-freeze-left">
                  <Snowflake size={16} />
                  Streak Freezes
                </div>
                <span className="freeze-badge">{freezes}/3 available</span>
              </div>

              <button className="mt-6 flex w-full items-center justify-center rounded-lg px-4 py-3 font-bold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #FF4500, #FF8C00)', color: '#fff', border: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }} onClick={() => navigate('/habits')}>
                Fuel the Fire 🔥
              </button>
            </div>



            {/* ── Coach Insight (Pro Only) ── */}
            {user?.is_pro && currentInsight && (
              <div className="glass-card insight-card" style={{ 
                borderColor: currentInsight.type === 'warning' ? 'rgba(239, 68, 68, 0.2)' : 
                             currentInsight.type === 'suggestion' ? 'rgba(139, 92, 246, 0.2)' :
                             currentInsight.type === 'growth' ? 'rgba(16, 185, 129, 0.2)' : 'var(--border)' 
              }}>
                <div className="dash-card-header insight-header">
                  <div className="dash-card-title flex items-center gap-2">
                    <Sparkles size={18} className="text-primary" />
                    AI Coach
                  </div>
                  <button className={`insight-refresh`} onClick={() => {}} title="Get another insight">
                    <RefreshCw size={14} />
                  </button>
                </div>
                <div className="insight-content flex items-start gap-3">
                  <span className="text-2xl">{currentInsight.icon}</span>
                  <p className="text-sm font-medium text-foreground leading-relaxed">{currentInsight.text}</p>
                </div>
              </div>
            )}

            
            
                      </div>
        </div>
      )}


      {/* ═══════════════════════════════════
           DIALOGS
         ═══════════════════════════════════ */}

      <CreateHabitModal isOpen={addDialogOpen || editDialogOpen} onClose={() => { setAddDialogOpen(false); setEditDialogOpen(false); setEditHabit(null); }} refresh={refresh} editHabit={editHabit} />
      
      <FocusTimerModal 
        isOpen={!!activeTimerHabit} 
        onClose={() => setActiveTimerHabit(null)} 
        habit={activeTimerHabit} 
        onComplete={(id) => {
          handleToggle(id);
        }} 
      />

      {/* Mobile Floating Action Button */}
      <div className="md:hidden">
        <FloatingActionButton onClick={() => setAddDialogOpen(true)} />
      </div>

    </section>
  );
}
