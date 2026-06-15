// ──────────── Utility Helpers ────────────

export function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function dateKey(d) {
  const dt = typeof d === 'string' ? new Date(d) : d;
  return dt.toISOString().split('T')[0];
}

export function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export function categoryLabel(cat) {
  const labels = {
    health: '🏃 Health',
    productivity: '💼 Productivity',
    mindfulness: '🧘 Mindfulness',
    learning: '📚 Learning',
    social: '🤝 Social',
  };
  return labels[cat] || capitalize(cat);
}

export function formatTime(time) {
  const labels = {
    morning: '🌅 Morning',
    afternoon: '☀️ Afternoon',
    evening: '🌙 Evening',
    anytime: '⏰ Anytime',
  };
  return labels[time] || capitalize(time);
}

export function difficultyLabel(diff) {
  const labels = {
    easy: '🟢 Easy',
    medium: '🟡 Medium',
    hard: '🔴 Hard',
  };
  return labels[diff] || capitalize(diff || 'easy');
}

export function calcOverallStreak(habits, logs) {
  if (!habits || habits.length === 0) return 0;
  const today = getToday();
  const todayLogs = logs[today] || {};
  const todayDone = habits.every(h => todayLogs[h.id]);
  let startDay = todayDone ? 0 : 1;
  let streak = 0;

  for (let d = startDay; d < 365; d++) {
    const dk = dateKey(new Date(Date.now() - d * 86400000));
    const dayLogs = logs[dk] || {};
    if (habits.every(h => dayLogs[h.id])) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function calcHabitStreak(habitId, logs) {
  const today = getToday();
  const todayDone = logs[today] && logs[today][habitId];
  let startDay = todayDone ? 0 : 1;
  let streak = 0;

  for (let d = startDay; d < 365; d++) {
    const dk = dateKey(new Date(Date.now() - d * 86400000));
    if (logs[dk] && logs[dk][habitId]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
